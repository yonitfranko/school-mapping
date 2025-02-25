// src/components/MigrateData.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addData } from '../firebase/firestore';

function MigrateData() {
  const { userDetails } = useAuth();
  const [migrationStatus, setMigrationStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMigration = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      setMigrationStatus({});
      
      // רשימת המפתחות שברצונך להעביר מ-Local Storage
      const localStorageKeys = [
        // הוסף כאן את המפתחות של ה-Local Storage שלך
        'forms',
        'inspections',
        'reports'
      ];
      
      const results = {};
      
      for (const key of localStorageKeys) {
        try {
          // קבלת הנתונים מ-Local Storage
          const data = localStorage.getItem(key);
          
          if (!data) {
            results[key] = { success: false, error: "לא נמצאו נתונים" };
            continue;
          }
          
          // המרה מ-JSON string לאובייקט JavaScript
          const parsedData = JSON.parse(data);
          
          // אם מדובר במערך
          if (Array.isArray(parsedData)) {
            const migratedItems = [];
            
            for (const item of parsedData) {
              // הוספה ל-Firestore
              const result = await addData(key, item, userDetails.organizationId);
              
              if  (result.success) {
                migratedItems.push(result.id);
              }
            }
            
            results[key] = { success: true, count: migratedItems.length };
          } 
          // אם מדובר באובייקט
          else if (typeof parsedData === 'object' && parsedData !== null) {
            // הוספה ל-Firestore
            const result = await addData(key, parsedData, userDetails.organizationId);
            results[key] = result.success 
              ? { success: true, id: result.id } 
              : { success: false, error: result.error };
          } else {
            results[key] = { success: false, error: "פורמט נתונים לא תקין" };
          }
        } catch (error) {
          results[key] = { success: false, error: error.message };
        }
      }
      
      setMigrationStatus(results);
      
      // בדיקה אם כל המיגרציות הצליחו
      const allSucceeded = Object.values(results).every(result => result.success);
      if (allSucceeded) {
        setSuccess("המיגרציה הושלמה בהצלחה!");
      } else {
        setError("היו שגיאות במהלך המיגרציה. בדוק את הסטטוס לפרטים נוספים.");
      }
    } catch (error) {
      setError('שגיאה במיגרציה: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h2>העברת נתונים מאחסון מקומי ל-Firestore</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="card">
        <div className="card-body">
          <p className="mb-3">לחץ על הכפתור למטה כדי להעביר את כל הנתונים מאחסון מקומי של הדפדפן (Local Storage) אל מסד הנתונים המרוחק.</p>
          <p className="mb-3 text-warning"><strong>שים לב:</strong> פעולה זו עלולה ליצור כפילויות אם תבצע אותה יותר מפעם אחת.</p>
          
          <button 
            className="btn btn-primary" 
            onClick={handleMigration} 
            disabled={loading}
          >
            {loading ? 'מעביר נתונים...' : 'העבר נתונים'}
          </button>
          
          {Object.keys(migrationStatus).length > 0 && (
            <div className="mt-4">
              <h5>סטטוס מיגרציה:</h5>
              <ul className="list-group">
                {Object.entries(migrationStatus).map(([key, status]) => (
                  <li key={key} className={`list-group-item ${status.success ? 'list-group-item-success' : 'list-group-item-danger'}`}>
                    <strong>{key}:</strong> {status.success 
                      ? `הועבר בהצלחה (${status.count ? status.count + ' פריטים' : 'פריט אחד'})` 
                      : `שגיאה: ${status.error}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MigrateData;