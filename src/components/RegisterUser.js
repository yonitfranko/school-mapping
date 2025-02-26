// src/components/RegisterUser.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function RegisterUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('supervisor'); // ברירת מחדל: מפקח
  const [organizationId, setOrganizationId] = useState('org1'); // ברירת מחדל: ארגון 1
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser, userDetails } = useAuth();

  // בדוק אם המשתמש מחובר ומנהל
  useEffect(() => {
    // אם משתמש לא מחובר, הפנה להתחברות
    if (!loading && !currentUser) {
      navigate('/login');
      return;
    }
    
    // אם משתמש מחובר אבל לא מנהל, הפנה לדף הבית
    if (!loading && currentUser && userDetails && userDetails.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, userDetails, loading, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    // בדיקות תקינות
    if (password !== confirmPassword) {
      return setError('הסיסמאות אינן תואמות');
    }
    
    if (password.length < 6) {
      return setError('הסיסמה חייבת להכיל לפחות 6 תווים');
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      // יצירת משתמש ב-Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // שמירת פרטי המשתמש ב-Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        role: role,
        organizationId: organizationId,
        createdAt: new Date()
      });
      
      setSuccess('המשתמש נוצר בהצלחה!');
      
      // איפוס הטופס
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      console.error("שגיאה ברישום משתמש:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('כתובת האימייל כבר קיימת במערכת');
      } else {
        setError('שגיאה ברישום המשתמש: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-5" dir="rtl">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">רישום משתמש חדש</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">דואר אלקטרוני</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">סיסמה</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">אימות סיסמה</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">תפקיד</label>
                  <select
                    id="role"
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="supervisor">מפקח</option>
                    <option value="admin">מנהל</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="organizationId" className="form-label">מזהה ארגון</label>
                  <input
                    type="text"
                    id="organizationId"
                    className="form-control"
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100" 
                  disabled={loading}
                >
                  {loading ? 'מבצע רישום...' : 'רישום משתמש'}
                </button>
                
                <div className="mt-3 text-center">
                  <button 
                    type="button" 
                    className="btn btn-link" 
                    onClick={() => navigate(-1)}
                  >
                    חזרה
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;