import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Lab from './pages/Lab';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/lab" element={<Lab />} />
      </Routes>
    </Router>
  );
}

export default App;