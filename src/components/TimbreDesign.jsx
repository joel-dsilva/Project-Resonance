import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Square, Layers, Sparkles } from 'lucide-react';

export default function TimbreDesign({ engineState = 'idle', engineProgress = 0 }) {
  // Fake telemetry data to simulate real-time WebSocket updates
  const [telemetry, setTelemetry] = useState({
    glow: 88.4,
    groove: 0.92,
    bpm: 128.00
  });

  // Hackathon trick: Make numbers jitter slightly so it looks "live"
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        glow: (88 + Math.random() * 2).toFixed(1)
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen flex flex-col items-center pt-8 pb-20 relative z-20"
    >
      {/* Top Headers */}
      <div className="w-full flex justify-between items-center max-w-6xl mb-8 px-8">
        <div className="text-res-yellow tracking-[0.3em] text-xs font-mono border-b border-res-yellow pb-1">
          SIDE B — TRACK 06
        </div>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-7xl font-bold italic text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Timbre <span className="font-cursive text-res-magenta font-normal normal-case text-8xl -ml-4">Design</span>
        </h1>
        <p className="text-res-yellow mt-2 font-mono text-sm tracking-widest">
          Where the latent space meets the dance floor.
        </p>
      </div>

      {/* The Arena (Latent Space) */}
      <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center mb-20">
        
        {/* Central Core */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }} // Slower, more majestic rotation
          className="w-80 h-80 rounded-full shadow-[0_0_150px_rgba(212,255,0,0.3),inset_0_-20px_60px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center relative z-10 overflow-hidden bg-gradient-to-br from-gray-100 via-gray-300 to-gray-900 border-2 border-res-yellow/20"
        >
          {/* Glowing 3D Grid on the sphere */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDE5aDIwTTAgOWhVMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDRmZjAwIiBzdHJva2Utb3BhY2l0eT0iMC40IiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-80 mix-blend-overlay rounded-full scale-[1.8]" />
          
          {/* Inner light bloom for extra pop */}
          <div className="absolute inset-0 bg-res-yellow/10 blur-2xl rounded-full" />
        </motion.div>
        
        {/* Label for Core */}
        <div className="absolute -bottom-8 font-mono text-res-magenta tracking-[0.3em] text-sm font-bold z-20 border-b border-res-magenta pb-1">
          LATENT_CORE_01
        </div>

        {/* Floating Node 1: Pitch */}
        <motion.div 
          drag
          dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-[20%] flex flex-col items-center cursor-grab active:cursor-grabbing z-30"
        >
          <Music className="w-12 h-12 text-[#4ade80] drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
          <span className="font-mono text-[10px] text-[#4ade80] mt-2 tracking-widest">PITCH_NODE_A</span>
        </motion.div>

        {/* Floating Node 2: Key Mod */}
        <motion.div 
          drag
          dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 left-[15%] flex flex-col items-center cursor-grab active:cursor-grabbing z-30"
        >
          <div className="w-8 h-20 bg-gray-500/50 backdrop-blur-md border border-gray-400 transform -rotate-45" />
          <span className="font-mono text-[10px] text-gray-400 mt-2 tracking-widest">KEY_MOD_04</span>
        </motion.div>

        {/* Floating Node 3: Harmonic */}
        <motion.div 
          drag
          dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-12 right-[20%] flex flex-col items-center cursor-grab active:cursor-grabbing z-30"
        >
          <Layers className="w-12 h-12 text-[#a855f7] drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          <span className="font-mono text-[10px] text-[#a855f7] mt-2 tracking-widest">HARMONIC_STRATA</span>
        </motion.div>

        {/* Telemetry Box */}
        <div className="absolute top-10 right-0 border border-[#333] bg-res-panel/80 p-6 backdrop-blur-sm w-64 z-20">
          <h3 className="text-res-yellow text-[10px] font-mono mb-6 flex items-center justify-between tracking-widest">
            REAL-TIME TELEMETRY <span className="w-2 h-2 bg-res-magenta rounded-full animate-pulse shadow-[0_0_8px_#e10075]" />
          </h3>
          <div className="space-y-4 font-mono text-[11px] tracking-wider">
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">GLOW_INTENSITY</span>
              <span className="text-res-magenta">{telemetry.glow}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">GROOVE_INDEX</span>
              <span className="text-res-yellow">{telemetry.groove}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">BPM_SYNC</span>
              <span className="text-[#4ade80]">{telemetry.bpm}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Columns */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-12 px-8 mt-12">
        <div>
          <h4 className="text-gray-500 font-mono text-4xl mb-2 opacity-50 italic">01</h4>
          <h3 className="text-res-yellow font-display text-xl mb-4">The Groovy Manifold</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Gen X sensibilities meet future-tech. We treat audio data like a disco dance floor—vibrant, multi-dimensional, and always moving to the beat.
          </p>
        </div>
        <div>
          <h4 className="text-res-magenta font-mono text-4xl mb-2 opacity-50 italic">02</h4>
          <h3 className="text-res-magenta font-display text-xl mb-4 italic">Hyper-Retro Fluidity</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Our 3D objects aren't just for show. They represent the actual harmonic components morphing through the silver-mirrored lens of the latent space.
          </p>
        </div>
        <div>
          <h4 className="text-res-yellow font-mono text-4xl mb-2 opacity-50 italic">03</h4>
          <h3 className="text-res-yellow font-display text-xl mb-4 italic">Vibrant Synthesis</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Navigation is intuitive. Spin the sphere to interpolate between analog warmth and digital precision in a seamless, glowing transition.
          </p>
        </div>
      </div>
    </motion.div>
  );
}