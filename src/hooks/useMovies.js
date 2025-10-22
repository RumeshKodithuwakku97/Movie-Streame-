import { useState, useEffect } from 'react';

// ⚠️ REPLACE WITH YOUR GOOGLE APPS SCRIPT URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load movies from Google Sheets via Apps Script
  const loadMoviesFromSheets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getMovies`);
      const data = await response.json();
      
      if (data.movies) {
        setMovies(data.movies);
        console.log(`✅ Loaded ${data.movies.length} movies from Google Sheets`);
      } else {
        throw new Error('No movies data received');
      }
    } catch (error) {
      console.error('❌ Error loading from Google Sheets:', error);
      setError('Failed to load movies from Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  // Add movie to Google Sheets
  const addMovieToSheets = async (movie) => {
    try {
      const formData = new URLSearchParams();
      formData.append('action', 'addMovie');
      formData.append('title', movie.title);
      formData.append('year', movie.year);
      formData.append('rating', movie.rating);
      formData.append('genre', movie.genre);
      formData.append('description', movie.description);
      formData.append('poster', movie.poster);
      formData.append('streamLink', movie.streamLink);
      formData.append('downloadLink', movie.downloadLink);

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('❌ Error adding movie to Google Sheets:', error);
      return false;
    }
  };

  // Enhanced addMovie function
  const addMovie = async (movie) => {
    setLoading(true);
    try {
      const success = await addMovieToSheets(movie);
      
      if (success) {
        // Reload movies from sheets to get the latest data
        await loadMoviesFromSheets();
        return { success: true, message: 'Movie added successfully to Google Sheets!' };
      } else {
        throw new Error('Failed to save to Google Sheets');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      return { success: false, message: 'Failed to add movie to Google Sheets' };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced updateMovie function
  const updateMovie = async (id, updatedMovie) => {
    // Implementation for update
    // You can extend the Apps Script to handle updates
    return { success: false, message: 'Update not implemented yet' };
  };

  // Enhanced deleteMovie function
  const deleteMovie = async (id) => {
    // Implementation for delete
    // You can extend the Apps Script to handle deletes
    return { success: false, message: 'Delete not implemented yet' };
  };

  useEffect(() => {
    loadMoviesFromSheets();
  }, []);

  const refreshMovies = () => {
    loadMoviesFromSheets();
  };

  return {
    movies,
    loading,
    error,
    addMovie,
    updateMovie,
    deleteMovie,
    refreshMovies
  };
};