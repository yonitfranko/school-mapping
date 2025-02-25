// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../firebase/auth';

function Navbar() {
  const { currentUser, userDetails, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error("שגיאה בהתנתקות:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary" dir="rtl">
      <div className="container">
        <Link className="navbar-brand" to="/">מערכת ניהול בתי ספר</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">בית</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/forms">טפסים</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/export">ייצוא נתונים</Link>
            </li>
            
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/migrate">מיגרציית נתונים</Link>
              </li>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              {userDetails?.email} | {userDetails?.role === 'admin' ? 'מנהל' : 'מפקח'}
            </span>
            <button className="btn btn-outline-light" onClick={handleLogout}>התנתק</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;