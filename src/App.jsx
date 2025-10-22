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
    loading,
    error,
    addMovie,
    updateMovie,
    deleteMovie,
    filterMovies,
    searchMovies,
    refreshMovies
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
      
      {/* Loading and Error States */}
      {loading && (
        <div style={{
          background: 'linear-gradient(135deg, #2196F3, #1976D2)',
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
          marginTop: '100px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backdropFilter: 'blur(10px)'
        }}>
          🎬 Loading movies from Google Sheets...
        </div>
      )}

      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #ff4444, #cc0000)',
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
          marginTop: '100px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backdropFilter: 'blur(10px)'
        }}>
          ⚠️ {error} 
          <button 
            onClick={refreshMovies} 
            style={{
              marginLeft: '1rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Retry
          </button>
        </div>
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          color: '#00ff00',
          padding: '0.5rem',
          fontSize: '0.7rem',
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          zIndex: 1000,
          borderRadius: '4px',
          backdropFilter: 'blur(10px)',
          border: '1px solid #00ff00'
        }}>
          <div>📊 Movies: {movies.length}</div>
          <div>🔍 Filter: {currentFilter}</div>
          <button 
            onClick={refreshMovies}
            style={{
              background: '#00ff00',
              color: 'black',
              border: 'none',
              padding: '0.2rem 0.5rem',
              borderRadius: '2px',
              fontSize: '0.6rem',
              cursor: 'pointer',
              marginTop: '0.2rem'
            }}
          >
            Refresh Data
          </button>
        </div>
      )}
      
      <Hero />
      
      <MovieGrid
        movies={filteredMovies}
        title="Featured Movies"
        showFilters={true}
        currentFilter={currentFilter}
        onFilterChange={filterMovies}
      />
      
      <MovieGrid
        movies={movies.filter(movie => movie.downloadLink && movie.downloadLink !== '#')}
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
        onRefresh={refreshMovies}
      />

      <Footer />
    </div>
  );
}

export default App;