import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileAudio } from 'lucide-react';
import abcjs from 'abcjs';

/**
 * Super basic Hackathon-level MIDI to ABC notation converter.
 * Maps raw Go math into western staff strings.
 */
function rawMidiToABC(midiData, stemName) {
    if (!midiData || !midiData.notes || midiData.notes.length === 0) {
        return `X:1\nT:No Data\nM:4/4\nL:1/4\nK:C\n|]`;
    }

    // Basic Pitch to ABC mapping for one octave (C4 to B4)
    // We offset it wildly to keep it on the staff for the demo.
    const pitchMap = {
        0: "C", 1: "^C", 2: "D", 3: "^D", 4: "E", 5: "F", 6: "^F", 7: "G", 8: "^G", 9: "A", 10: "^A", 11: "B"
    };

    let abcString = `X:1\n`;
    abcString += `T:${stemName.toUpperCase()} TRANSCRIPTION\n`;
    abcString += `M:4/4\n`; // Assuming 4/4 sync
    abcString += `L:1/16\n`; // Assuming 16th note grid from Go
    abcString += `Q:1/4=${Math.round(midiData.bpm || 120)}\n`;
    abcString += `K:C\n`;

    let notesString = "";
    let currentTime = 0;

    // Assume Go quantized everything strictly to the 1/16 grid
    // Sixteenth note duration in seconds
    const sixteenth = (60.0 / (midiData.bpm || 120)) / 4.0;

    midiData.notes.forEach((note, index) => {
        // 1. Calculate RESTS (if note startTime > currentTime)
        // We hack this simply for the visual
        if (note.startTime > currentTime + 0.05) { // 50ms tolerance
            const restDurationSec = note.startTime - currentTime;
            const restSixteenths = Math.max(1, Math.round(restDurationSec / sixteenth));
            notesString += `z${restSixteenths} `;
        }

        // 2. Map PITCH
        const pitchClass = note.pitch % 12;
        // basic octave math to keep it visually on the staff
        let abcNote = pitchMap[pitchClass];
        if (note.pitch > 71) abcNote = abcNote.toLowerCase(); // High octave

        // 3. Map DURATION
        const durationSixteenths = Math.max(1, Math.round(note.duration / sixteenth));

        notesString += `${abcNote}${durationSixteenths} `;

        // 4. Fake Bar lines every 16 sixteenths (lazy hackathon math)
        // Hard-wrap the staff every 4 bars (64 sixteenths)
        if (index > 0 && index % 8 === 0) {
            // If it's the 4th bar, inject a physical newline so ABCJS draws a new staff below
            if (index % 32 === 0) {
                notesString += "|\n";
            } else {
                notesString += "| ";
            }
        }

        currentTime = note.startTime + note.duration;
    });

    abcString += notesString + "|]\n";
    return abcString;
}

export default function SheetMusicModal({ isOpen, onClose, stemName, midiData }) {
    const paperRef = useRef(null);
    const [abcContent, setAbcContent] = useState("");

    useEffect(() => {
        if (isOpen && midiData) {
            const abc = rawMidiToABC(midiData, stemName);
            setAbcContent(abc);
        }
    }, [isOpen, midiData, stemName]);

    // Render the ABCJS whenever the content updates
    useEffect(() => {
        if (isOpen && paperRef.current && abcContent) {
            abcjs.renderAbc(paperRef.current, abcContent, {
                responsive: "resize",
                add_classes: true, // Allows CSS targeting
                paddingtop: 20,
                paddingbottom: 20,
                staffwidth: 740,
                wrap: {
                    minSpacing: 1.8,
                    maxSpacing: 2.7,
                    preferredMeasuresPerLine: 4,
                },
                foregroundColor: "#E5E7EB", // text-gray-200
            });
        }
    }, [isOpen, abcContent]);

    // Download raw MIDI logic via Blob
    const handleDownloadMIDI = () => {
        if (!midiData) return;
        const jsonString = JSON.stringify(midiData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${stemName}_transcription.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-[#111] border border-gray-800 rounded-xl shadow-2xl z-[1000] overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* 
                            Crucial scoped styles for abcjs SVGs
                            Forces the black paths/text to light gray for dark mode compatibility 
                        */}
                        <style>{`
                            .abc-container svg {
                                background: transparent !important;
                            }
                            .abc-container svg path {
                                fill: #E5E7EB !important;
                                stroke: #E5E7EB !important;
                            }
                            .abc-container svg text {
                                fill: #E5E7EB !important;
                            }
                            .abc-container svg rect {
                                fill: transparent !important;
                            }
                        `}</style>

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#0a0a0a]">
                            <div>
                                <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                    <FileAudio className={`w-5 h-5 ${stemName === 'vocals' ? 'text-[#00f0ff]' : 'text-[#e10075]'}`} />
                                    LATENT TRANSCRIPTION: {stemName}
                                </h2>
                                <p className="font-mono text-xs text-gray-500 mt-1">
                                    Quantized natively via Go gateway. Confidence interval applied.
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleDownloadMIDI}
                                    className="flex items-center gap-2 font-mono text-xs bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    RAW DATA
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-white transition-colors p-2"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Notation Body */}
                        <div className="p-8 overflow-y-auto bg-[#1a1a1a] flex-1">
                            <div
                                ref={paperRef}
                                className="w-full bg-transparent abc-container"
                            />
                        </div>
                    </motion.div>
                </React.Fragment>
            )}
        </AnimatePresence>
    );
}
