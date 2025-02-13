import React, { useState, useEffect, useRef } from 'react';
import audioFile from '../assets/whispering-vinyl-loops-lofi-beats-281193.mp3';

const Toggle = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      isChecked ? audioRef.current.play().catch(console.error) : audioRef.current.pause();
    }
  }, [isChecked, volume]);

  return (
    <div className="flex items-center gap-2">
      {/* Toggle Switch */}
      <label className="cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 shadow-inner transition-colors">
            <div
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                isChecked ? 'translate-x-5 bg-blue-500' : ''
              }`}
            ></div>
          </div>
        </div>
      </label>

      {/* Volume Slider */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />

      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src={audioFile} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default Toggle;