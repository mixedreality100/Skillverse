import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import audioFile from "../assets/whispering-vinyl-loops-lofi-beats-281193.mp3";

const MusicControl = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(new Audio(audioFile));
  const controlRef = useRef(null);

  useEffect(() => {
    // Set up audio error handling
    audioRef.current.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
      setAudioError(true);
      setIsPlaying(false);
    });

    // Set initial volume
    audioRef.current.volume = volume;

    return () => {
      audioRef.current.pause();
      audioRef.current.removeEventListener('error', () => {});
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (controlRef.current && !controlRef.current.contains(event.target)) {
        setShowVolume(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const togglePlayPause = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to parent
    if (audioError) {
      console.error('Audio file could not be loaded');
      return;
    }
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback started successfully
            })
            .catch(error => {
              console.error("Playback failed:", error);
              setAudioError(true);
            });
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Audio control error:", error);
      setAudioError(true);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div ref={controlRef} className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setShowVolume(!showVolume);
        }}
        className={`flex items-center justify-center ${audioError ? 'bg-red-500' : 'bg-orange-500'} text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition duration-300`}
        title={audioError ? "Audio failed to load" : "Toggle music"}
      >
        <div onClick={togglePlayPause}>
          {isPlaying ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </div>
      </button>
      
      {showVolume && !audioError && (
        <div className="absolute top-12 -left-12 bg-white p-2 rounded-lg shadow-lg z-50">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 accent-orange-500"
          />
        </div>
      )}
    </div>
  );
};

export default MusicControl; 