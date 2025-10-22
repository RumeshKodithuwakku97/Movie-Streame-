import { useState, useEffect } from 'react';

const SHEET_ID = '1zVKnh41lTYYJ-YxdKwXKTvshFPGtL2jwKs-a0dE64RY';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

// ⚠️ REPLACE THIS WITH YOUR ACTUAL FORM URL
const GOOGLE_FORM_URL = 'https://docs.google.com/spreadsheets/d/1BWwTNPbJ8OcomT1y9ta6yKEfy9dlGNKi-oowGfZ_I0Y/edit?usp=sharing';

const FORM_IDS = {
  title: 'entry.515977332',      // Movie Title
  year: 'entry.1646391408',       // Release Year  
  rating: 'entry.622371989',     // Rating
  genre: 'entry.920520856',      // Genre
  description: 'entry.1351959690', // Description
  poster: 'entry.1182892160',     // Poster URL
  streamLink: 'entry.1913927324', // Stream Link
  downloadLink: 'entry.789465922' // Download Link
};
export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMoviesFromSheets = async () => {
    setLoading(true);
    try {
      const response = await fetch(SHEET_URL);
      const text = await response.text();
      
      if (!text.includes('Google Docs')) {
        const json = JSON.parse(text.substring(47).slice(0, -2));
        
        if (json.table?.rows && json.table.rows.length > 1) {
          const moviesData = json.table.rows.slice(1).map((row, index) => {
            const cells = row.c || [];
            return {
              id: index + 1,
              title: cells[0]?.v || '',
              year: cells[1]?.v || '',
              rating: cells[2]?.v || '',
              genre: cells[3]?.v || '',
              description: cells[4]?.v || '',
              poster: cells[5]?.v || '',
              streamLink: cells[6]?.v || '#',
              downloadLink: cells[7]?.v || '#'
            };
          }).filter(movie => movie.title.trim() !== '');
          
          setMovies(moviesData);
          console.log(`✅ Loaded ${moviesData.length} movies`);
        }
      }
    } catch (error) {
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const addMovie = async (movie) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append(FORM_IDS.title, movie.title);
      formData.append(FORM_IDS.year, movie.year);
      formData.append(FORM_IDS.rating, movie.rating);
      formData.append(FORM_IDS.genre, movie.genre);
      formData.append(FORM_IDS.description, movie.description);
      formData.append(FORM_IDS.poster, movie.poster);
      formData.append(FORM_IDS.streamLink, movie.streamLink);
      formData.append(FORM_IDS.downloadLink, movie.downloadLink);
      
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      
      setTimeout(() => loadMoviesFromSheets(), 3000);
      return { success: true, message: '✅ Movie added to Google Sheets!' };
      
    } catch (error) {
      return { success: false, message: '❌ Failed to submit' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMoviesFromSheets(); }, []);

  return {
    movies,
    filteredMovies: movies,
    loading,
    error,
    addMovie,
    refreshMovies: loadMoviesFromSheets
  };
};