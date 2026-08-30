import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const SignToTextPage = React.lazy(() => import('./pages/SignToTextPage'));
const TextToSignPage = React.lazy(() => import('./pages/TextToSignPage'));
const VideoMeetLivePage = React.lazy(() => import('./pages/VideoMeetLivePage'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div className="app-loading" role="status">Loading BridgeTalk...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-to-text" element={<SignToTextPage />} />
          <Route path="/text-to-sign" element={<TextToSignPage />} />
          <Route path="/video-meet-live" element={<VideoMeetLivePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
