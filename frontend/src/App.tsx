import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ConfigPage from './pages/ConfigPage';
import CandidatePage from './pages/CandidatePage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/config" element={<ConfigPage />} />
      <Route path="/candidate" element={<CandidatePage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}

export default App;