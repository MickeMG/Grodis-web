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
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;
  if (!story) return null;

  // Hantera namn och kön
  const names = state.names || ["Kim"];
  const genders = state.genders || ["kvinna"];
  const mainName = names[0] || "Kim";
  const mainPronoun = pronounMap[genders[0]] || "hen";

  // Ersätt {namn} och {pronomen} i texten
  function personalize(text) {
    return text
      .replace(/\{namn\}/gi, mainName)
      .replace(/\{pronomen\}/gi, mainPronoun);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-12 px-2">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <button className="text-green-700 font-bold mb-4" onClick={() => navigate(-1)}>
          &larr; Tillbaka till alla berättelser
        </button>
        <h1 className="text-3xl font-bold text-green-700 mb-2">{story.title}</h1>
        <p className="italic text-gray-600 mb-6">{story.description}</p>
        <hr className="mb-6" />
        <h2 className="text-2xl font-bold mb-4">Kapitel {current + 1}</h2>
        <div className="flex gap-2 mb-6">
          {chapters.map((_, idx) => (
            <button
              key={idx}
              className={`rounded-full w-10 h-10 flex items-center justify-center font-bold border-2 ${idx === current ? 'bg-green-500 text-white border-green-700' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
              onClick={() => setCurrent(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="mb-8 text-lg text-gray-800 min-h-[120px]">
          {chapters[current] ? personalize(chapters[current].content) : 'Ingen text.'}
        </div>
        <div className="flex gap-4">
          <button
            className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-xl"
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            Föregående kapitel
          </button>
          <button
            className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl"
            onClick={() => setCurrent(c => Math.min(chapters.length - 1, c + 1))}
            disabled={current === chapters.length - 1}
          >
            Nästa kapitel
          </button>
        </div>
      </div>
    </div>
  );
} 