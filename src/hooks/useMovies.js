import { useState, useEffect } from 'react';

// Your Google Sheets configuration
const SHEET_ID = '1zVKnh41lTYYJ-YxdKwXKTvshFPGtL2jwKs-a0dE64RY';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/1zVKnh41lTYYJ-YxdKwXKTvshFPGtL2jwKs-a0dE64RY/edit?gid=1433568947#gid=1433568947`;

// ⚠️ REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzo6GqrXuoO9V346bQYLY2FpXPFcr7ulRpE5J_wkRlwRalZS0FJOP-cyjw34EgFREOO/exec'
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
      console.log('📡 Loading movies from Google Sheets...');
      
      const response = await fetch(SHEET_URL);
      const text = await response.text();
      
      // Parse the Google Sheets JSONP response
      const json = JSON.parse(text.substring(47).slice(0, -2));
      
      if (json.table && json.table.rows && json.table.rows.length > 0) {
        const moviesData = json.table.rows.map((row, index) => {
          const cells = row.c || [];
          return {
            id: index + 1,
            title: cells[0]?.v || 'Unknown Title',
            year: cells[1]?.v || 'Unknown Year',
            rating: cells[2]?.v || 'N/A',
            genre: cells[3]?.v || 'Unknown Genre',
            description: cells[4]?.v || 'No description available.',
            poster: cells[5]?.v || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            streamLink: cells[6]?.v || '#',
            downloadLink: cells[7]?.v || '#'
          };
        }).filter(movie => movie.title !== 'Unknown Title'); // Filter out empty rows
        
        setMovies(moviesData);
        localStorage.setItem('moviestream-movies', JSON.stringify(moviesData));
        console.log(`✅ Loaded ${moviesData.length} movies from Google Sheets`);
        
        if (moviesData.length === 0) {
          setError('Google Sheet is empty. Using sample data.');
          setMovies(fallbackMovies);
        }
      } else {
        throw new Error('No data found in Google Sheet');
      }
    } catch (error) {
      console.error('❌ Error loading from Google Sheets:', error);
      setError('Failed to load from Google Sheets. Using local data.');
      
      // Fallback to localStorage or sample data
      const savedMovies = localStorage.getItem('moviestream-movies');
      if (savedMovies) {
        setMovies(JSON.parse(savedMovies));
      } else {
        setMovies(fallbackMovies);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add movie to Google Sheets via Apps Script
  const addMovieToSheets = async (movie) => {
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie)
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error adding movie to Google Sheets:', error);
      return { success: false, error: 'Failed to connect to Google Sheets' };
    }
  };

  // Enhanced addMovie function
  const addMovie = async (movie) => {
    setLoading(true);
    try {
      // First try to save to Google Sheets
      const sheetResult = await addMovieToSheets(movie);
      
      if (sheetResult.success) {
        // Successfully saved to Google Sheets - reload data
        await loadMoviesFromSheets();
        return { 
          success: true, 
          message: '✅ Movie added successfully to Google Sheets!' 
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
          message: '⚠️ Movie saved locally (Google Sheets not available)' 
        };
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      return { 
        success: false, 
        message: '❌ Failed to add movie' 
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