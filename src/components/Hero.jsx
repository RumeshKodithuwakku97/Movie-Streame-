const Hero = ({ onGetStarted }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>Experience Cinema Like Never Before</h1>
        <p>Stream thousands of movies in stunning quality. From latest blockbusters to timeless classics, all at your fingertips.</p>
        <button className="cta-button" onClick={() => scrollToSection('movies')}>
          Start Streaming Now
        </button>
      </div>
    </section>
  );
};

export default Hero;