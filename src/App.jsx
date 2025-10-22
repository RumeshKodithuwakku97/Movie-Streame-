import { useState, useEffect } from 'react';
import { useMovies } from './hooks/useMovies';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieGrid from './components/MovieGrid';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import VideoBackground from './components/VideoBackground';

const ADMIN_CONFIG = {
  PASSWORD: 'admin123',
  SESSION_KEY: 'moviestream_admin'
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const {
    movies,
    filteredMovies,
    currentFilter,
    searchTerm,
    addMovie,
    updateMovie,
    deleteMovie,
    filterMovies,
    searchMovies
  } = useMovies();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if admin is already logged in
    const adminSession = localStorage.getItem(ADMIN_CONFIG.SESSION_KEY);
    if (adminSession === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (password) => {
    if (password === ADMIN_CONFIG.PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(ADMIN_CONFIG.SESSION_KEY, 'true');
    } else {
      alert('Invalid password!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(ADMIN_CONFIG.SESSION_KEY);
    setShowAdmin(false);
  };

  const handleShowAdmin = () => {
    setShowAdmin(true);
    setTimeout(() => {
      const adminSection = document.getElementById('admin');
      if (adminSection) {
        adminSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="App">
      <VideoBackground />
      <Navbar 
        onSearch={searchMovies}
        onAdminClick={handleShowAdmin}
        scrolled={scrolled}
      />
      
      <Hero />
      
      <MovieGrid
        movies={filteredMovies}
        title="Featured Movies"
        showFilters={true}
        currentFilter={currentFilter}
        onFilterChange={filterMovies}
      />
      
      <MovieGrid
        movies={movies}
        title="Available for Download"
      />

      <AdminPanel
        isAuthenticated={isAdminAuthenticated}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        movies={movies}
        onAddMovie={addMovie}
        onUpdateMovie={updateMovie}
        onDeleteMovie={deleteMovie}
      />

      <Footer />
    </div>
  );
}

export default App;