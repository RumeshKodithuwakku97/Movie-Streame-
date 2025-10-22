const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact</a>
          <a href="#faq">FAQ</a>
        </div>
        <p>&copy; 2024 MovieStream. All rights reserved.</p>
        <p style={{ color: '#666', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Experience the magic of cinema with MovieStream
        </p>
      </div>
    </footer>
  );
};

export default Footer;