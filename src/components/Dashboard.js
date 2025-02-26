//src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrganizationData } from '../firebase/firestore';

function Dashboard() {
  const { userDetails } = useAuth();
  const [stats, setStats] = useState({
    forms: 0,
    inspections: 0,
    reports: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // טעינת נתונים סטטיסטיים מ-Firestore
    async function loadStats() {
      if (!userDetails?.organizationId) return;

      try {
        setLoading(true);
        
        // קבלת כמות הטפסים
        const formsResult = await getOrganizationData('forms', userDetails.organizationId);
        
        // קבלת כמות הפיקוחים
        const inspectionsResult = await getOrganizationData('inspections', userDetails.organizationId);
        
        // קבלת כמות הדוחות
        const reportsResult = await getOrganizationData('reports', userDetails.organizationId);
        
        setStats({
          forms: formsResult.success ? formsResult.data.length : 0,
          inspections: inspectionsResult.success ? inspectionsResult.data.length : 0,
          reports: reportsResult.success ? reportsResult.data.length : 0
        });
      } catch (error) {
        console.error("שגיאה בטעינת נתונים:", error);
        setError('שגיאה בטעינת נתונים: ' + error.message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [userDetails]);

  return (
    <div className="container mt-4" dir="rtl">
      <h2>לוח מחוונים</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">טפסים</h5>
              <p className="card-text display-4">{loading ? '...' : stats.forms}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">פיקוחים</h5>
              <p className="card-text display-4">{loading ? '...' : stats.inspections}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">דוחות</h5>
              <p className="card-text display-4">{loading ? '...' : stats.reports}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">ברוך הבא, {userDetails?.role === 'admin' ? 'מנהל' : 'מפקח'}</h5>
              <p className="card-text">
                זהו לוח המחוונים של מערכת ניהול בתי הספר. מכאן תוכל/י לצפות בסיכום הנתונים, לייצא נתונים, ולנהל טפסים.
              </p>
              <p>
                ארגון: {userDetails?.organizationId || 'לא זמין'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
