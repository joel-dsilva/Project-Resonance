import React, { useState } from 'react';
import TimbreDesign from '../components/TimbreDesign';
import SeparatorPanel from '../components/SeparatorPanel';

export default function Lab() {
  const [engineState, setEngineState] = useState('idle'); 
  const [progress, setProgress] = useState(0);
  const [audioURL, setAudioURL] = useState(null);

  const isDone = engineState === 'complete';

  // Handle file from SeparatorPanel
  const onFileReady = (file) => {
    const url = URL.createObjectURL(file);
    setAudioURL(url);
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex flex-col font-display relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Nav */}
      <nav className="w-full p-6 flex justify-between items-center z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-green-500 animate-pulse' : 'bg-res-yellow'}`} />
           <span className="font-mono text-xs tracking-[0.3em] font-bold">
             {isDone ? 'RESONANCE_STEMS_READY' : 'RESONANCE_SYSTEM_ACTIVE'}
           </span>
        </div>
        
        {/* Right side Terminate Button */}
        <button 
          onClick={() => window.location.href = '/'} 
          className="font-mono text-xs tracking-[0.2em] text-gray-400 border border-gray-600 px-4 py-2 hover:text-white hover:border-white hover:bg-white/5 transition-all uppercase"
        >
          [ Terminate ]
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full relative p-6 overflow-y-auto overflow-x-hidden">
        
        {/* The Split Container */}
        <div className={`flex transition-all duration-1000 ease-in-out gap-10 max-w-[1600px] mx-auto 
          ${isDone ? 'flex-row items-start' : 'flex-col items-center justify-center min-h-[70vh]'}`}
        >
          
          {/* LEFT SIDE: The Sphere/Players */}
          <div className={`transition-all duration-1000 flex-1 ${isDone ? 'opacity-100' : 'opacity-0 scale-95 pointer-events-none absolute'}`}>
             <TimbreDesign 
                engineState={engineState} 
                engineProgress={progress} 
                audioSource={audioURL} 
             />
          </div>

          {/* RIGHT SIDE (or Center): The Engine Panel */}
          <div className={`transition-all duration-1000 ease-in-out flex-shrink-0 z-20 
            ${isDone ? 'w-[450px] mt-10' : 'w-full max-w-xl'}`}
          >
            <SeparatorPanel 
              onStateChange={setEngineState} 
              onProgressChange={setProgress}
              onFileSelect={onFileReady} 
            />
          </div>

        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="w-full p-4 border-t border-white/5 bg-black/50 backdrop-blur-md flex justify-between font-mono text-[9px] text-gray-500 z-50">
        <div>STATUS: {engineState.toUpperCase()}</div>
        <div>MEM_ALLOC: 4.2GB</div>
      </footer>
    </div>
  );
}