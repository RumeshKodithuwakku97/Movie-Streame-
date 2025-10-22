import { useState, useEffect } from 'react';

// Sample initial movie data
const initialMovies = [
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

  useEffect(() => {
    // Load movies from localStorage or use initial data
    const savedMovies = localStorage.getItem('moviestream-movies');
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
    } else {
      setMovies(initialMovies);
    }
  }, []);

  useEffect(() => {
    // Save movies to localStorage whenever they change
    localStorage.setItem('moviestream-movies', JSON.stringify(movies));
    
    // Filter movies based on current filter and search term
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

  return {
    movies,
    filteredMovies,
    currentFilter,
    searchTerm,
    addMovie,
    updateMovie,
    deleteMovie,
    filterMovies,
    searchMovies
  };
};