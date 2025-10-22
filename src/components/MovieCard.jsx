const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <img src={movie.poster} alt={movie.title} className="movie-poster" />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span>{movie.year}</span>
          <span>{movie.rating}</span>
        </div>
        <div className="movie-genre">{movie.genre}</div>
        <p className="movie-description">{movie.description}</p>
        <div className="action-buttons">
          <a 
            href={movie.streamLink} 
            className="watch-btn" 
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch Now
          </a>
          <a 
            href={movie.downloadLink} 
            className="download-btn" 
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;