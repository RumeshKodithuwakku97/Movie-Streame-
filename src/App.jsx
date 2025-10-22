import { useState, useEffect } from 'react';
import { useMovies } from './hooks/useMovies';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieGrid from './components/MovieGrid';
import Footer from './components/Footer';
import VideoBackground from './components/VideoBackground';
import AdminPanel from './components/AdminPanel';

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
      setShowAdmin(true);
    }
  }, []);

  const handleAdminLogin = (password) => {
    if (password === ADMIN_CONFIG.PASSWORD) {
      setIsAdminAuthenticated(true);
      setShowAdmin(true);
      localStorage.setItem(ADMIN_CONFIG.SESSION_KEY, 'true');
    } else {
      alert('Invalid password!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdmin(false);
    localStorage.removeItem(ADMIN_CONFIG.SESSION_KEY);
  };

  const handleShowAdmin = () => {
    setShowAdmin(true);
  };

  const handleShowPublic = () => {
    setShowAdmin(false);
  };

  // 🔐 ADMIN MODE - Show only admin panel
  if (showAdmin && isAdminAuthenticated) {
    return (
      <div className="App">
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <header style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h1 style={{ color: '#e50914', margin: 0 }}>
                🎬 MovieStream Admin Panel
              </h1>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleShowPublic}
                  style={{
                    background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  👁️ View Public Site
                </button>
                <button 
                  onClick={handleAdminLogout}
                  style={{
                    background: 'linear-gradient(135deg, #666, #555)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </header>

            {loading && (
              <div style={{
                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                color: 'white',
                padding: '1rem',
                textAlign: 'center',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                📡 {movies.length > 0 ? 'Saving to Google Sheets...' : 'Loading movies from Google Sheets...'}
              </div>
            )}

            {error && (
              <div style={{
                background: 'linear-gradient(135deg, #ff4444, #cc0000)',
                color: 'white',
                padding: '1rem',
                textAlign: 'center',
                borderRadius: '8px',
                marginBottom: '2rem'
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

            <AdminPanel
              isAuthenticated={true}
              onLogout={handleAdminLogout}
              movies={movies}
              onAddMovie={addMovie}
              onUpdateMovie={updateMovie}
              onDeleteMovie={deleteMovie}
              onRefresh={refreshMovies}
            />
          </div>
        </div>
      </div>
    );
  }

  // 🔐 ADMIN LOGIN MODE
  if (showAdmin && !isAdminAuthenticated) {
    return (
      <div className="App">
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div className="admin-login">
            <h2 style={{ color: '#e50914', marginBottom: '2rem', textAlign: 'center' }}>
              🎬 MovieStream Admin Login
            </h2>
            <input
              type="password"
              id="adminPassword"
              placeholder="Enter Admin Password"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin(e.target.value)}
            />
            <button onClick={() => {
              const password = document.getElementById('adminPassword').value;
              handleAdminLogin(password);
            }}>
              Login to Admin Panel
            </button>
            <button 
              onClick={handleShowPublic}
              style={{
                background: 'linear-gradient(135deg, #666, #555)',
                marginTop: '1rem'
              }}
            >
              ← Back to Public Site
            </button>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#999' }}>
              Default password: admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🌐 PUBLIC MODE - Show main website
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

      <Footer />
    </div>
  );
}

export default App;