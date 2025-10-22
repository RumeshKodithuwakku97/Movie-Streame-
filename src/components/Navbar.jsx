import { useState, useEffect } from 'react';

const Navbar = ({ onSearch, onAdminClick, scrolled }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    onSearch(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#" className="logo">MovieStream</a>
        <ul className="nav-links">
          <li><a onClick={() => scrollToSection('home')}>Home</a></li>
          <li><a onClick={() => scrollToSection('movies')}>Movies</a></li>
          <li><a onClick={() => scrollToSection('downloads')}>Downloads</a></li>
          <li><a onClick={onAdminClick}>Admin</a></li>
        </ul>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>
            <i className="fas fa-search"></i> Search
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;