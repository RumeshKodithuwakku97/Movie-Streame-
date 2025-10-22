import { useState, useEffect } from 'react';

const AdminPanel = ({ 
  isAuthenticated, 
  onLogin, 
  onLogout, 
  movies, 
  onAddMovie, 
  onUpdateMovie, 
  onDeleteMovie 
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
  const [editingMovieId, setEditingMovieId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
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
      setEditingMovieId(null);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    onLogin(password);
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!movieForm.title || !movieForm.year || !movieForm.genre || 
        !movieForm.poster || !movieForm.streamLink || !movieForm.downloadLink) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingMovieId) {
      onUpdateMovie(editingMovieId, movieForm);
      alert('Movie updated successfully!');
    } else {
      onAddMovie(movieForm);
      alert('Movie added successfully!');
    }

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
    setEditingMovieId(null);
  };

  const handleEdit = (movie) => {
    setMovieForm(movie);
    setEditingMovieId(movie.id);
  };

  const handleCancelEdit = () => {
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
    setEditingMovieId(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(movies, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'moviestream-data.json';
    link.click();
    URL.revokeObjectURL(url);
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
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>Login</button>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#999' }}>
            Default password: admin123
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="admin">
      <h2 className="section-title">Admin Panel</h2>
      
      <div className="admin-panel">
        <h3 style={{ marginBottom: '1.5rem', color: '#e50914', textAlign: 'center' }}>
          {editingMovieId ? 'Edit Movie' : 'Add New Movie'}
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
            <option value="Adventure">Adventure</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Animation">Animation</option>
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
            placeholder="Streaming Link *"
            required
          />
          <input
            type="url"
            value={movieForm.downloadLink}
            onChange={(e) => setMovieForm(prev => ({ ...prev, downloadLink: e.target.value }))}
            placeholder="Download Link *"
            required
          />
          
          <div className="full-width" style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="full-width">
              {editingMovieId ? 'Update Movie' : 'Add Movie to Database'}
            </button>
            {editingMovieId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                style={{ background: 'linear-gradient(135deg, #666, #555)' }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        
        <h3 style={{ margin: '3rem 0 1.5rem', color: '#e50914', textAlign: 'center' }}>
          Manage Existing Movies ({movies.length})
        </h3>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {movies.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
              No movies in database
            </p>
          ) : (
            movies.map(movie => (
              <div key={movie.id} className="movie-card" style={{ marginBottom: '1rem' }}>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title} ({movie.year})</h3>
                  <div className="movie-meta">
                    <span>{movie.rating}</span>
                    <span>{movie.genre}</span>
                  </div>
                  <p className="movie-description">{movie.description}</p>
                  <div className="admin-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEdit(movie)}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this movie?')) {
                          onDeleteMovie(movie.id);
                        }
                      }}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="admin-actions">
          <button onClick={onLogout} style={{ background: 'linear-gradient(135deg, #666, #555)' }}>
            Logout
          </button>
          <button onClick={handleExport} style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
            Export Data
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;