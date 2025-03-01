// src/components/Login.js
"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // שינוי לניווט של Next.js
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // שימוש ב-router של Next
  const { currentUser, login } = useAuth(); // שימוש בפונקציית login מה-context

  // אם המשתמש כבר מחובר, הפנה לדף הבית
  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // שימוש בפונקציית login מה-context
      const result = await login(email, password);
      
      if (result.success) {
        router.push('/');
      } else {
        setError('שגיאה בהתחברות: ' + result.error);
      }
    } catch (error) {
      console.error("שגיאת התחברות:", error);
      setError('שגיאה בהתחברות. נא לבדוק את הפרטים שהוזנו.');
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
              <h3 className="mb-0">התחברות למערכת</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
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
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100" 
                  disabled={loading}
                >
                  {loading ? 'מתחבר...' : 'התחברות'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;