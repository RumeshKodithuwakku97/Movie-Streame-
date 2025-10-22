import MovieCard from './MovieCard';

const MovieGrid = ({ 
  movies, 
  title, 
  showFilters = false, 
  currentFilter, 
  onFilterChange 
}) => {
  const genres = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Romance'];

  return (
    <section className="section" id={title.toLowerCase()}>
      <h2 className="section-title">{title}</h2>
      
      {showFilters && (
        <div className="filter-buttons">
          {genres.map(genre => (
            <button
              key={genre}
              className={`filter-btn ${currentFilter === genre.toLowerCase() ? 'active' : ''}`}
              onClick={() => onFilterChange(genre.toLowerCase())}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <div style={{ 
            gridColumn: '1/-1', 
            textAlign: 'center', 
            padding: '3rem',
            color: '#999'
          }}>
            <i className="fas fa-film" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
            <h3>No movies found</h3>
            <p>Try a different filter or search term</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieGrid;