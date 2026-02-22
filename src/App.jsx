import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Lab from './pages/Lab';
import Chaos from './pages/Chaos'; // 1. Import the new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/chaos" element={<Chaos />} /> {/* 2. Add the route */}
      </Routes>
    </Router>
  );
}

export default App;