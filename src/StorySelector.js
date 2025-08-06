import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getApiUrl } from './config';
import userDataManager, { 
  toggleFavorite, 
  isFavorite, 
  markAsRead, 
  isRead,
  setLastReadStory,
  getLastReadStory
} from './utils/cookieManager';

export default function StorySelector() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [randomSeed, setRandomSeed] = useState(0);
  const [favoritesUpdate, setFavoritesUpdate] = useState(0); // State för att tvinga omrendering
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hämta namn och kön från location state
  const { names = [''], genders = ['kvinna'] } = location.state || {};

  useEffect(() => {
    setLoading(true);
    fetch(`${getApiUrl()}/getStories`)
      .then(res => {
        if (!res.ok) throw new Error('Kunde inte hämta stories');
        return res.json();
      })
      .then(data => {
        setStories(data);
        setError(null);
      })
      .catch(err => {
        console.error('API-fel:', err);
        setError('Kunde inte hämta stories. Kontrollera din internetanslutning.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredStories = useMemo(() => {
    // Inkludera favoritesUpdate i dependencies för att uppdatera när favoriter ändras
    const _ = favoritesUpdate; // Använd variabeln för att tvinga omrendering
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
        return filtered.filter(story => isFavorite(story.id));
      case 'read':
        return filtered.filter(story => isRead(story.id));
      case 'unread':
        return filtered.filter(story => !isRead(story.id));
      case 'lastRead':
        const lastReadId = getLastReadStory();
        if (lastReadId) {
          const lastReadStory = filtered.find(story => story.id === lastReadId);
          if (lastReadStory) {
            return [lastReadStory, ...filtered.filter(story => story.id !== lastReadId)];
          }
        }
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
        // Visa bara EN slumpmässig story (använd randomSeed för att tvinga ny slumpmässig story)
        if (filtered.length > 0) {
          const seededRandom = (randomSeed + filtered.length) % filtered.length;
          const randomIndex = Math.floor((Math.random() + seededRandom) * filtered.length) % filtered.length;
          return [filtered[randomIndex]];
        }
        return filtered;
      default:
        // "Alla" - visa senaste stories först (högst ID först)
        return [...filtered].sort((a, b) => {
          const idA = typeof a.id === 'string' ? parseInt(a.id, 10) || 0 : a.id;
          const idB = typeof b.id === 'string' ? parseInt(b.id, 10) || 0 : b.id;
          return idB - idA;
        });
    }
  }, [stories, names.length, searchTerm, filter, randomSeed, favoritesUpdate]);

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
    const mainName = (names[0] && names[0].trim()) || "Kim";
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
      const name = (names[i] && names[i].trim()) || `Person ${i + 1}`;
      const gender = genders[i] || 'kvinna';
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
    // Markera som läst och sätt som senast läst
    markAsRead(story.id);
    setLastReadStory(story.id);
    
    // Navigera till story-läsaren
    navigate(`/read/${story.id}`, { state: { names, genders } });
  };

  const handleBack = () => {
    navigate('/start', { state: { names, genders } });
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

      {/* Header */}
      <div className="relative z-10 pt-8 pb-6">
        <div className="container mx-auto px-4">
          {/* Tillbaka-knapp */}
          <button
            onClick={handleBack}
            className="mb-4 text-white hover:text-yellow-200 transition-colors"
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}
          >
            ← Tillbaka
          </button>

          {/* Titel */}
          <h1 
            className="text-4xl md:text-5xl font-bold text-white text-center mb-8"
            style={{
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
              fontFamily: 'Kidzone'
            }}
          >
            Välj en story
          </h1>

          {/* Sökfält */}
          <div 
            className="relative mb-6 max-w-md mx-auto"
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
          <div className="flex justify-center gap-3 mb-6 flex-wrap" style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '1.5rem',
            padding: '1rem 1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {[
              { key: 'all', label: 'Alla' },
              { key: 'favorites', label: 'Favoriter' },
              { key: 'read', label: 'Lästa' },
              { key: 'unread', label: 'Olästa' },
              { key: 'lastRead', label: 'Senast läst' },
              { key: 'random', label: 'Slumpa' }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => {
                  if (filterOption.key === 'random' && filter === 'random') {
                    setRandomSeed(prev => prev + 1);
                  } else {
                    setFilter(filterOption.key);
                    if (filterOption.key === 'random') {
                      setRandomSeed(prev => prev + 1);
                    }
                  }
                }}
                style={{
                  padding: '10px 18px',
                  borderRadius: '20px',
                  border: filter === filterOption.key ? 
                    '2px solid rgba(255, 255, 255, 0.8)' : 
                    '1px solid rgba(255, 255, 255, 0.4)',
                  backgroundColor: filter === filterOption.key ? 
                    '#d2691e' : 
                    'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textShadow: filter === filterOption.key ? 
                    '1px 1px 3px rgba(0, 0, 0, 0.8)' : 
                    '1px 1px 2px rgba(0, 0, 0, 0.6)',
                  fontSize: '14px',
                  transform: filter === filterOption.key ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: filter === filterOption.key ? 
                    '0 4px 12px rgba(210, 105, 30, 0.4)' : 
                    '0 2px 6px rgba(0, 0, 0, 0.2)',
                  minWidth: '70px'
                }}
                onMouseEnter={(e) => {
                  if (filter !== filterOption.key) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== filterOption.key) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
                  }
                }}
              >
                {filterOption.label}
              </button>
            ))}
          </div>

          {/* Statistik för användaren */}
          <div 
            className="text-center mb-6"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '6px 10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: '300px',
              margin: '0 auto'
            }}
          >
            📚 Lästa: {userDataManager.getStats().totalRead} | ⭐ Favoriter: {userDataManager.getStats().totalFavorites}
          </div>
        </div>
      </div>

      {/* Story-kort */}
      <div className="relative z-10 pb-8">
        <div className="container mx-auto px-4">
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
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}
            >
              {filteredStories.length === 0 ? (
                <div 
                  className="text-center py-8 col-span-full"
                  style={{
                    color: 'white',
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                    fontSize: '18px'
                  }}
                >
                  Inga stories matchade din sökning
                </div>
              ) : (
                filteredStories.map(story => (
                  <div
                    key={story.id || story.title || story.name}
                    onClick={() => handleChooseStory(story)}
                    style={{
                      width: '100%',
                      maxWidth: '480px',
                      backgroundColor: '#d2691e',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      margin: '0 auto 15px auto',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                      border: '3px solid rgba(255, 255, 255, 0.8)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-5px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                    }}
                  >
                    {/* Titel container */}
                    <div style={{
                      backgroundColor: '#8B4513',
                      padding: '15px 10px',
                      textAlign: 'center'
                    }}>
                      <h3 
                        style={{
                          color: 'white',
                          fontSize: '26px',
                          fontWeight: 'bold',
                          margin: 0,
                          textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)',
                          fontFamily: 'Kidzone'
                        }}
                      >
                        {personalize((story.name || story.title || 'Namnlös saga').replace(/_/g, ' '))}
                      </h3>
                    </div>

                    {/* Bild container */}
                    {story.thumbnail_url && (
                      <div style={{
                        width: '100%',
                        height: '220px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        position: 'relative'
                      }}>
                        <img
                          src={story.thumbnail_url}
                          alt={story.title || story.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                        {/* Läst-indikator */}
                        {isRead(story.id) && (
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#4CAF50',
                            color: 'white',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    )}

                    {/* Beskrivning och favorit-knapp container */}
                    <div style={{
                      padding: '15px',
                      textAlign: 'center',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <p 
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '0 0 15px 0',
                          lineHeight: '1.4',
                          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        {personalize(story.description || 'En spännande saga väntar på dig!')}
                      </p>

                      {/* Favorit-knapp */}
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          toggleFavorite(story.id);
                          setFavoritesUpdate(prev => prev + 1); // Tvinga omrendering
                        }}
                        style={{
                          backgroundColor: '#8B4513',
                          color: 'white',
                          border: 'none',
                          borderRadius: '25px',
                          padding: '12px 20px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          margin: '0 auto',
                          minWidth: '200px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                          transition: 'all 0.3s ease',
                          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#A0522D';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#8B4513';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>
                          {isFavorite(story.id) ? '★' : '⭐'}
                        </span>
                        {isFavorite(story.id) ? 'Favorit' : 'Markera som favorit'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 