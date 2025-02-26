// src/components/PrivateRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from './Dashboard';
import ExportData from './ExportData';
import Forms from './Forms';
import MigrateData from './MigrateData';
import Navbar from './Navbar';

function PrivateRoutes() {
  const { currentUser, userDetails, loading } = useAuth();

  if (loading) {
    return <div className="container mt-5 text-center">טוען...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/export" element={<ExportData />} />
        <Route path="/forms" element={<Forms />} />
        
        {/* נתיבים למנהלים בלבד */}
        <Route path="/migrate" element={
          userDetails?.role === 'admin' ? <MigrateData /> : <Navigate to="/" />
        } />
        
        {/* ניתוב ברירת מחדל */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default PrivateRoutes;