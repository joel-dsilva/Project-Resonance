import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Play, Square, Loader2, Music, Mic2, Cpu, Activity, Speaker } from 'lucide-react';

export default function SeparatorPanel({ onStateChange, onProgressChange, onFileSelect }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [stemUrls, setStemUrls] = useState(null);
  const fileInputRef = useRef(null);

  const handleProcess = async () => {
    if (!file) return;

    setStatus('processing');
    if (onStateChange) onStateChange('processing');

    setLogs(['[SYS] Initializing neural deconstruction...', '[SYS] Transmitting audio payload to Go Gateway...']);
    // Removed progress numeric tracking since we don't know the progress
    // if (onProgressChange) onProgressChange(0);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      setLogs(prev => [...prev, '[EXTRACT] Waiting for Python Demucs model...']);
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return valid JSON data");
      }

      setLogs(prev => [...prev, '[SYS] Parsing response JSON...']);
      const data = await response.json();

      setStemUrls(data.stems);
      setLogs(prev => [...prev, '[SYS] Stems successfully generated.']);

      if (onFileSelect) {
        onFileSelect(data.stems, data.quantized_midi);
      }

      setStatus('complete');
      if (onStateChange) onStateChange('complete');
    } catch (error) {
      console.error("Upload failed", error);
      setLogs(prev => [...prev, `[ERROR] Connection failed: ${error.message}`]);
      setStatus('error'); // optional error state handling
      if (onStateChange) onStateChange('error');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      setStatus('idle');
      setProgress(0);
      setLogs([]);
      setStemUrls(null);
    }
  };

  const resetEngine = () => {
    setStatus('idle');
    setFile(null);
    setStemUrls(null);
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
            <span>PROCESSING STEMS... THIS MAY TAKE A MOMENT</span>
            <Loader2 className="w-4 h-4 animate-spin text-res-magenta" />
          </div>
          <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/10 relative">
            <motion.div
              className="absolute top-0 bottom-0 bg-res-magenta w-1/3"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
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
              {stemUrls && <audio controls className="w-full h-8" src={stemUrls.vocals} />}
            </div>

            {/* Drums */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-res-yellow font-mono text-sm"><Activity className="w-4 h-4" /> DRUM TRANSIENTS</div>
              {stemUrls && <audio controls className="w-full h-8" src={stemUrls.drums} />}
            </div>

            {/* Bass */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-green-400 font-mono text-sm"><Speaker className="w-4 h-4" /> BASS HARMONICS</div>
              {stemUrls && <audio controls className="w-full h-8" src={stemUrls.bass} />}
            </div>

            {/* Other */}
            <div className="bg-black/40 border border-white/10 p-4 rounded-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-res-magenta font-mono text-sm"><Music className="w-4 h-4" /> OTHER</div>
              {stemUrls && <audio controls className="w-full h-8" src={stemUrls.other} />}
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