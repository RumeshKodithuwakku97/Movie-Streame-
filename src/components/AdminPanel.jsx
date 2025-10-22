import { useState } from 'react';

const AdminPanel = ({ 
  isAuthenticated, 
  onLogin, 
  onLogout, 
  movies, 
  onAddMovie, 
  onUpdateMovie, 
  onDeleteMovie,
  onRefresh
}) => {
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (!movieForm.title || !movieForm.year || !movieForm.genre || 
        !movieForm.poster) {
      setMessage('❌ Please fill in all required fields (Title, Year, Genre, Poster)');
      setLoading(false);
      return;
    }

    try {
      const result = await onAddMovie(movieForm);
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
    } catch (error) {
      setMessage('❌ Error adding movie: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="section" id="admin">
        <h2 className="section-title">Admin Login</h2>
        <div className="admin-login">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Admin Password"
            onKeyPress={(e) => e.key === 'Enter' && onLogin(password)}
          />
          <button onClick={() => onLogin(password)}>Login</button>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#999' }}>
            Default password: admin123
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="admin">
      <h2 className="section-title">Admin Panel - Google Sheets Manager</h2>
      
      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <div className="admin-panel">
        <h3 style={{ marginBottom: '1.5rem', color: '#e50914', textAlign: 'center' }}>
          ➕ Add New Movie to Google Sheets
        </h3>
        
        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={movieForm.title}
            onChange={(e) => setMovieForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Movie Title *"
            required
          />
          <input
            type="number"
            value={movieForm.year}
            onChange={(e) => setMovieForm(prev => ({ ...prev, year: e.target.value }))}
            placeholder="Release Year *"
            required
          />
          <input
            type="text"
            value={movieForm.rating}
            onChange={(e) => setMovieForm(prev => ({ ...prev, rating: e.target.value }))}
            placeholder="Rating (e.g., 8.5/10)"
          />
          <select
            value={movieForm.genre}
            onChange={(e) => setMovieForm(prev => ({ ...prev, genre: e.target.value }))}
            required
          >
            <option value="">Select Genre *</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Romance">Romance</option>
            <option value="Thriller">Thriller</option>
          </select>
          <textarea
            value={movieForm.description}
            onChange={(e) => setMovieForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Movie Description"
            rows="3"
            className="full-width"
          />
          <input
            type="url"
            value={movieForm.poster}
            onChange={(e) => setMovieForm(prev => ({ ...prev, poster: e.target.value }))}
            placeholder="Poster Image URL *"
            required
            className="full-width"
          />
          <input
            type="url"
            value={movieForm.streamLink}
            onChange={(e) => setMovieForm(prev => ({ ...prev, streamLink: e.target.value }))}
            placeholder="Streaming Link"
            className="full-width"
          />
          <input
            type="url"
            value={movieForm.downloadLink}
            onChange={(e) => setMovieForm(prev => ({ ...prev, downloadLink: e.target.value }))}
            placeholder="Download Link"
            className="full-width"
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="full-width"
          >
            {loading ? '🔄 Adding to Google Sheets...' : '➕ Add Movie to Google Sheets'}
          </button>
        </form>
        
        <h3 style={{ margin: '3rem 0 1.5rem', color: '#e50914', textAlign: 'center' }}>
          📊 Current Movies in Google Sheets ({movies.length})
        </h3>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '2rem' }}>
          {movies.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
              No movies in Google Sheets yet. Add your first movie above!
            </p>
          ) : (
            movies.map(movie => (
              <div key={movie.id} className="movie-card" style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title} ({movie.year})</h3>
                  <div className="movie-meta">
                    <span>⭐ {movie.rating}</span>
                    <span>🎭 {movie.genre}</span>
                  </div>
                  <p className="movie-description">{movie.description}</p>
                  <div className="admin-actions">
                    <button className="edit-btn">✏️ Edit</button>
                    <button className="delete-btn">🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="admin-actions">
          <button onClick={onRefresh} style={{ background: 'linear-gradient(135deg, #2196F3, #1976D2)' }}>
            🔄 Refresh from Google Sheets
          </button>
          <button onClick={onLogout} style={{ background: 'linear-gradient(135deg, #666, #555)' }}>
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;