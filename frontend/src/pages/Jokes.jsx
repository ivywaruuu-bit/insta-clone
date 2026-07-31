import React, { useEffect, useState } from 'react';

// Jokes page: fetches random jokes from an external joke API and displays them.
// Uses the Official Joke API by default but falls back to JokeAPI if needed.

export default function Jokes() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchJoke() {
    setLoading(true);
    setError(null);
    setJoke(null);
    try {
      // Try Official Joke API first
      const res = await fetch('https://official-joke-api.appspot.com/random_joke');
      if (!res.ok) throw new Error('Official Joke API failed');
      const data = await res.json();
      // Official Joke API returns {setup, punchline}
      setJoke({ type: 'two-part', setup: data.setup, punchline: data.punchline });
    } catch (e) {
      // Fallback to JokeAPI (single or twopart)
      try {
        const res2 = await fetch('https://v2.jokeapi.dev/joke/Any');
        if (!res2.ok) throw new Error('JokeAPI failed');
        const d2 = await res2.json();
        if (d2.type === 'single') {
          setJoke({ type: 'single', joke: d2.joke });
        } else {
          setJoke({ type: 'two-part', setup: d2.setup, punchline: d2.delivery });
        }
      } catch (e2) {
        setError('Could not fetch a joke. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Random Joke Generator</h2>
      <div className="bg-white p-4 rounded shadow min-h-[120px] flex items-center justify-center">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {joke && joke.type === 'single' && (
          <div className="text-center text-lg">{joke.joke}</div>
        )}
        {joke && joke.type === 'two-part' && (
          <div className="text-center">
            <div className="font-semibold mb-2">{joke.setup}</div>
            <div className="text-gray-700">{joke.punchline}</div>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <button onClick={fetchJoke} className="btn">Get another joke</button>
        <a href="https://official-joke-api.appspot.com/" target="_blank" rel="noreferrer" className="underline text-sm">Official Joke API</a>
      </div>
      <p className="text-xs text-gray-500">Jokes are fetched from public external joke APIs. Network errors or rate limits may prevent fetching.</p>
    </div>
  );
}
