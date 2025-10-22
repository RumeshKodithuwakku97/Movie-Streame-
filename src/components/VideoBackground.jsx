import { useState } from 'react';

const VideoBackground = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    const video = document.getElementById('backgroundVideo');
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <>
      <video 
        autoPlay 
        muted={isMuted} 
        loop 
        id="backgroundVideo"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source 
          src="https://assets.mixkit.co/videos/preview/mixkit-popcorn-and-soda-in-a-cinema-41759-large.mp4" 
          type="video/mp4" 
        />
        Your browser does not support HTML5 video.
      </video>
      <div className="video-overlay"></div>
      
      <div className="video-controls">
        <button onClick={toggleMute}>
          <i className={`fas fa-volume-${isMuted ? 'mute' : 'up'}`}></i> 
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button onClick={togglePlay}>
          <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i> 
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </>
  );
};

export default VideoBackground;