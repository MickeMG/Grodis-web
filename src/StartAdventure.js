import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import userDataManager, { 
  updateNamesAndGenders
} from './utils/cookieManager';

export default function StartAdventure() {
  const [names, setNames] = useState(userDataManager.userData.names.length > 0 && userDataManager.userData.names[0] ? userDataManager.userData.names : ['']);
  const [genders, setGenders] = useState(userDataManager.userData.genders.length > 0 ? userDataManager.userData.genders : ['kvinna']);
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
    // Normalisera ALLTID genders-arrayen till 'man' eller 'kvinna' vid mount
    setGenders(genders => genders.map(g => g === 'pojke' ? 'man' : g === 'flicka' ? 'kvinna' : g));
  }, []);

  const handleNameChange = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
    // Spara till cookies
    updateNamesAndGenders(newNames, genders);
  };

  const handleGenderChange = (index, value) => {
    const newGenders = [...genders];
    newGenders[index] = value === 'pojke' ? 'man' : value === 'flicka' ? 'kvinna' : value;
    setGenders(newGenders);
    // Spara till cookies
    updateNamesAndGenders(names, newGenders);
  };

  const handleAdd = () => {
    if (names.length < 3) {
      const newNames = [...names, ''];
      const newGenders = [...genders, 'kvinna'];
      setNames(newNames);
      setGenders(newGenders);
      // Spara till cookies
      updateNamesAndGenders(newNames, newGenders);
    }
  };

  const handleRemove = (index) => {
    const newNames = names.filter((_, i) => i !== index);
    const newGenders = genders.filter((_, i) => i !== index);
    setNames(newNames);
    setGenders(newGenders);
    // Spara till cookies
    updateNamesAndGenders(newNames, newGenders);
  };

  const handleOpenStorySelector = () => {
    // Navigera till story-väljaren
    navigate('/story-selector', { state: { names, genders } });
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
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-xl text-center" style={{textShadow: '0 2px 8px #0008', fontFamily: 'Kidzone'}}>Vem ska vara med i berättelsen?</h1>
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
              {/* Papperskorg-ikon före namnfältet */}
              {names.length > 1 && (
                <button
                  onClick={() => handleRemove(idx)}
                  className="mr-2 text-white hover:text-red-200 p-1"
                  title="Ta bort namn"
                  style={{
                    background: 'rgba(220, 53, 69, 0.9)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    border: '2px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(220, 53, 69, 1)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(220, 53, 69, 0.9)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <input
                type="text"
                value={name}
                maxLength={20}
                onChange={e => handleNameChange(idx, e.target.value)}
                placeholder="Namn"
                className="flex-1 text-lg font-semibold outline-none placeholder-white rounded-xl border-none focus:ring-2 focus:ring-yellow-300"
                style={{
                  color: '#fff',
                  fontFamily: 'Kidzone',
                  textShadow: '0 2px 12px #000a, 0 1px 0 #ffb300',
                  letterSpacing: '0.5px',
                  fontWeight: 700,
                  fontSize: '2.5rem',
                  minWidth: names.length > 1 ? 100 : 120,
                  maxWidth: names.length > 1 ? 180 : 220,
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
              <div ref={dropdownRef} style={{ position: 'relative', minWidth: names.length > 1 ? 80 : 90 }}>
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
                    fontSize: names.length > 1 ? '1.1rem' : '1.3rem',
                    minWidth: names.length > 1 ? 70 : 80,
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
                    minWidth: names.length > 1 ? 80 : 100,
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
                          fontSize: names.length > 1 ? '1.1rem' : '1.3rem',
                          padding: names.length > 1 ? '0.4rem 1.2rem' : '0.5rem 1.5rem',
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
        

        
        {/* Välj Story-knapp */}
        <button
          onClick={handleOpenStorySelector}
          className="w-full py-8 rounded-2xl text-5xl font-bold text-white bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 border-2 border-white/80 shadow-xl mt-2 hover:scale-105 transition-all duration-200"
          style={{
            fontFamily: 'Kidzone',
            textShadow: '0 2px 8px #0008',
            fontWeight: 700,
            maxWidth: 420,
            width: '100%'
          }}
        >
          Välj Story här
        </button>
      </div>
    </div>
  );
} 