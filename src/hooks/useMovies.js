import { useState, useEffect } from 'react';

// Your Google Sheets configuration
const SHEET_ID = '1zVKnh41lTYYJ-YxdKwXKTvshFPGtL2jwKs-a0dE64RY';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

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
      const response = await fetch(SHEET_URL);
      const text = await response.text();
      
      // Parse the Google Sheets JSONP response
      const json = JSON.parse(text.substring(47).slice(0, -2));
      
      if (json.table && json.table.rows) {
        const moviesData = json.table.rows.map((row, index) => {
          const cells = row.c || [];
          return {
            id: index + 1,
            title: cells[0]?.v || 'Unknown Title',
            year: cells[1]?.v || 'Unknown Year',
            rating: cells[2]?.v || 'N/A',
            genre: cells[3]?.v || 'Unknown Genre',
            description: cells[4]?.v || 'No description available.',
            poster: cells[5]?.v || 'https://via.placeholder.com/300x450/333/fff?text=No+Poster',
            streamLink: cells[6]?.v || '#',
            downloadLink: cells[7]?.v || '#'
          };
        });
        
        setMovies(moviesData);
        console.log(`✅ Loaded ${moviesData.length} movies from Google Sheets`);
      } else {
        throw new Error('No data found in sheet');
      }
    } catch (error) {
      console.error('❌ Error loading from Google Sheets:', error);
      setError('Failed to load movies. Using sample data instead.');
      // Fallback to sample data
      setMovies(getSampleMovies());
    } finally {
      setLoading(false);
    }
  };

  // Fallback sample data
  const getSampleMovies = () => [
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
    },
    {
      id: 2,
      title: "The Dark Knight",
      year: "2008",
      rating: "9.0/10",
      genre: "Action, Crime, Drama",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
      poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      streamLink: "#",
      downloadLink: "#"
    }
  ];

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

  const addMovie = (movie) => {
    const newMovie = {
      ...movie,
      id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1
    };
    setMovies(prev => [newMovie, ...prev]);
  };

  const updateMovie = (id, updatedMovie) => {
    setMovies(prev => prev.map(movie => 
      movie.id === id ? { ...updatedMovie, id } : movie
    ));
  };

  const deleteMovie = (id) => {
    setMovies(prev => prev.filter(movie => movie.id !== id));
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