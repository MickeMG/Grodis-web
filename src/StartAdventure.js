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
  const navigate = useNavigate();
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(-1);
  const dropdownRef = useRef(null);

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

  const handleNameChange = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleGenderChange = (index, value) => {
    const newGenders = [...genders];
    newGenders[index] = value;
    setGenders(newGenders);
  };

  const handleAdd = () => {
    if (names.length < 2) {
      setNames([...names, '']);
      setGenders([...genders, 'kvinna']);
    }
  };

  const handleRemove = (index) => {
    setNames(names.filter((_, i) => i !== index));
    setGenders(genders.filter((_, i) => i !== index));
  };

  const handleChooseStory = (story) => {
    setSelectedStory(story);
    setShowModal(false);
    setTimeout(() => {
      navigate(`/read/${story.id}`, { state: { names, genders } });
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
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-gradient-to-r from-yellow-700/70 via-yellow-600/70 to-yellow-700/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-center items-start">
          <div className="flex-1 flex justify-between items-start">
            <div className="flex-1" />
            <div className="flex flex-col md:flex-row items-center gap-0">
              <img 
                src="/images/logo.png" 
                alt="Grodis logo" 
                className="h-16 md:h-24 w-auto"
              />
              <p className="text-2xl md:text-4xl text-white/90 tracking-wide drop-shadow-lg mt-2 md:mt-4 font-kidzone md:-ml-4 text-center md:text-left">
                Grodis - Interaktiva sagor i en magisk värld!
              </p>
            </div>
            <div className="flex-1" />
          </div>
        </div>
      </nav>
      {/* Dialogruta */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-40">
        {/* Rubrik */}
        <div className="rounded-2xl px-8 py-8 mb-6 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 border-2 border-white/80 shadow-xl" style={{maxWidth: 420, width: '100%'}}>
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-xl text-center" style={{textShadow: '0 2px 8px #0008', fontFamily: 'Kidzone'}}>Vilka ska vara med i storyn?</h1>
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
                  fontSize: '2rem',
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
                    fontSize: '1.1rem',
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
                          fontSize: '1.1rem',
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
        <button
          onClick={handleAdd}
          disabled={names.length >= 2}
          className={`bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-bold py-2 px-6 rounded-xl shadow-md border-2 border-white/70 mb-6 transition-all duration-200 ${names.length >= 2 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          style={{
            fontFamily: 'Kidzone',
            textShadow: '0 2px 8px #0008',
            fontWeight: 700
          }}
        >
          Lägg till
        </button>
        {/* Välj Story-knapp */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-8 rounded-2xl text-3xl font-bold text-white bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 border-2 border-white/80 shadow-xl mt-2 hover:scale-105 transition-all duration-200"
          style={{
            fontFamily: 'Kidzone',
            textShadow: '0 2px 8px #0008',
            fontWeight: 700,
            maxWidth: 420,
            width: '100%'
          }}
        >
          {selectedStory ? (selectedStory.title || selectedStory.name || '').replace(/_/g, ' ') : 'Välj Story här'}
        </button>
      </div>
      {/* Modal för att välja story */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200 rounded-2xl p-6 md:p-10 shadow-2xl max-w-4xl w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-red-500 text-2xl font-bold"
              title="Stäng"
            >
              ×
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-6 text-center">Välj en story</h2>
            {loading && <div className="text-center text-orange-700 font-bold py-8">Laddar stories...</div>}
            {error && <div className="text-center text-red-600 font-bold py-8">{error}</div>}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[70vh] overflow-y-auto">
                {stories.map(story => (
                  <button
                    key={story.id || story.title || story.name}
                    onClick={() => handleChooseStory(story)}
                    className={`flex flex-col items-start bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-2xl p-0 border-2 shadow-lg transition-all duration-200 overflow-hidden h-[320px] ${selectedStory && (selectedStory.id === story.id) ? 'border-green-400 scale-105' : 'border-white/70 hover:scale-105'}`}
                  >
                    {story.thumbnail_url && (
                      <img
                        src={story.thumbnail_url}
                        alt={story.title || story.name}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4 flex flex-col flex-1 w-full justify-between">
                      <span className="text-xl font-bold text-white drop-shadow mb-2" style={{textShadow: '0 1px 4px #0008'}}>
                        {(story.title || story.name || '').replace(/_/g, ' ')}
                      </span>
                      <span className="text-base text-white/90 mb-2" style={{textShadow: '0 1px 4px #0008'}}>
                        {story.description}
                      </span>
                      {selectedStory && selectedStory.id === story.id && (
                        <span className="mt-2 text-green-200 font-bold">Vald</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 