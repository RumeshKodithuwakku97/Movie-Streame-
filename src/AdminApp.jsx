import { useState, useEffect } from 'react';
import { useMovies } from './hooks/useMovies';
import './App.css';

const ADMIN_CONFIG = {
  PASSWORD: 'admin123',
  SESSION_KEY: 'moviestream_admin'
};

function AdminApp() {
  const [isAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [movieForm, setMovieForm] = useState({
    title: '',
    year: '',
    rating: '',
    genre: '',
    description: '',
    poster: '',
    streamLink: '',
    downloadLink: ''
  });
  const [message, setMessage] = useState('');

  const {
    movies,
    loading,
    error,
    addMovie,
    updateMovie,
    deleteMovie,
    refreshMovies
  } = useMovies();

  useEffect(() => {
    const adminSession = localStorage.getItem(ADMIN_CONFIG.SESSION_KEY);
    if (adminSession === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleLogin = (inputPassword) => {
    if (inputPassword === ADMIN_CONFIG.PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(ADMIN_CONFIG.SESSION_KEY, 'true');
      setMessage('✅ Admin login successful!');
    } else {
      setMessage('❌ Invalid admin password!');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(ADMIN_CONFIG.SESSION_KEY);
    setMessage('✅ Logged out successfully!');
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    
    if (!movieForm.title || !movieForm.year || !movieForm.genre) {
      setMessage('❌ Please fill in required fields (Title, Year, Genre)');
      return;
    }

    const result = await addMovie(movieForm);
    setMessage(result.message);
    
    if (result.success) {
      // Clear form
      setMovieForm({
        title: '',
        year: '',
        rating: '',
        genre: '',
        description: '',
        poster: '',
        streamLink: '',
        downloadLink: ''
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login">
          <h2>🎬 MovieStream Admin</h2>
          {message && <div className="message">{message}</div>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Admin Password"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin(password)}
          />
          <button onClick={() => handleLogin(password)}>
            Login to Admin Panel
          </button>
          <p>Default password: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-app">
      <div className="admin-container">
        <header className="admin-header">
          <h1>🎬 MovieStream Admin Panel</h1>
          <div className="admin-actions">
            <button onClick={refreshMovies} className="refresh-btn">
              🔄 Refresh Data
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        {/* Status Messages */}
        {message && (
          <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            📡 {movies.length > 0 ? 'Saving to Google Sheets...' : 'Loading movies from Google Sheets...'}
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={refreshMovies} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        )}

        {/* Add Movie Form */}
        <section className="admin-section">
          <h2>➕ Add New Movie to Google Sheets</h2>
          <form onSubmit={handleAddMovie} className="admin-form">
            <input
              type="text"
              value={movieForm.title}
              onChange={(e) => setMovieForm(prev => ({...prev, title: e.target.value}))}
              placeholder="Movie Title *"
              required
            />
            <input
              type="number"
              value={movieForm.year}
              onChange={(e) => setMovieForm(prev => ({...prev, year: e.target.value}))}
              placeholder="Release Year *"
              required
            />
            <input
              type="text"
              value={movieForm.rating}
              onChange={(e) => setMovieForm(prev => ({...prev, rating: e.target.value}))}
              placeholder="Rating (e.g., 8.5/10)"
            />
            <select
              value={movieForm.genre}
              onChange={(e) => setMovieForm(prev => ({...prev, genre: e.target.value}))}
              required
            >
              <option value="">Select Genre *</option>
              <option value="Action">Action</option>
              <option value="Drama">Drama</option>
              <option value="Comedy">Comedy</option>
              <option value="Horror">Horror</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Romance">Romance</option>
            </select>
            <textarea
              value={movieForm.description}
              onChange={(e) => setMovieForm(prev => ({...prev, description: e.target.value}))}
              placeholder="Movie Description"
              rows="3"
              className="full-width"
            />
            <input
              type="url"
              value={movieForm.poster}
              onChange={(e) => setMovieForm(prev => ({...prev, poster: e.target.value}))}
              placeholder="Poster Image URL *"
              required
              className="full-width"
            />
            <input
              type="url"
              value={movieForm.streamLink}
              onChange={(e) => setMovieForm(prev => ({...prev, streamLink: e.target.value}))}
              placeholder="Streaming Link"
              className="full-width"
            />
            <input
              type="url"
              value={movieForm.downloadLink}
              onChange={(e) => setMovieForm(prev => ({...prev, downloadLink: e.target.value}))}
              placeholder="Download Link"
              className="full-width"
            />
            
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '🔄 Adding...' : '➕ Add Movie to Google Sheets'}
            </button>
          </form>
        </section>

        {/* Current Movies from Google Sheets */}
        <section className="admin-section">
          <h2>📊 Current Movies in Google Sheets ({movies.length})</h2>
          <div className="movies-list">
            {movies.length === 0 ? (
              <div className="no-movies">No movies in Google Sheets yet.</div>
            ) : (
              movies.map(movie => (
                <div key={movie.id} className="movie-item">
                  <div className="movie-info">
                    <h3>{movie.title} ({movie.year})</h3>
                    <div className="movie-meta">
                      <span>⭐ {movie.rating}</span>
                      <span>🎭 {movie.genre}</span>
                    </div>
                    <p>{movie.description}</p>
                  </div>
                  <div className="movie-actions">
                    <button className="edit-btn">✏️ Edit</button>
                    <button className="delete-btn">🗑️ Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminApp;