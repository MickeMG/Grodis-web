import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getApiUrl } from './config';

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
        const sRes = await fetch(`${getApiUrl()}/getStory/${id}`);
        if (!sRes.ok) throw new Error('Kunde inte hämta story');
        const sData = await sRes.json();
        setStory(sData);
        const cRes = await fetch(`${getApiUrl()}/getChapters/${id}`);
        if (!cRes.ok) throw new Error('Kunde inte hämta kapitel');
        const cData = await cRes.json();
        setChapters(cData);
        setError(null);
      } catch (err) {
        console.error('API-fel:', err);
        setError('Kunde inte hämta berättelsen. Kontrollera din internetanslutning.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Scrolla upp när kapitel ändras
  useEffect(() => {
    if (!loading && chapters.length > 0) {
      // Försök flera sätt att scrolla upp
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        // Fallback för äldre webbläsare
        window.scrollTo(0, 0);
      }
      
      // Alternativ metod för att scrolla upp
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    }
  }, [current, loading, chapters.length]);

    // Bildhanteringsfunktion - använder Firebase Storage URLs som StorySelector
  const getStoryImageUrl = (story) => {
    console.log('getStoryImageUrl anropad med story:', story);
    
    if (!story) {
      console.log('Ingen story, använder placeholder');
      return '/placeholder-image.svg';
    }

    // Om ingen thumbnail_url finns, försök hitta bild baserat på titel
    if (!story.thumbnail_url) {
      const storyTitle = story.title || '';
      if (storyTitle) {
        // Försök olika varianter av filnamnet
        const possibleNames = [
          storyTitle.replace(/\s+/g, '_') + '.png',
          storyTitle.replace(/\s+/g, '_').replace(/[åäö]/g, (match) => {
            const replacements = { 'å': 'a', 'ä': 'a', 'ö': 'o' };
            return replacements[match] || match;
          }) + '.png',
          storyTitle.replace(/[åäö]/g, (match) => {
            const replacements = { 'å': 'a', 'ä': 'a', 'ö': 'o' };
            return replacements[match] || match;
          }).replace(/\s+/g, '_') + '.png'
        ];
        
        console.log('Ingen thumbnail_url, försöker fallback med titel:', storyTitle);
        console.log('Möjliga filnamn:', possibleNames);
        
        // Returnera första möjliga filnamnet (vi kan inte testa om filen finns i frontend)
        return `/images/stories/${possibleNames[0]}`;
      }
      console.log('Ingen thumbnail_url eller titel, använder placeholder');
      return '/placeholder-image.svg';
    }

    console.log('Story thumbnail_url:', story.thumbnail_url);
    
    // Använd thumbnail_url direkt som StorySelector gör
    // Detta inkluderar Firebase Storage URLs
    if (story.thumbnail_url) {
      console.log('Använder thumbnail_url direkt:', story.thumbnail_url);
      return story.thumbnail_url;
    }
    
    // Fallback till placeholder
    console.log('Ingen thumbnail_url, använder placeholder');
    return '/placeholder-image.svg';
  };

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
            {current === 0 && (
              <div style={{
                background: '#a13a1b',
                color: '#fff',
                borderRadius: '1rem',
                padding: '0.75rem 2rem',
                fontSize: '2.2rem',
                fontWeight: 700,
                marginBottom: '1rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px #0004',
                fontFamily: 'Kidzone',
                border: '2.5px solid #bbb',
              }}>
                {personalize(story.title)}
              </div>
            )}
            
            {/* Story-bild eller apple-touch-icon */}
            {current === 0 ? (
              // Kapitel 1 - visa story-bild med vit ram
              <div style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '1rem',
                overflow: 'hidden',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                border: '3px solid #fff',
                boxShadow: '0 4px 12px #0004',
                position: 'relative',
              }}>
                {/* Debug-knapp (endast i utvecklingsläge) */}
                {process.env.NODE_ENV === 'development' && (
                  <button 
                    onClick={() => {
                      console.log('Story debug:', story);
                      console.log('Story title:', story.title);
                      console.log('Story thumbnail_url:', story.thumbnail_url);
                      console.log('Generated image URL:', getStoryImageUrl(story));
                      console.log('Current chapter:', current + 1);
                    }} 
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      zIndex: 10,
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    title="Visa debug-info i konsol"
                  >
                    🐞
                  </button>
                )}
                                  <img 
                    src={getStoryImageUrl(story)}
                    alt={story.title || 'Sagobild'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  onLoad={() => {
                    console.log('Story-bild laddades framgångsrikt:', getStoryImageUrl(story));
                  }}
                  onError={(e) => {
                    console.error('Fel vid laddning av bild:', getStoryImageUrl(story));
                    const target = e.target;
                    target.onerror = null;
                    target.src = '/placeholder-image.svg';
                  }}
                />
              </div>
            ) : (
              // Kapitel 2-5 - visa groda direkt på orange bakgrund
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                position: 'relative',
              }}>
                {/* Debug-knapp (endast i utvecklingsläge) */}
                {process.env.NODE_ENV === 'development' && (
                  <button 
                    onClick={() => {
                      console.log('Story debug:', story);
                      console.log('Story title:', story.title);
                      console.log('Current chapter:', current + 1);
                    }} 
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      zIndex: 10,
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    title="Visa debug-info i konsol"
                  >
                    🐞
                  </button>
                )}
                <img 
                  src="/trans.png"
                  alt="Grodis ikon"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onLoad={() => {
                    console.log('Trans-bild laddades framgångsrikt');
                  }}
                  onError={(e) => {
                    console.error('Fel vid laddning av bild:', '/trans.png');
                    const target = e.target;
                    target.onerror = null;
                    target.src = '/placeholder-image.svg';
                  }}
                />
              </div>
            )}
            
            <div style={{
              color: '#ffd43b',
              fontWeight: 700,
              fontSize: '1.5rem',
              marginBottom: '1.2rem',
              textAlign: 'center',
              fontFamily: 'Kidzone',
              letterSpacing: '0.02em',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
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
                  onClick={() => {
                    setCurrent(c => Math.max(0, c - 1));
                    // Scrolla upp till början av sidan
                    setTimeout(() => {
                      try {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } catch (e) {
                        window.scrollTo(0, 0);
                      }
                      document.documentElement.scrollTop = 0;
                      document.body.scrollTop = 0;
                    }, 50);
                  }}
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
                  onClick={() => {
                    setCurrent(c => Math.min(chapters.length - 1, c + 1));
                    // Scrolla upp till början av sidan
                    setTimeout(() => {
                      try {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } catch (e) {
                        window.scrollTo(0, 0);
                      }
                      document.documentElement.scrollTop = 0;
                      document.body.scrollTop = 0;
                    }, 50);
                  }}
                >
                  Nästa kapitel
                </button>
              )}
              {/* Avsluta Story-knapp endast på sista kapitlet */}
              {current === chapters.length - 1 && (
                <button
                  className="font-bold"
                  style={{
                    background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)',
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
                  onClick={() => navigate(-1)}
                >
                  Avsluta Story
                </button>
              )}
            </div>
            
            {/* Tillbaka-knapp längst ner */}
            <div style={{ zIndex: 20, position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
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
      </div>
    </div>
  );
} 