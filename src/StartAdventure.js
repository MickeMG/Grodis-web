import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StartAdventure() {
  const [names, setNames] = useState(['']);
  const [genders, setGenders] = useState(['kvinna']);
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen relative">
      {/* Bakgrundsbild med overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/images/background.webp" 
          alt="Magical forest background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />
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
        <div className="rounded-2xl px-8 py-4 mb-6 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 border-2 border-white/80 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-xl text-center" style={{textShadow: '0 2px 8px #0008'}}>Vilka ska vara med i storyn?</h1>
        </div>
        {/* Namnfält */}
        <div className="flex flex-col gap-4 w-full max-w-xs mb-4">
          {names.map((name, idx) => (
            <div key={idx} className="flex items-center bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-2xl px-4 py-3 shadow-lg border-2 border-white/70 gap-2">
              <input
                type="text"
                value={name}
                maxLength={20}
                onChange={e => handleNameChange(idx, e.target.value)}
                placeholder={idx === 0 ? 'Namn' : 'Namn'}
                className="flex-1 bg-transparent text-white text-lg font-semibold outline-none placeholder-white/70"
                style={{textShadow: '0 1px 4px #0008'}}
              />
              <select
                value={genders[idx]}
                onChange={e => handleGenderChange(idx, e.target.value)}
                className="ml-2 rounded-lg px-2 py-1 bg-white text-orange-700 font-bold border-2 border-orange-300 focus:outline-none"
              >
                <option value="kvinna">Hon</option>
                <option value="man">Han</option>
                <option value="hen">Hen</option>
              </select>
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
        >
          Lägg till
        </button>
        {/* Välj Story-knapp */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full max-w-xs py-4 rounded-2xl text-2xl font-bold text-white bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 border-2 border-white/80 shadow-xl mt-2 hover:scale-105 transition-all duration-200"
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