import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const pronounMap = {
  man: 'han',
  kvinna: 'hon',
  hen: 'hen',
};

export default function ReadStory() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Förväntar sig: { names: ["Kim"], genders: ["kvinna"] }
  const state = location.state || {};
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const sRes = await fetch(`/api/stories2/${id}`);
        if (!sRes.ok) throw new Error('Kunde inte hämta story');
        const sData = await sRes.json();
        setStory(sData);
        const cRes = await fetch(`/api/stories2/${id}/chapters`);
        if (!cRes.ok) throw new Error('Kunde inte hämta kapitel');
        const cData = await cRes.json();
        setChapters(cData);
        setError(null);
      } catch (err) {
        setError('Kunde inte hämta berättelsen.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-12">Laddar berättelse...</div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-2 relative">
      <div className="fixed inset-0 z-0">
        <img 
          src="/grodisbackground.png" 
          alt="Bakgrund" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Något gick fel</h2>
        <p className="text-lg text-gray-700 mb-6">{error}</p>
        <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl" onClick={() => navigate(-1)}>
          &larr; Tillbaka
        </button>
      </div>
    </div>
  );
  if (!story) return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-2 relative">
      <div className="fixed inset-0 z-0">
        <img 
          src="/grodisbackground.png" 
          alt="Bakgrund" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Berättelsen hittades inte</h2>
        <p className="text-lg text-gray-700 mb-6">Det gick inte att ladda berättelsen. Prova att gå tillbaka och välj en annan story.</p>
        <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl" onClick={() => navigate(-1)}>
          &larr; Tillbaka
        </button>
      </div>
    </div>
  );

  // Hantera namn och kön
  const names = state.names || ["Kim"];
  const genders = state.genders || ["kvinna"];
  console.log('MOTTAR:', genders);
  const mainName = names[0] || "Kim";
  const mainPronoun = pronounMap[genders[0]] || "hen";

  // Ersätt platshållare för namn och pronomen för flera personer
  function personalize(text) {
    let result = text;
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
    
    // Textformateringen är redan gjord när kapitlen skapades, så vi behöver inte göra det igen
    // result = improveTextFormatting(result);
    
    return result;
  }
  
  // Funktion för att förbättra textformateringen (används inte längre)
  function improveTextFormatting(text) {
    if (!text) return text;
    
    let formattedText = text;
    
    // Lägg till radbrytningar efter meningar som slutar med punkt, utropstecken eller frågetecken
    formattedText = formattedText.replace(/([.!?])\s+/g, '$1\n\n');
    
    // Lägg till radbrytningar efter dialoger (citat)
    formattedText = formattedText.replace(/([""])\s+/g, '$1\n\n');
    
    // Lägg till radbrytningar efter viktiga övergångar
    const transitionWords = [
      'Plötsligt', 'Sedan', 'Då', 'Men', 'Och', 'Så', 'När', 'Medan', 'Efter', 'Före',
      'Suddenly', 'Then', 'But', 'And', 'So', 'When', 'While', 'After', 'Before'
    ];
    
    transitionWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      formattedText = formattedText.replace(regex, `\n\n${word}`);
    });
    
    // Lägg till radbrytningar efter beskrivningar av handlingar
    const actionPatterns = [
      /([.!?])\s+([A-ZÅÄÖ][a-zåäö]+ börjar)/g,
      /([.!?])\s+([A-ZÅÄÖ][a-zåäö]+ känner)/g,
      /([.!?])\s+([A-ZÅÄÖ][a-zåäö]+ ser)/g,
      /([.!?])\s+([A-ZÅÄÖ][a-zåäö]+ hör)/g,
      /([.!?])\s+([A-ZÅÄÖ][a-zåäö]+ tänker)/g
    ];
    
    actionPatterns.forEach(pattern => {
      formattedText = formattedText.replace(pattern, '$1\n\n$2');
    });
    
    // Lägg till radbrytningar efter specifika ord som ofta markerar nya händelser
    const eventWords = [
      'När', 'Efter', 'Före', 'Medan', 'Sedan', 'Då', 'Men', 'Och', 'Så',
      'Plötsligt', 'Oväntat', 'Chockerande', 'Otroligt', 'Amazing', 'Incredible'
    ];
    
    eventWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      formattedText = formattedText.replace(regex, `\n\n${word}`);
    });
    
    // Lägg till radbrytningar efter dialoger som slutar med utropstecken eller frågetecken
    formattedText = formattedText.replace(/([""][^"]*[!?])\s+/g, '$1\n\n');
    
    // Rensa upp extra radbrytningar (max 2 i rad)
    formattedText = formattedText.replace(/\n{3,}/g, '\n\n');
    
    // Rensa upp mellanrum i början och slutet av rader
    formattedText = formattedText.replace(/^\s+|\s+$/gm, '');
    
    // Ta bort tomma rader i början och slutet
    formattedText = formattedText.trim();
    
    return formattedText;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-2 relative" style={{
      background: 'linear-gradient(180deg, #b63a1b 0%, #f7a13d 100%)',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{ zIndex: 20, position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <button className="font-bold" onClick={() => navigate(-1)} style={{
          background: 'linear-gradient(90deg, #ffb300 0%, #ff9800 100%)',
          color: '#fff',
          borderRadius: '1rem',
          border: '2px solid #fff8',
          boxShadow: '0 2px 8px #0008',
          padding: '0.5rem 1.5rem',
          fontFamily: 'Kidzone',
          textShadow: '0 2px 8px #0008',
          fontSize: '1.1rem',
          minWidth: '240px',
        }}>
          &larr; Tillbaka till alla äventyr
        </button>
      </div>
      {/* Bakgrundsbild */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/grodisbackground.png" 
          alt="Bakgrund" 
          className="w-full h-full object-cover" 
          style={{ zIndex: 0, position: 'absolute' }}
        />
      </div>
      <div className="w-full max-w-xl mx-auto" style={{
        background: 'linear-gradient(180deg, #b63a1b 0%, #f7a13d 100%)',
        border: '5px solid #fff',
        borderRadius: '2rem',
        boxShadow: '0 8px 32px #0004',
        padding: '2.5rem 1.5rem',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Kapitelvy direkt */}
            <div style={{
              background: '#a13a1b',
              color: '#fff',
              borderRadius: '1rem',
              padding: '0.75rem 2rem',
              fontSize: '2.2rem',
              fontWeight: 700,
              marginBottom: '2rem',
              textAlign: 'center',
              boxShadow: '0 2px 8px #0004',
              fontFamily: 'Kidzone',
              border: '2.5px solid #bbb',
            }}>
              {personalize(story.title)}
            </div>
            <div style={{
              color: '#ffd43b',
              fontWeight: 700,
              fontSize: '1.5rem',
              marginBottom: '1.2rem',
              textAlign: 'center',
              fontFamily: 'Kidzone',
              letterSpacing: '0.02em',
            }}>
              Kapitel {current + 1}/{chapters.length}
            </div>
            <div className="mb-8 text-white" style={{
              fontSize: '1.25rem',
              textAlign: 'left',
              fontFamily: 'inherit',
              lineHeight: 1.8,
              marginBottom: '2rem',
              whiteSpace: 'pre-line',
              wordWrap: 'break-word',
            }}>
              {chapters[current] ? personalize(chapters[current].content) : 'Ingen text.'}
            </div>
            <div className="flex gap-4 justify-center">
              {current > 0 && (
                <button
                  className="font-bold"
                  style={{
                    background: 'linear-gradient(90deg, #ffb300 0%, #ff9800 100%)',
                    color: '#fff',
                    borderRadius: '1rem',
                    border: '2px solid #fff8',
                    boxShadow: '0 2px 8px #0008',
                    fontFamily: 'Kidzone',
                    textShadow: '0 2px 8px #0008',
                    padding: '0.75rem 1.75rem',
                    fontSize: '1.15rem',
                    minWidth: '180px',
                    margin: '0 0.25rem',
                    cursor: 'pointer',
                    opacity: 1,
                    transition: 'opacity 0.2s',
                  }}
                  onClick={() => setCurrent(c => Math.max(0, c - 1))}
                >
                  Föregående kapitel
                </button>
              )}
              {current < chapters.length - 1 && (
                <button
                  className="font-bold"
                  style={{
                    background: 'linear-gradient(90deg, #ffb300 0%, #ff9800 100%)',
                    color: '#fff',
                    borderRadius: '1rem',
                    border: '2px solid #fff8',
                    boxShadow: '0 2px 8px #0008',
                    fontFamily: 'Kidzone',
                    textShadow: '0 2px 8px #0008',
                    padding: '0.75rem 1.75rem',
                    fontSize: '1.15rem',
                    minWidth: '180px',
                    margin: '0 0.25rem',
                    cursor: 'pointer',
                    opacity: 1,
                    transition: 'opacity 0.2s',
                  }}
                  onClick={() => setCurrent(c => Math.min(chapters.length - 1, c + 1))}
                >
                  Nästa kapitel
                </button>
              )}
            </div>
      </div>
    </div>
  );
} 