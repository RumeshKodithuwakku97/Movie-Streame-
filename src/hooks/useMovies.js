import { useState, useEffect } from 'react';

// Your exact URLs
const SHEET_ID = '1zVKnh41lTYYJ-YxdKwXKTvshFPGtL2jwKs-a0dE64RY';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzo6GqrXuoO9V346bQYLY2FpXPFcr7ulRpE5J_wkRlwRalZS0FJOP-cyjw34EgFREOO/exec';

// Fallback sample data
const fallbackMovies = [
  {
    id: 1,
    title: "Inception",
    year: "2010",
    rating: "8.8/10",
    genre: "Sci-Fi, Action",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    streamLink: "#",
    downloadLink: "#"
  }
];

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load movies from Google Sheets
  const loadMoviesFromSheets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Loading from:', SHEET_URL);
      
      const response = await fetch(SHEET_URL);
      const text = await response.text();
      
      if (text.includes('Google Docs')) {
        throw new Error('Sheet is not publicly accessible');
      }
      
      // Parse the Google Sheets JSONP response
      const json = JSON.parse(text.substring(47).slice(0, -2));
      
      if (json.table && json.table.rows) {
        const moviesData = json.table.rows.slice(1).map((row, index) => {
          const cells = row.c || [];
          return {
            id: index + 1,
            title: cells[0]?.v || '',
            year: cells[1]?.v || '',
            rating: cells[2]?.v || 'N/A',
            genre: cells[3]?.v || '',
            description: cells[4]?.v || '',
            poster: cells[5]?.v || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            streamLink: cells[6]?.v || '#',
            downloadLink: cells[7]?.v || '#'
          };
        }).filter(movie => movie.title && movie.title.trim() !== '');
        
        if (moviesData.length > 0) {
          setMovies(moviesData);
          localStorage.setItem('moviestream-movies', JSON.stringify(moviesData));
          console.log(`✅ Loaded ${moviesData.length} movies from Google Sheets`);
        } else {
          throw new Error('Sheet is empty or has no movie data');
        }
      } else {
        throw new Error('Invalid sheet format');
      }
      
    } catch (error) {
      console.error('❌ Google Sheets error:', error);
      
      // Fallback to localStorage or sample data
      const savedMovies = localStorage.getItem('moviestream-movies');
      if (savedMovies && JSON.parse(savedMovies).length > 0) {
        setMovies(JSON.parse(savedMovies));
        setError('Using local data (Google Sheets: ' + error.message + ')');
      } else {
        setMovies(fallbackMovies);
        localStorage.setItem('moviestream-movies', JSON.stringify(fallbackMovies));
        setError('Using sample data (Google Sheets: ' + error.message + ')');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add movie to Google Sheets
  const addMovieToSheets = async (movie) => {
    try {
      console.log('📤 Sending to Apps Script:', APPS_SCRIPT_URL);
      
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie)
      });
      
      const result = await response.json();
      console.log('📥 Apps Script response:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Apps Script error:', error);
      return { success: false, error: 'Failed to connect to Google Apps Script' };
    }
  };

  // Enhanced addMovie function
  const addMovie = async (movie) => {
    setLoading(true);
    
    try {
      // First try to save to Google Sheets
      const sheetResult = await addMovieToSheets(movie);
      
      if (sheetResult.success) {
        // Success! Reload from sheets to get updated data
        await loadMoviesFromSheets();
        return { 
          success: true, 
          message: '✅ Movie added to Google Sheets!' 
        };
      } else {
        // Fallback to local storage
        const newMovie = {
          ...movie,
          id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1
        };
        
        const updatedMovies = [newMovie, ...movies];
        setMovies(updatedMovies);
        localStorage.setItem('moviestream-movies', JSON.stringify(updatedMovies));
        
        return { 
          success: true, 
          message: '⚠️ Movie saved locally (Google Sheets: ' + (sheetResult.error || 'Unavailable') + ')' 
        };
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      return { 
        success: false, 
        message: '❌ Failed to add movie: ' + error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateMovie = async (id, updatedMovie) => {
    const updatedMovies = movies.map(movie => 
      movie.id === id ? { ...updatedMovie, id } : movie
    );
    setMovies(updatedMovies);
    localStorage.setItem('moviestream-movies', JSON.stringify(updatedMovies));
    
    return { success: true, message: 'Movie updated successfully!' };
  };

  const deleteMovie = async (id) => {
    const updatedMovies = movies.filter(movie => movie.id !== id);
    setMovies(updatedMovies);
    localStorage.setItem('moviestream-movies', JSON.stringify(updatedMovies));
    
    return { success: true, message: 'Movie deleted successfully!' };
  };

  const filterMovies = (genre) => {
    setCurrentFilter(genre);
  };

  const searchMovies = (term) => {
    setSearchTerm(term);
  };

  const refreshMovies = () => {
    loadMoviesFromSheets();
  };

  useEffect(() => {
    loadMoviesFromSheets();
  }, []);

  useEffect(() => {
    let filtered = movies;
    
    if (currentFilter !== 'all') {
      filtered = filtered.filter(movie => 
        movie.genre.toLowerCase().includes(currentFilter.toLowerCase())
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMovies(filtered);
  }, [movies, currentFilter, searchTerm]);

  return {
    movies,
    filteredMovies,
    currentFilter,
    searchTerm,
    loading,
    error,
    addMovie,
    updateMovie,
    deleteMovie,
    filterMovies,
    searchMovies,
    refreshMovies
  };
};