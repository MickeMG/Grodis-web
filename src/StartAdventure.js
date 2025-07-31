import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StartAdventure() {
  const [names, setNames] = useState(['Annie']);
  const [genders, setGenders] = useState(['kvinna']);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(-1);
  const dropdownRef = useRef(null);
  const gendersRef = useRef(genders);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setGenderDropdownOpen(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    gendersRef.current = genders;
  }, [genders]);

  useEffect(() => {
    if (showModal && stories.length === 0 && !loading) {
      setLoading(true);
      fetch('/api/stories2')
        .then(res => {
          if (!res.ok) throw new Error('Kunde inte hämta stories');
          return res.json();
        })
        .then(data => {
          setStories(data);
          setError(null);
        })
        .catch(err => {
          setError('Kunde inte hämta stories.');
        })
        .finally(() => setLoading(false));
    }
  }, [showModal, stories.length, loading]);

  useEffect(() => {
    // Normalisera ALLTID genders-arrayen till 'man' eller 'kvinna' vid mount
    setGenders(genders => genders.map(g => g === 'pojke' ? 'man' : g === 'flicka' ? 'kvinna' : g));
  }, []);

  const handleNameChange = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleGenderChange = (index, value) => {
    const newGenders = [...genders];
    newGenders[index] = value === 'pojke' ? 'man' : value === 'flicka' ? 'kvinna' : value;
    setGenders(newGenders);
  };

  const handleAdd = () => {
    if (names.length < 3) {
      setNames([...names, '']);
      setGenders([...genders, 'kvinna']);
    }
  };

  const handleRemove = (index) => {
    setNames(names.filter((_, i) => i !== index));
    setGenders(genders.filter((_, i) => i !== index));
  };

  const filteredStories = () => {
    let filtered = stories;
    
    // Filtrera baserat på antal deltagare först
    const participantCount = names.length;
    filtered = stories.filter(story => {
      // Om story har participant_count, matcha det med antal deltagare
      if (story.participant_count) {
        return story.participant_count === participantCount;
      }
      // Om story inte har participant_count, visa bara för 1 deltagare (bakåtkompatibilitet)
      return participantCount === 1;
    });
    
    // Filtrera baserat på sökterm sedan
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(story => 
        (story.title?.toLowerCase() || '').includes(searchLower) ||
        (story.name?.toLowerCase() || '').includes(searchLower) ||
        (story.description?.toLowerCase() || '').includes(searchLower)
      );
    }
    
    // Sedan applicera sorterings-filter
    switch (filter) {
      case 'favorites':
        // Placeholder för favoriter
        return filtered;
      case 'latest':
        return [...filtered].sort((a, b) => {
          const idA = typeof a.id === 'string' ? parseInt(a.id, 10) || 0 : a.id;
          const idB = typeof b.id === 'string' ? parseInt(b.id, 10) || 0 : b.id;
          return idB - idA;
        });
      case 'oldest':
        return [...filtered].sort((a, b) => {
          const idA = typeof a.id === 'string' ? parseInt(a.id, 10) || 0 : a.id;
          const idB = typeof b.id === 'string' ? parseInt(b.id, 10) || 0 : b.id;
          return idA - idB;
        });
      case 'random':
        return [...filtered].sort(() => Math.random() - 0.5);
      default:
        return filtered;
    }
  };

  // Pronomen-map för personalisering
  const pronounMap = {
    'man': 'han',
    'kvinna': 'hon',
    'pojke': 'han',
    'flicka': 'hon'
  };

  // Ersätt platshållare för namn och pronomen för flera personer
  function personalize(text) {
    if (!text) return text;
    let result = text;
    const mainName = names[0] || "Kim";
    const mainPronoun = pronounMap[genders[0]] || "hen";
    
    // Ersätt {namn} och {pronomen} (bakåtkompatibilitet)
    result = result
      .replace(/\{namn\}/gi, mainName)
      .replace(/\{pronomen\}/gi, mainPronoun)
      .replace(/\{hans\/hennes\}/gi, mainPronoun === 'han' ? 'hans' : 'hennes')
      .replace(/\{honom\/henne\}/gi, mainPronoun === 'han' ? 'honom' : 'henne')
      .replace(/\{pojke\/flicka\}/gi, mainPronoun === 'han' ? 'pojke' : 'flicka');
    // Ersätt {person1}, {han/hon1}, {person2}, {han/hon2} osv.
    for (let i = 0; i < names.length; i++) {
      const name = names[i] || '';
      const gender = genders[i] || 'hen';
      const pronoun = pronounMap[gender] || 'hen';
      // {person1}, {person2} ...
      const nameRegex = new RegExp(`\\{person${i+1}\\}`, 'gi');
      result = result.replace(nameRegex, name);
      // {person1s}, {person2s} ...
      const possessiveRegex = new RegExp(`\\{person${i+1}s\\}`, 'gi');
      result = result.replace(possessiveRegex, name ? name + 's' : '');
      // {han/hon1}, {han/hon2} ...
      const pronounRegex = new RegExp(`\\{han\/hon${i+1}\\}`, 'gi');
      result = result.replace(pronounRegex, pronoun);
      // {hans/hennes1}, {hans/hennes2} ...
      const possessiveRegex2 = new RegExp(`\\{hans\/hennes${i+1}\\}`, 'gi');
      result = result.replace(possessiveRegex2, pronoun === 'han' ? 'hans' : 'hennes');
      // {honom/henne1}, {honom/henne2} ...
      const objectRegex = new RegExp(`\\{honom\/henne${i+1}\\}`, 'gi');
      result = result.replace(objectRegex, pronoun === 'han' ? 'honom' : 'henne');
      // {pojke/flicka1}, {pojke/flicka2} ...
      const genderWordRegex = new RegExp(`\\{pojke\/flicka${i+1}\\}`, 'gi');
      result = result.replace(genderWordRegex, pronoun === 'han' ? 'pojke' : 'flicka');
      // {sig själv1}, {sig själv2} ...
      const selfRegex = new RegExp(`\\{sig själv${i+1}\\}`, 'gi');
      result = result.replace(selfRegex, 'sig själv');
    }
    return result;
  }

  const handleChooseStory = (story) => {
    setSelectedStory(story);
    setShowModal(false);
    setTimeout(() => {
      const normalizedGenders = gendersRef.current.map(g => {
        if (g === 'pojke') return 'man';
        if (g === 'flicka') return 'kvinna';
        return g;
      });
      console.log('SKICKAR:', normalizedGenders);
      navigate(`/read/${story.id}`, { state: { names, genders: normalizedGenders } });
    }, 300);
  };

  return (
    <div className="min-h-screen relative" style={{ fontFamily: 'Kidzone', textShadow: '0 2px 8px #0008' }}>
      {/* Bakgrundsbild */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/grodisbackground.png"
          alt="Bakgrund"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dialogruta */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-1">
        {/* Grodbild */}
        <div className="flex justify-center mb-2" style={{ zIndex: 9999, position: 'relative' }}>
          <img 
            src="/images/logo.png" 
            alt="Grodis logo" 
            className="h-62 md:h-88 w-auto"
          />
        </div>
        {/* Rubrik */}
        <div className="rounded-2xl px-8 py-8 mb-6 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 border-2 border-white/80 shadow-xl" style={{maxWidth: 420, width: '100%', marginTop: '-50px'}}>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-xl text-center" style={{textShadow: '0 2px 8px #0008', fontFamily: 'Kidzone'}}>Vad heter du?</h1>
        </div>
        {/* Namnfält */}
        <div className="flex flex-col gap-4 w-full mb-4" style={{maxWidth: 340, width: '100%'}}>
          {names.map((name, idx) => (
            <div key={idx} className="flex items-center" style={{
              background: 'linear-gradient(90deg, #ffe066 0%, #ffd43b 60%, #ffb300 100%)',
              borderRadius: '1rem',
              boxShadow: '0 4px 24px 0 rgba(255, 180, 0, 0.25), 0 1.5px 0 #fff8',
              border: '2px solid #fff8',
              padding: '0.75rem 1.25rem',
              maxWidth: 340,
              width: '100%',
              gap: '0.5rem',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <input
                type="text"
                value={name}
                maxLength={20}
                onChange={e => handleNameChange(idx, e.target.value)}
                placeholder={idx === 0 ? 'Namn' : 'Namn'}
                className="flex-1 text-lg font-semibold outline-none placeholder-white rounded-xl border-none focus:ring-2 focus:ring-yellow-300"
                style={{
                  color: '#fff',
                  fontFamily: 'Kidzone',
                  textShadow: '0 2px 12px #000a, 0 1px 0 #ffb300',
                  letterSpacing: '0.5px',
                  fontWeight: 700,
                  fontSize: '2.5rem',
                  minWidth: 120,
                  maxWidth: 220,
                  margin: '0 0.5rem',
                  paddingLeft: 48,
                  paddingRight: 48,
                  paddingTop: 8,
                  paddingBottom: 8,
                  height: '36px',
                  overflow: 'visible',
                  boxSizing: 'content-box',
                  background: 'transparent'
                }}
              />
              {/* Custom gender dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative', minWidth: 90 }}>
                <button
                  type="button"
                  onClick={() => setGenderDropdownOpen(genderDropdownOpen === idx ? -1 : idx)}
                  className="rounded-xl px-4 py-2 font-bold border-2 border-white/70 shadow-md focus:outline-none"
                  style={{
                    background: 'linear-gradient(90deg, #ffb300 0%, #ff9800 100%)',
                    color: '#fff',
                    fontFamily: 'Kidzone',
                    textShadow: '0 2px 8px #0008',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    fontSize: '1.3rem',
                    minWidth: 80,
                    borderRadius: '1rem',
                    boxShadow: '0 2px 8px #0008'
                  }}
                >
                  {genders[idx] === 'kvinna' ? 'Flicka' : 'Pojke'}
                  <span style={{ marginLeft: 8, fontSize: 18, verticalAlign: 'middle' }}>▼</span>
                </button>
                {genderDropdownOpen === idx && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    zIndex: 20,
                    background: 'linear-gradient(90deg, #ffb300 0%, #ff9800 100%)',
                    borderRadius: '1rem',
                    boxShadow: '0 8px 32px #0008',
                    minWidth: 100,
                    padding: '0.25rem 0',
                    border: '2px solid #fff8',
                  }}>
                    {[
                      { value: 'kvinna', label: 'Flicka' },
                      { value: 'man', label: 'Pojke' }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setGenderDropdownOpen(-1); handleGenderChange(idx, opt.value); }}
                        style={{
                          display: 'block',
                          width: '100%',
                          background: 'none',
                          border: '2px solid #fff',
                          color: '#fff',
                          fontFamily: 'Kidzone',
                          fontWeight: 700,
                          textShadow: '0 2px 8px #0008',
                          letterSpacing: '0.08em',
                          fontSize: '1.3rem',
                          padding: '0.5rem 1.5rem',
                          borderRadius: '0.75rem',
                          cursor: 'pointer',
                          margin: '0.1rem 0',
                          transition: 'background 0.2s',
                          boxShadow: '0 2px 8px #0008',
                        }}
                        onMouseDown={e => e.preventDefault()}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {names.length > 1 && (
                <button
                  onClick={() => handleRemove(idx)}
                  className="ml-2 text-white hover:text-red-200 p-1"
                  title="Ta bort namn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {/* Lägg till-knapp */}
        <div className="flex items-center mb-6" style={{gap: '1rem'}}>
          <button
            onClick={handleAdd}
            disabled={names.length >= 3}
            className={`bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-bold py-2 px-6 rounded-xl shadow-md border-2 border-white/70 transition-all duration-200 ${
              names.length >= 3 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 hover:shadow-lg'
            }`}
            style={{
              fontFamily: 'Kidzone',
              textShadow: '0 2px 8px #0008',
              fontWeight: 700
            }}
          >
            Lägg till fler
          </button>
          {names.length >= 3 && (
            <span style={{color: '#fff', fontFamily: 'Kidzone', fontWeight: 700, fontSize: '1.3rem', textShadow: '0 2px 8px #0008'}}>
              (Max 3 deltagare)
            </span>
          )}
        </div>
        
        {/* Deltagare-indikator */}
        <div className="mb-4 text-center">
          <div style={{
            color: '#fff', 
            fontFamily: 'Kidzone', 
            fontWeight: 700, 
            fontSize: '1.1rem', 
            textShadow: '0 2px 8px #0008',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            padding: '0.5rem 1rem',
            display: 'inline-block',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            {names.length === 1 ? (
              '👤 En deltagare - Visar stories för en person'
            ) : names.length === 2 ? (
              '👥 Två deltagare - Visar stories för två personer'
            ) : (
              '👥👤 Tre deltagare - Visar stories för tre personer'
            )}
          </div>
        </div>
        {/* Välj Story-knapp */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-8 rounded-2xl text-5xl font-bold text-white bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 border-2 border-white/80 shadow-xl mt-2 hover:scale-105 transition-all duration-200"
          style={{
            fontFamily: 'Kidzone',
            textShadow: '0 2px 8px #0008',
            fontWeight: 700,
            maxWidth: 420,
            width: '100%'
          }}
        >
                                    {selectedStory ? personalize((selectedStory.title || selectedStory.name || '').replace(/_/g, ' ')) : 'Välj Story här'}
        </button>
      </div>
      {/* Modal för att välja story */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div 
            className="rounded-2xl p-6 md:p-8 shadow-2xl max-w-2xl w-full mx-4 relative"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(139, 69, 19, 0.95) 0%, 
                  rgba(210, 105, 30, 0.95) 25%, 
                  rgba(255, 140, 0, 0.95) 50%, 
                  rgba(178, 34, 34, 0.95) 75%, 
                  rgba(139, 69, 19, 0.95) 100%
                )
              `,
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              maxHeight: '90vh'
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white hover:text-red-300 text-3xl font-bold z-10"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.3s ease'
              }}
              title="Stäng"
            >
              ×
            </button>
            
            {/* Header med sökfält */}
            <div className="text-center mb-6">
              <h2 
                className="text-3xl font-bold mb-6"
                style={{
                  color: 'white',
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
                  fontFamily: 'Kidzone'
                }}
              >
                🔍 Sök bland storys...
              </h2>
              
              {/* Sökfält */}
              <div 
                className="relative mb-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '25px',
                  padding: '5px',
                  border: '2px solid rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
              >
                <input
                  type="text"
                  placeholder="Sök bland storys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '25px',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: '#8B4513',
                    fontWeight: '600'
                  }}
                />
              </div>
              
              {/* Filterknappar */}
              <div className="flex justify-center gap-3 mb-6 flex-wrap">
                {[
                  { key: 'all', label: 'Alla' },
                  { key: 'favorites', label: 'Favoriter' },
                  { key: 'latest', label: 'Lästa' },
                  { key: 'oldest', label: 'Olästa' },
                  { key: 'random', label: 'Slumpa' }
                ].map(filterOption => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.6)',
                      backgroundColor: filter === filterOption.key ? '#d2691e' : 'rgba(139, 69, 19, 0.7)',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                      fontSize: '14px',
                      transform: filter === filterOption.key ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: filter === filterOption.key ? 
                        '0 4px 12px rgba(210, 105, 30, 0.4)' : 
                        '0 2px 8px rgba(139, 69, 19, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      if (filter !== filterOption.key) {
                        e.target.style.backgroundColor = 'rgba(160, 82, 45, 0.8)';
                        e.target.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filter !== filterOption.key) {
                        e.target.style.backgroundColor = 'rgba(139, 69, 19, 0.7)';
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>
            
            {loading && (
              <div 
                className="text-center font-bold py-8"
                style={{
                  color: 'white',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                  fontSize: '18px'
                }}
              >
                Laddar stories...
              </div>
            )}
            
            {error && (
              <div 
                className="text-center font-bold py-8"
                style={{
                  color: '#ff6b6b',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                  fontSize: '18px'
                }}
              >
                {error}
              </div>
            )}
            
            {!loading && !error && (
              <>
                {/* Stories-matchning indikator */}
                <div 
                  className="text-center mb-4"
                  style={{
                    color: 'white',
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                    fontSize: '16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {filteredStories().length === 0 ? (
                    `Inga stories för ${names.length} deltagare`
                  ) : (
                    `${filteredStories().length} story${filteredStories().length === 1 ? '' : 's'} för ${names.length} deltagare`
                  )}
                </div>
                
                <div 
                  style={{
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    padding: '10px 5px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d2691e rgba(255, 255, 255, 0.2)'
                  }}
                >
                {filteredStories().length === 0 ? (
                  <div 
                    className="text-center py-8"
                    style={{
                      color: 'white',
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                      fontSize: '18px'
                    }}
                  >
                    Inga stories matchade din sökning
                  </div>
                ) : (
                  filteredStories().map(story => {
                    let touchStartY = null;
                    let touchMoved = false;
                    return (
                      <div
                        key={story.id || story.title || story.name}
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          marginTop: '10px',
                          marginBottom: '10px',
                          borderRadius: '12px',
                          padding: '4px',
                          backgroundColor: 'rgba(255, 140, 0, 0.9)',
                          overflow: 'visible',
                          width: '80%',
                          alignSelf: 'center',
                          margin: '10px auto',
                          boxShadow: '0 6px 7px rgba(0, 0, 0, 0.5)',
                          maxWidth: '320px',
                          cursor: 'pointer',
                          userSelect: 'none',
                          touchAction: 'manipulation',
                        }}
                        onClick={e => {
                          if (!touchMoved) handleChooseStory(story);
                        }}
                        onTouchStart={e => {
                          touchMoved = false;
                          if (e.touches && e.touches.length === 1) {
                            touchStartY = e.touches[0].clientY;
                          }
                        }}
                        onTouchMove={e => {
                          if (e.touches && e.touches.length === 1 && touchStartY !== null) {
                            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
                            if (deltaY > 10) touchMoved = true;
                          }
                        }}
                        onTouchEnd={e => {
                          if (!touchMoved) handleChooseStory(story);
                          touchStartY = null;
                          touchMoved = false;
                        }}
                      >
                        {/* Gradient inuti */}
                        <div style={{
                          background: 'linear-gradient(180deg, rgba(178, 34, 34, 0.9) 0%, rgba(255, 140, 0, 0.9) 100%)',
                          padding: '8px',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          {/* Titel Banner */}
                          <div style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            padding: '8px',
                            borderRadius: '15px',
                            marginBottom: '8px'
                          }}>
                            <span style={{
                              fontSize: '20px',
                              color: 'white',
                              fontFamily: 'KidZone',
                              textAlign: 'center',
                              display: 'block',
                              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                            }}>
                              {personalize((story.name || story.title || 'Namnlös saga').replace(/_/g, ' '))}
                            </span>
                          </div>

                          {/* Image Frame */}
                          <div style={{
                            width: '100%',
                            aspectRatio: '1/1',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderColor: 'rgba(64, 64, 64, 0.8)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            marginBottom: '8px'
                          }}>
                            {story.thumbnail_url && (
                              <img
                                src={story.thumbnail_url}
                                alt={story.title || story.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            )}
                          </div>

                          {/* Text Box */}
                          <div style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            padding: '8px',
                            borderRadius: '5px',
                            marginBottom: '8px',
                            minHeight: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span style={{
                              fontSize: '16px',
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontFamily: 'KidZone',
                              textAlign: 'center',
                              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                              lineHeight: '22px'
                            }}>
                              {personalize(story.description || 'När man är så liten att man knappt syns.')}
                            </span>
                          </div>

                          {/* Status Bar */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            padding: '6px',
                            borderRadius: '5px'
                          }}>
                            {/* Favorite Button */}
                            <button
                              onClick={e => { e.stopPropagation(); console.log('Markerat som favorit:', story.title || story.name); }}
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '5px',
                                justifyContent: 'center',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px 8px'
                              }}
                            >
                              <span style={{ fontSize: '16px', color: 'white' }}>☆</span>
                              <span style={{ fontFamily: 'KidZone', fontSize: '14px', color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                                Markera som favorit
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
            )}
            
            {/* Scrollbar styling */}
            <style>
              {`
                div[style*="overflowY: auto"]::-webkit-scrollbar {
                  width: 12px;
                }
                div[style*="overflowY: auto"]::-webkit-scrollbar-track {
                  background: rgba(139, 69, 19, 0.2);
                  border-radius: 10px;
                }
                div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
                  background: linear-gradient(180deg, #d2691e, #8b4513);
                  border-radius: 10px;
                  border: 2px solid rgba(139, 69, 19, 0.3);
                  background-clip: padding-box;
                }
                div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(180deg, #ff8c00, #a0522d);
                }
              `}
            </style>
          </div>
        </div>
      )}
    </div>
  );
} 