import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Play, Square, Loader2, Music, Mic2, Cpu, Activity, Speaker } from 'lucide-react';

export default function SeparatorPanel({ onStateChange, onProgressChange, onFileSelect }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); 
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const fileInputRef = useRef(null);

  const handleProcess = () => {
    if (!file) return;
    
    setStatus('processing');
    if (onStateChange) onStateChange('processing');
    
    setLogs(['[SYS] Initializing neural deconstruction...']);
    setProgress(0);
    if (onProgressChange) onProgressChange(0);

    const mockSteps = [
      { progress: 15, log: '[EXTRACT] Isolating vocal harmonics...' },
      { progress: 35, log: '[EXTRACT] Demuxing drum transients...' },
      { progress: 60, log: '[FILTER] Applying analog crosstalk suppression...' },
      { progress: 85, log: '[RENDER] Rebuilding phase alignment...' },
      { progress: 100, log: '[SYS] Stems successfully generated.' }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < mockSteps.length) {
        const safeProgress = mockSteps[currentStep].progress;
        const safeLog = mockSteps[currentStep].log;
        
        setProgress(safeProgress);
        if (onProgressChange) onProgressChange(safeProgress);
        setLogs(prev => [...prev, safeLog]);
        
        currentStep++;
      } else {
        clearInterval(interval);
        setStatus('complete');
        if (onStateChange) onStateChange('complete');
      }
    }, 800);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Send the file up to Lab.jsx so TimbreDesign can use it too
      if (onFileSelect) {
        onFileSelect(selectedFile);
      }
      
      setStatus('idle');
      setProgress(0);
      setLogs([]);
    }
  };

  const resetEngine = () => {
    setStatus('idle');
    setFile(null);
    if (onStateChange) onStateChange('idle');
    if (onProgressChange) onProgressChange(0);
  };

  // Helper to get a preview URL for the uploaded file
  const audioPreviewUrl = file ? URL.createObjectURL(file) : "";

  return (
    <div className="w-full bg-[#0f1123]/90 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-2xl relative z-50">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <h3 className="font-display font-bold text-xl text-white tracking-widest uppercase flex items-center gap-2">
          <Cpu className="text-res-yellow w-5 h-5" />
          Latent Separation Engine
        </h3>
        <span className="font-mono text-xs text-res-magenta bg-res-magenta/10 px-2 py-1 rounded">V 1.0.4</span>
      </div>

      {/* Upload Zone */}
      {status === 'idle' && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 hover:border-res-yellow transition-colors rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer bg-black/20"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="audio/mp3,audio/wav" 
            className="hidden" 
          />
          <Upload className="w-10 h-10 text-gray-400 mb-4" />
          <p className="font-mono text-sm text-gray-300 text-center">
            {file ? file.name : "DRAG AUDIO FILE HERE OR CLICK TO BROWSE"}
          </p>

          {file && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleProcess(); }}
              className="mt-6 bg-res-yellow text-black font-bold tracking-widest px-8 py-3 text-sm hover:scale-105 transition-transform"
            >
              INITIALIZE SPLIT
            </button>
          )}
        </div>
      )}

      {/* Processing State */}
      {status === 'processing' && (
        <div className="space-y-4">
          <div className="flex justify-between font-mono text-xs text-[#00f0ff]">
            <span>PROCESSING STEMS...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/10">
            <motion.div 
              className="h-full bg-res-magenta"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          
          <div className="bg-black/50 border border-white/5 rounded p-4 h-32 overflow-y-auto font-mono text-xs text-green-400 space-y-1">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="flex items-center gap-2 text-res-yellow mt-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Awaiting model convergence...</span>
            </div>
          </div>
        </div>
      )}

      {/* Results State */}
      {status === 'complete' && (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded text-sm font-mono flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            SEPARATION COMPLETE.
          </div>

          <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {/* Vocals */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-sm"><Mic2 className="w-4 h-4" /> VOCALS</div>
              <audio controls className="w-full h-8"><source src={audioPreviewUrl} type={file?.type} /></audio>
            </div>
            
            {/* Drums */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-res-yellow font-mono text-sm"><Activity className="w-4 h-4" /> DRUM TRANSIENTS</div>
              <audio controls className="w-full h-8"><source src={audioPreviewUrl} type={file?.type} /></audio>
            </div>

            {/* Bass */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-green-400 font-mono text-sm"><Speaker className="w-4 h-4" /> BASS HARMONICS</div>
              <audio controls className="w-full h-8"><source src={audioPreviewUrl} type={file?.type} /></audio>
            </div>

            {/* Other */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-res-magenta font-mono text-sm"><Music className="w-4 h-4" /> OTHER</div>
              <audio controls className="w-full h-8"><source src={audioPreviewUrl} type={file?.type} /></audio>
            </div>
          </div>

          <button onClick={resetEngine} className="w-full border border-white/20 text-white font-mono text-sm py-2 hover:bg-white/5 transition-colors">
            [ RESET ENGINE ]
          </button>
        </div>
      )}
    </div>
  );
}