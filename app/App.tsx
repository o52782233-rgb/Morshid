import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import Home from './pages/Home';
import Library from './pages/Library';
import StudyPlans from './pages/StudyPlans';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import Faculty from './pages/Faculty';
import Procedures from './pages/Procedures';
import GPACalculator from './pages/GPACalculator';
import Schedule from './pages/Schedule';
import Community from './pages/Community';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // تحميل الخطوط والموارد الأساسية
    const timer = setTimeout(() => {
      setIsLoading(false);
      // بعد fade out animation
      setTimeout(() => {
        setShowContent(true);
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <BrowserRouter>
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
          {showContent && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors" dir="rtl">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
                <Route path="/study-plans" element={<StudyPlans />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/procedures" element={<Procedures />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/gpa-calculator" element={<GPACalculator />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/community" element={<Community />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard/*"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'staff', 'editor']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster position="top-center" richColors />
          </div>
          )}
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
