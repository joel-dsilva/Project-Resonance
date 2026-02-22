# 🎛️ PROJECT RESONANCE (deSynth)
**ANALOG SOUL // DIGITAL MIND**

> *The ultimate Gen X audio engine. High-fidelity neural deconstruction meets retro-futuristic aesthetics. We isolate, transcribe, and reimagine music from the era of tape decks and studio cans.*

---

## 📖 System Overview

**Project Resonance** is an advanced machine-learning audio processing ecosystem. It dissects complex audio files into individual stems (Vocals, Drums, Bass, and Other) using a custom neural network, routes the processed audio through a high-speed Go gateway, and visualizes the manifold in a highly stylized, terminal-inspired React interface.



---

## ✨ Core Features

* **Neural Stem Separation:** Powered by our custom `deSynth` ML engine to break down full tracks into distinct, high-fidelity isolated channels.
* **The Lab (Workspace):** A clinical, responsive UI featuring drag-and-drop audio uploading, real-time visual status tracking, and engine memory allocation monitoring.
* **Latent Stem Mixer:** A perfectly synchronized 4-channel audio player allowing users to mute, solo, and mix stems in real-time.
* **Timbre Design Visualizer:** Real-time visual feedback of the latent space as the audio is parsed.
* **Go API Gateway:** A robust backend (`quantizer.go`) that handles API requests, file management, and audio quantization between the frontend and the ML model.
* **The Chaos Protocol:** Unstable rhythmic entropy. A hidden, lore-filled terminal page detailing the "Ghost in the Machine" when harmonic resonance exceeds 112% at 142BPM.

---

## 🛠️ Tech Stack

### Frontend (The Interface)
* **Framework:** React.js + Vite
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS (Custom themes: `res-magenta`, `res-yellow`, `#0a0a0a` dark mode)
* **Animations:** Framer Motion
* **Icons:** Lucide-React

### Backend (The Gateway)
* **Language:** Go (Golang)
* **Audio Processing:** Custom `quantizer.go` pipeline
* **Storage:** Local `.wav` buffer management (`/temp_audio/`)

### Machine Learning (The Engine)
* **Environment:** Python / Jupyter Notebooks (`ML/deSynth.ipynb`)
* **Task:** Source Audio Separation (Stem isolation)

---

## 📂 Architecture & Structure

```text
project-resonance/
├── ML/
│   └── deSynth.ipynb          # Neural network & audio separation model
├── gateway/
│   ├── main.go                # Go API server entry point
│   ├── quantizer.go           # Audio manipulation/quantization logic
│   ├── go.mod / go.sum        # Go dependencies
│   └── temp_audio/            # Local buffer for processed .wav files
├── src/
│   ├── assets/                # Static visual assets (cassettes, UI elements)
│   ├── components/
│   │   ├── SeparatorPanel.jsx # File upload and engine triggering
│   │   ├── StemPlayer.jsx     # 4-channel synced audio mixer
│   │   └── TimbreDesign.jsx   # 3D visualizer & state tracking
│   ├── pages/
│   │   ├── Landing.jsx        # Navigation & System Intro
│   │   ├── Lab.jsx            # Main synthesis workspace
│   │   └── Chaos.jsx          # Error logs & system lore
│   ├── App.jsx                # Router configuration
│   └── main.jsx               # React initialization
└── README.md                  # System documentation


🚀 Initialization Sequence
1. Booting the Frontend
Navigate to the project root directory:

```
    npm install
    npm run dev
    Access the terminal interface at http://localhost:5173.
```
2. Engaging the Go Gateway
Open a new terminal session and navigate to the backend:

```
    cd gateway
    go mod tidy
    go run main.go
    The gateway will begin listening for audio vector inputs.
```
3. Machine Learning Setup
To modify or retrain the separation engine, open ML/deSynth.ipynb in your preferred Jupyter environment (e.g., VS Code or JupyterLab). Ensure all Python dependencies (PyTorch/TensorFlow, Librosa, etc.) are installed in your active environment.

⚠️ SYSTEM_WARNING // PHASE 01-A
STATUS: UNSTABLE
MEM_LEAK: 8.9GB
ERR_CODE: 0xCC001

Notice: If the audio manifold begins generating unauthorized counter-melodies during stem isolation, users are advised to engage the [ TERMINATE ] protocol immediately. Proceeding beyond safe latency bounds voids all cognitive warranties.


To push this to GitHub so your friend can see it, just run:
```
    git add README.md
    git commit -m "Added comprehensive project README"
    git push origin main
```