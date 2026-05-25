import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Public Marketing Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Features from './pages/public/Features';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';

// Protected App Pages
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Subjects from './pages/Subjects';
import Recommendations from './pages/Recommendations';
import Questions from './pages/Questions';
import ExamPaper from './pages/ExamPaper';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If route requires admin but user is not admin
  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If route is a student route but user IS an admin
  if (!requireAdmin && role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard App Routes (Protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        <Route path="/questions" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
        <Route path="/exam" element={<ProtectedRoute><ExamPaper /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/issues" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/exams" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/subjects" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
};

export default App;
