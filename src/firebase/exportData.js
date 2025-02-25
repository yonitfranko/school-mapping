// src/firebase/exportData.js
import { getOrganizationData } from './firestore';
import { saveAs } from 'file-saver';

// ייצוא נתונים ל-CSV
export const exportToCSV = async (collectionName, organizationId, filters = {}) => {
  try {
    // קבלת הנתונים מ-Firebase
    const result = await getOrganizationData(collectionName, organizationId);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    let data = result.data;
    
    // החלת פילטרים על הנתונים אם יש
    if (filters.startDate) {
      data = data.filter(item => new Date(item.createdAt.toDate()) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      data = data.filter(item => new Date(item.createdAt.toDate()) <= new Date(filters.endDate));
    }
    
    // מפתחות שלא כדאי לייצא
    const excludeKeys = ['organizationId', 'id'];
    
    // אם אין נתונים
    if (data.length === 0) {
      return { success: false, error: "אין נתונים לייצוא" };
    }
    
    // הכנת כותרות ה-CSV - לקיחת כל המפתחות מהפריט הראשון
    const headers = Object.keys(data[0])
      .filter(key => !excludeKeys.includes(key))
      .map(key => key.replace(/,/g, ' ')); // להימנע מבעיות עם פסיקים
    
    // הכנת שורות הנתונים
    const csvRows = [];
    
    // הוספת כותרות
    csvRows.push(headers.join(','));
    
    // הוספת שורות נתונים
    for (const item of data) {
      const values = headers.map(header => {
        const value = item[header];
        
        // טיפול בערכים מיוחדים
        if (value === null || value === undefined) {
          return '';
        } else if (value instanceof Date || (value && value.toDate)) {
          // המרת תאריך ל-string
          const date = value instanceof Date ? value : value.toDate();
          return date.toLocaleDateString('he-IL');
        } else if (typeof value === 'object') {
          // המרת אובייקטים ל-JSON string
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } else if (typeof value === 'string' && value.includes(',')) {
          // טיפול בטקסט שמכיל פסיקים
          return `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      });
      
      csvRows.push(values.join(','));
    }
    
    // יצירת ה-blob והורדת הקובץ
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveAs(blob, `${collectionName}_${timestamp}.csv`);
    
    return { success: true, rowCount: data.length };
  } catch (error) {
    console.error("שגיאה בייצוא הנתונים:", error);
    return { success: false, error: error.message };
  }
};

// ייצוא נתונים ל-JSON
export const exportToJSON = async (collectionName, organizationId, filters = {}) => {
  try {
    // קבלת הנתונים מ-Firebase
    const result = await getOrganizationData(collectionName, organizationId);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    let data = result.data;
    
    // החלת פילטרים על הנתונים אם יש
    if (filters.startDate) {
      data = data.filter(item => new Date(item.createdAt.toDate()) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      data = data.filter(item => new Date(item.createdAt.toDate()) <= new Date(filters.endDate));
    }
    
    // אם אין נתונים
    if (data.length === 0) {
      return { success: false, error: "אין נתונים לייצוא" };
    }
    
    // המרת תאריכים לפורמט מתאים
    const processedData = data.map(item => {
      const newItem = { ...item };
      
      // המרת כל התאריכים ל-ISO strings
      Object.keys(newItem).forEach(key => {
        if (newItem[key] && typeof newItem[key].toDate === 'function') {
          newItem[key] = newItem[key].toDate().toISOString();
        }
      });
      
      return newItem;
    });
    
    // יצירת ה-JSON והורדת הקובץ
    const jsonString = JSON.stringify(processedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveAs(blob, `${collectionName}_${timestamp}.json`);
    
    return { success: true, rowCount: data.length };
  } catch (error) {
    console.error("שגיאה בייצוא הנתונים:", error);
    return { success: false, error: error.message };
  }
};