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
              <h1 style={{ color: '#e50914', margin: 0, fontSize: '2.5rem' }}>
                🎬 MovieStream Admin Panel
              </h1>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleShowPublic}
                  style={{
                    background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
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
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </header>

            {loading && (
              <div style={{
                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                color: 'white',
                padding: '1.5rem',
                textAlign: 'center',
                borderRadius: '12px',
                marginBottom: '2rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                📡 {movies.length > 0 ? 'Saving to Google Sheets...' : 'Loading movies from database...'}
              </div>
            )}

            {error && (
              <div style={{
                background: 'linear-gradient(135deg, #ff4444, #cc0000)',
                color: 'white',
                padding: '1.5rem',
                textAlign: 'center',
                borderRadius: '12px',
                marginBottom: '2rem',
                fontSize: '1.1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem'
              }}>
                ⚠️ {error}
                <button 
                  onClick={refreshMovies}
                  style={{
                    background: 'rgba(255,255,255,0.3)',
                    border: 'none',
                    color: 'white',
                    padding: '0.7rem 1.2rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
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
        <VideoBackground />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="admin-login" style={{
            background: 'rgba(20, 20, 30, 0.95)',
            padding: '3rem',
            borderRadius: '20px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            maxWidth: '450px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              color: '#e50914', 
              marginBottom: '2rem', 
              fontSize: '2.2rem',
              fontFamily: "'Playfair Display', serif"
            }}>
              🎬 MovieStream Admin
            </h2>
            <input
              type="password"
              id="adminPassword"
              placeholder="Enter Admin Password"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                margin: '1rem 0',
                border: 'none',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            <button onClick={() => {
              const password = document.getElementById('adminPassword').value;
              handleAdminLogin(password);
            }} style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #e50914, #b8070f)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginTop: '1rem',
              boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)'
            }}>
              🔐 Login to Admin Panel
            </button>
            <button 
              onClick={handleShowPublic}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #666, #555)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                marginTop: '1rem'
              }}
            >
              ← Back to Public Site
            </button>
            <p style={{ 
              marginTop: '2rem', 
              fontSize: '0.9rem', 
              color: '#999',
              fontStyle: 'italic'
            }}>
              Default password: <strong>admin123</strong>
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
          padding: '1.2rem',
          textAlign: 'center',
          marginTop: '80px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backdropFilter: 'blur(15px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          🎬 Loading movies from database...
        </div>
      )}

      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #ff4444, #cc0000)',
          color: 'white',
          padding: '1.2rem',
          textAlign: 'center',
          marginTop: '80px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backdropFilter: 'blur(15px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          fontSize: '1.1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem'
        }}>
          ⚠️ {error} 
          <button 
            onClick={refreshMovies} 
            style={{
              background: 'rgba(255,255,255,0.3)',
              border: 'none',
              color: 'white',
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            🔄 Retry
          </button>
        </div>
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          background: 'rgba(0,0,0,0.85)',
          color: '#00ff00',
          padding: '0.8rem',
          textAlign: 'center',
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          zIndex: 998,
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          borderBottom: '1px solid #00ff00'
        }}>
          🐛 DEBUG: Movies: {movies.length} | Filter: {currentFilter} | Search: "{searchTerm}"
          <button 
            onClick={refreshMovies}
            style={{
              marginLeft: '1rem',
              background: '#00ff00',
              color: 'black',
              border: 'none',
              padding: '0.3rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}
          >
            REFRESH
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