// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoutes from './components/PrivateRoutes'; // נעביר את ההיגיון של הניתוב המוגן לקומפוננטה נפרדת
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ExportData from './components/ExportData';
import Forms from './components/Forms';
import MigrateData from './components/MigrateData';
import Navbar from './components/Navbar';
import RegisterUser from './components/RegisterUser'; // נוסיף קומפוננטה חדשה לרישום משתמשים

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* נתיבים ציבוריים */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          
          {/* נתיבים מוגנים */}
          <Route path="/*" element={<PrivateRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;