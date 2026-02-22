import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimbreDesign from '../components/TimbreDesign';
import SeparatorPanel from '../components/SeparatorPanel';

export default function Lab() {
  const [engineState, setEngineState] = useState('idle'); // idle, processing, complete
  const [progress, setProgress] = useState(0);

  const isDone = engineState === 'complete';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative flex flex-col">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center z-50">
        <div className="font-mono text-sm text-res-yellow tracking-[0.3em] font-bold">
          [ RESONANCE_LAB_SESSION_01 ]
        </div>
        <button onClick={() => window.location.href = '/'} className="text-xs font-mono opacity-50 hover:opacity-100 transition-opacity uppercase tracking-widest">
          // Terminate
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* PHASE 1: The Input Deck (Full screen while idle/processing) */}
        {!isDone && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl z-20"
          >
            <SeparatorPanel 
              onStateChange={setEngineState} 
              onProgressChange={setProgress} 
            />
          </motion.div>
        )}

        {/* PHASE 2: The Latent Core Reveal (Only shows after completion) */}
        <AnimatePresence>
          {isDone && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex flex-col lg:flex-row items-center justify-around gap-12"
            >
              {/* The Visualizer - Now the Hero of the page */}
              <motion.div 
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12 }}
                className="lg:w-1/2 flex justify-center"
              >
                <TimbreDesign engineState={engineState} engineProgress={progress} />
              </motion.div>

              {/* The Controls - Shifted to the side as a "results" panel */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="lg:w-1/3 z-20"
              >
                <div className="bg-res-magenta/5 border border-res-magenta/20 p-4 mb-4 rounded font-mono text-[10px] text-res-magenta animate-pulse">
                  NEURAL_MAPPING_SUCCESSFUL: STEMS_DECOUPLED
                </div>
                <SeparatorPanel 
                  onStateChange={setEngineState} 
                  onProgressChange={setProgress} 
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Dynamic Status Bar */}
      <div className="w-full p-4 border-t border-white/5 bg-black/50 backdrop-blur-md flex justify-between font-mono text-[10px] tracking-widest text-gray-500">
        <div>CORE_TEMP: 34°C</div>
        <div className="text-res-yellow">ENGINE_STATUS: {engineState.toUpperCase()}</div>
        <div>BUFFER_MODE: FAST_LATENCY</div>
      </div>
    </div>
  );
}