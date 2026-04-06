import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute/index.jsx';
import Navbar from './components/Navbar/index.jsx';
import LoginPage from './pages/LoginPage/index.jsx';
import HomePage from './pages/HomePage/index.jsx';
import InterviewSetupPage from './pages/InterviewSetupPage/index.jsx';
import InterviewPage from './pages/InterviewPage/index.jsx';
import FeedbackPage from './pages/FeedbackPage/index.jsx';
import HistoryPage from './pages/HistoryPage/index.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        }} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/setup" element={<ProtectedRoute><InterviewSetupPage /></ProtectedRoute>} />
                <Route path="/interview/:id" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
                <Route path="/feedback/:id" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;