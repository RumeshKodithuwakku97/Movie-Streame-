import { useState, useEffect } from 'react';

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
  },
  {
    id: 3,
    title: "Pulp Fiction",
    year: "1994",
    rating: "8.9/10",
    genre: "Crime, Drama",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzJjNDymmYzgyZjkXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    streamLink: "#",
    downloadLink: "#"
  }
];

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load movies - using fallback data for now
  const loadMovies = async () => {
    setLoading(true);
    try {
      // Try to load from localStorage first
      const savedMovies = localStorage.getItem('moviestream-movies');
      if (savedMovies) {
        setMovies(JSON.parse(savedMovies));
      } else {
        // Use fallback data
        setMovies(fallbackMovies);
        localStorage.setItem('moviestream-movies', JSON.stringify(fallbackMovies));
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies(fallbackMovies);
    } finally {
      setLoading(false);
    }
  };

  // Add movie (local storage only for now)
  const addMovie = async (movie) => {
    const newMovie = {
      ...movie,
      id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1
    };
    
    const updatedMovies = [newMovie, ...movies];
    setMovies(updatedMovies);
    localStorage.setItem('moviestream-movies', JSON.stringify(updatedMovies));
    
    return { success: true, message: 'Movie added successfully!' };
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
    loadMovies();
  };

  useEffect(() => {
    loadMovies();
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