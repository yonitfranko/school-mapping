// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// ייבוא קומפוננטות
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ExportData from './components/ExportData';
import Forms from './components/Forms';
import MigrateData from './components/MigrateData';
import Navbar from './components/Navbar';

// רכיב מגן שמנתב משתמשים לא מחוברים להתחברות
function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="container mt-5 text-center">טוען...</div>;
  }
  
  return currentUser ? children : <Navigate to="/login" />;
}

// רכיב מגן עבור מנהלים בלבד
function AdminRoute({ children }) {
  const { currentUser, userDetails, loading } = useAuth();
  
  if (loading) {
    return <div className="container mt-5 text-center">טוען...</div>;
  }
  
  return currentUser && userDetails?.role === 'admin' 
    ? children 
    : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* נתיבים ציבוריים */}
          <Route path="/login" element={<Login />} />
          
          {/* נתיבים מוגנים */}

          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

        
          <Route path="/export" element={
            <PrivateRoute>
              <ExportData />
            </PrivateRoute>
          } />
          <Route path="/forms" element={
            <PrivateRoute>
              <Forms />
            </PrivateRoute>
          } />
          
          {/* נתיבים למנהלים בלבד */}
          <Route path="/migrate" element={
            <AdminRoute>
              <MigrateData />
            </AdminRoute>
          } />
          
          {/* ניתוב ברירת מחדל */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;