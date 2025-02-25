// src/components/ExportData.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrganizationData } from '../firebase/firestore';
import { exportToCSV, exportToJSON } from '../firebase/exportData';

function ExportData() {
  const { userDetails } = useAuth();
  const [collections, setCollections] = useState(['forms', 'inspections', 'reports']);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!selectedCollection) {
      setError('יש לבחור סוג נתונים לייצוא');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const filters = {
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };
      
      let result;
      if (exportFormat === 'csv') {
        result = await exportToCSV(selectedCollection, userDetails.organizationId, filters);
      } else {
        result = await exportToJSON(selectedCollection, userDetails.organizationId, filters);
      }
      
      if (result.success) {
        setSuccess(`ייצוא הצליח! ${result.rowCount} רשומות יוצאו.`);
      } else {
        setError(result.error || 'שגיאה בייצוא הנתונים');
      }
    } catch (error) {
      setError('שגיאה בייצוא הנתונים: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h2>ייצוא נתונים</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="collection" className="form-label">סוג נתונים לייצוא</label>
              <select 
                id="collection" 
                className="form-select" 
                value={selectedCollection} 
                onChange={(e) => setSelectedCollection(e.target.value)}
              >
                <option value="">בחר סוג נתונים</option>
                {collections.map(coll => (
                  <option key={coll} value={coll}>
                    {coll === 'forms' ? 'טפסים' : 
                     coll === 'inspections' ? 'פיקוחים' : 
                     coll === 'reports' ? 'דוחות' : coll}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="exportFormat" className="form-label">פורמט ייצוא</label>
              <select 
                id="exportFormat" 
                className="form-select" 
                value={exportFormat} 
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="csv">CSV (אקסל)</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="startDate" className="form-label">מתאריך</label>
              <input 
                type="date" 
                id="startDate" 
                className="form-control" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="endDate" className="form-label">עד תאריך</label>
              <input 
                type="date" 
                id="endDate" 
                className="form-control" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            className="btn btn-primary" 
            onClick={handleExport} 
            disabled={loading || !selectedCollection}
          >
            {loading ? 'מייצא...' : 'ייצוא נתונים'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportData;