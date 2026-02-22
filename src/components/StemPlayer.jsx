import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, AudioWaveform } from 'lucide-react';

export default function StemPlayer({ audioSource = null }) {
  // Define the stem tracks with your existing color/ID scheme
  const stemConfigs = [
    { id: 'vocals', name: 'VOCALS.WAV', color: 'text-[#00f0ff]' },
    { id: 'drums', name: 'DRUMS.WAV', color: 'text-gray-400' },
    { id: 'bass', name: 'BASS.WAV', color: 'text-[#e10075]' },
    { id: 'other', name: 'INSTRUMENTS.WAV', color: 'text-[#d4ff00]' },
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState(
    stemConfigs.reduce((acc, stem) => ({ ...acc, [stem.id]: 0.8 }), {})
  );
  
  const audioRefs = useRef({});

  // Global Play/Pause: Syncs all 4 audio tags
  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    
    Object.values(audioRefs.current).forEach(audio => {
      if (!audio) return;
      if (nextState) {
        audio.play().catch(e => console.error("Audio playback failed:", e));
      } else {
        audio.pause();
      }
    });
  };

  const handleVolumeChange = (id, newVolume) => {
    setVolumes(prev => ({ ...prev, [id]: newVolume }));
    if (audioRefs.current[id]) {
      audioRefs.current[id].volume = newVolume;
    }
  };

  const toggleMute = (id) => {
    const currentVol = volumes[id];
    const newVol = currentVol === 0 ? 0.8 : 0;
    handleVolumeChange(id, newVol);
  };

  // Keep volumes in sync with state
  useEffect(() => {
    Object.keys(audioRefs.current).forEach(id => {
      if (audioRefs.current[id]) {
        audioRefs.current[id].volume = volumes[id];
      }
    });
  }, [volumes]);

  return (
    <div className="w-full max-w-2xl bg-[#111] border border-gray-800 p-6 rounded-lg font-mono">
      
      {/* Global Controls */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            disabled={!audioSource}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors text-white 
              ${!audioSource ? 'bg-gray-900 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <div>
            <h3 className="text-gray-300 tracking-widest text-sm">LATENT_STEM_MIXER</h3>
            <p className="text-gray-500 text-xs mt-1">
              {audioSource ? "SYSTEM READY: 4 CHANNELS SYNCED" : "AWAITING SOURCE..."}
            </p>
          </div>
        </div>
      </div>

      {/* Individual Stem Tracks */}
      <div className="space-y-4">
        {stemConfigs.map((stem) => (
          <div key={stem.id} className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded border border-gray-800/50">
            
            {/* All audio elements use the same audioSource URL */}
            <audio 
              ref={el => audioRefs.current[stem.id] = el} 
              src={audioSource} 
              loop 
            />

            {/* Track Info */}
            <div className="flex items-center gap-3 w-48">
              <AudioWaveform className={`w-5 h-5 ${stem.color}`} />
              <span className={`text-xs tracking-widest ${stem.color}`}>
                {stem.name}
              </span>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-3 flex-1 px-8">
              <button onClick={() => toggleMute(stem.id)} className="text-gray-500 hover:text-white transition-colors">
                {volumes[stem.id] === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volumes[stem.id]} 
                onChange={(e) => handleVolumeChange(stem.id, parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Download Button */}
            <a 
              href={audioSource} 
              download={stem.name}
              className="p-2 text-gray-500 hover:text-[#4ade80] hover:bg-green-400/10 rounded transition-all"
            >
              <Download className="w-4 h-4" />
            </a>
            
          </div>
        ))}
      </div>
    </div>
  );
}