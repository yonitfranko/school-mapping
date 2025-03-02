// src/firebase/exportData.js
import { getOrganizationData } from '@/firebase/firestore';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// ייצוא נתונים ל-CSV/Excel
export const exportToCSV = async (collectionName, organizationId, filters = {}, schoolId = null) => {
  try {
    // קבלת הנתונים מ-Firebase
    const result = await getOrganizationData(collectionName, organizationId);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    let data = result.data;
    
    // אם סופק מזהה בית ספר ספציפי, סנן רק אותו
    if (schoolId) {
      data = data.filter(item => item.id === schoolId);
    }
    
    // החלת פילטרים על הנתונים אם יש
    if (filters.startDate) {
      data = data.filter(item => {
        const itemDate = item.createdAt || item.updatedAt;
        return itemDate && new Date(itemDate.toDate()) >= new Date(filters.startDate);
      });
    }
    
    if (filters.endDate) {
      data = data.filter(item => {
        const itemDate = item.createdAt || item.updatedAt;
        return itemDate && new Date(itemDate.toDate()) <= new Date(filters.endDate);
      });
    }
    
    // אם אין נתונים
    if (data.length === 0) {
      return { success: false, error: "אין נתונים לייצוא" };
    }
    
    // עיבוד הנתונים לפורמט שטוח ומובנה
    const processedData = processDataForExport(data, collectionName);
    
    // יצירת גיליון אקסל
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    
    // הגדרת כותרת הגיליון
    XLSX.utils.book_append_sheet(workbook, worksheet, getHebrewName(collectionName));
    
    // הגדרת כיוון טקסט (RTL)
    worksheet['!dir'] = 'rtl';
    
    // התאמת רוחב עמודות
    const maxWidth = 25;
    const columns = Object.keys(processedData[0]).map(key => ({ wch: Math.min(key.length + 2, maxWidth) }));
    worksheet['!cols'] = columns;
    
    // שמירת הקובץ
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${getHebrewName(collectionName)}_${timestamp}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    return { success: true, rowCount: data.length, fileName };
  } catch (error) {
    console.error("שגיאה בייצוא הנתונים:", error);
    return { success: false, error: error.message };
  }
};

// ייצוא נתונים ל-JSON
export const exportToJSON = async (collectionName, organizationId, filters = {}, schoolId = null) => {
  try {
    // קבלת הנתונים מ-Firebase
    const result = await getOrganizationData(collectionName, organizationId);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    let data = result.data;
    
    // אם סופק מזהה בית ספר ספציפי, סנן רק אותו
    if (schoolId) {
      data = data.filter(item => item.id === schoolId);
    }
    
    // החלת פילטרים על הנתונים אם יש
    if (filters.startDate) {
      data = data.filter(item => {
        const itemDate = item.createdAt || item.updatedAt;
        return itemDate && new Date(itemDate.toDate()) >= new Date(filters.startDate);
      });
    }
    
    if (filters.endDate) {
      data = data.filter(item => {
        const itemDate = item.createdAt || item.updatedAt;
        return itemDate && new Date(itemDate.toDate()) <= new Date(filters.endDate);
      });
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

// פונקציית עיבוד הנתונים לפורמט שטוח לייצוא
function processDataForExport(data, collectionName) {
  // מעבד את הנתונים לפורמט שטוח יותר עבור אקסל
  return data.map(doc => {
    // בסיס הנתונים המעובדים - שדות שטוחים בלבד
    const processedData = {
      'מזהה': doc.id,
      'שם בית הספר': doc.name || doc.schoolDetails?.schoolName || '',
      'סמל מוסד': doc.schoolcode || doc.schoolDetails?.schoolCode || '',
      'ארגון': doc.organizationId || '',
      'תאריך עדכון': formatDate(doc.updatedAt),
      'פעיל': doc.isActive ? 'כן' : 'לא'
    };
    
    // הוספת סיכומי מיפוי זירות אם קיימים
    if (doc.ratingSystem && doc.ratingSystem.ratings) {
      // מיפוי הזירות
      const zoneNames = {
        'leadership': 'מנהיגות',
        'staff': 'צוות חינוכי',
        'climate': 'אקלים',
        'teaching': 'תהליכי הוראה',
        'community': 'חינוך חברתי',
        'parents': 'הורים',
        'environment': 'סביבות למידה'
      };
      
      // חישוב ממוצע לכל זירה
      const zoneAverages = {};
      const zoneCounts = {};
      
      Object.entries(doc.ratingSystem.ratings).forEach(([key, value]) => {
        const zonePrefix = key.split('_')[0];
        if (zoneNames[zonePrefix]) {
          zoneAverages[zonePrefix] = (zoneAverages[zonePrefix] || 0) + Number(value);
          zoneCounts[zonePrefix] = (zoneCounts[zonePrefix] || 0) + 1;
        }
      });
      
      // הוספת ממוצעים לנתונים המעובדים
      Object.keys(zoneAverages).forEach(zoneKey => {
        const avg = zoneAverages[zoneKey] / zoneCounts[zoneKey];
        processedData[`ממוצע ${zoneNames[zoneKey]}`] = avg.toFixed(2);
      });
      
      // חישוב ממוצע כללי וקביעת רמת עצמאות
      const coreZones = ['leadership', 'staff', 'climate', 'teaching'];
      const coreValues = coreZones
        .map(zone => zoneAverages[zone] && zoneCounts[zone] ? zoneAverages[zone] / zoneCounts[zone] : null)
        .filter(val => val !== null);
      
      if (coreValues.length > 0) {
        const coreAvg = coreValues.reduce((sum, val) => sum + val, 0) / coreValues.length;
        processedData['ממוצע זירות ליבה'] = coreAvg.toFixed(2);
        
        // קביעת רמת עצמאות
        if (coreAvg >= 2.5) {
          processedData['רמת עצמאות'] = 'גבוהה';
        } else if (coreAvg >= 1.8) {
          processedData['רמת עצמאות'] = 'בינונית';
        } else {
          processedData['רמת עצמאות'] = 'נמוכה';
        }
        
        // זיהוי אתגרים מרכזיים
        const challenges = coreZones
          .filter(zone => zoneAverages[zone] && zoneCounts[zone] && (zoneAverages[zone] / zoneCounts[zone]) < 2.5)
          .map(zone => `${zoneNames[zone]}: ${(zoneAverages[zone] / zoneCounts[zone]).toFixed(2)}`);
        
        if (challenges.length > 0) {
          processedData['אתגרים מרכזיים'] = challenges.join(', ');
        }
      }
    }
    
    // הוספת נתונים מ-PostMappingQuestions אם קיימים
    if (doc.postMappingQuestions) {
      const pmq = doc.postMappingQuestions;
      if (pmq.urgencyLevel) {
        processedData['רמת דחיפות'] = getUrgencyLabel(pmq.urgencyLevel);
      }
      if (pmq.supportType) {
        processedData['סוג תמיכה נדרש'] = getSupportTypeLabel(pmq.supportType);
      }
      if (pmq.teamReadiness) {
        processedData['מוכנות הצוות'] = getReadinessLabel(pmq.teamReadiness);
      }
      if (pmq.availableResources) {
        processedData['משאבים זמינים'] = getResourcesLabel(pmq.availableResources);
      }
    }
    
    // הוספת מודל חניכה שנבחר אם קיים
    if (doc.selectedModels && doc.selectedModels.length > 0) {
      processedData['מודל חניכה'] = doc.selectedModels.join(', ');
    }
    
    // הוספת סיבות לבחירה אם קיימות
    if (doc.finalDecision && doc.finalDecision.reasonsForChoice) {
      processedData['סיבות לבחירת המודל'] = doc.finalDecision.reasonsForChoice;
    }
    
    // הוספת תנאים ליישום אם קיימים
    if (doc.finalDecision && doc.finalDecision.implementationRequirements) {
      processedData['תנאים ליישום'] = doc.finalDecision.implementationRequirements;
    }
    
    // הוספת נתוני מעקב ובקרה
    if (doc.trackingForm) {
      const tracking = doc.trackingForm;
      
      // פגישות ותיעוד
      if (tracking.meetings && Array.isArray(tracking.meetings)) {
        processedData['מספר פגישות'] = tracking.meetings.length || 0;
        
        // הוסף פירוט פגישות (עד 3 פגישות אחרונות)
        const recentMeetings = [...tracking.meetings].sort((a, b) => {
          const dateA = a.date && a.date.toDate ? a.date.toDate() : new Date(a.date || 0);
          const dateB = b.date && b.date.toDate ? b.date.toDate() : new Date(b.date || 0);
          return dateB - dateA; // סדר יורד
        }).slice(0, 3);
        
        recentMeetings.forEach((meeting, idx) => {
          processedData[`פגישה ${idx+1} - תאריך`] = formatDate(meeting.date);
          processedData[`פגישה ${idx+1} - נושא`] = meeting.topic || '';
          processedData[`פגישה ${idx+1} - סיכום`] = meeting.summary || '';
        });
      }
      
      // יעדים והתקדמות
      if (tracking.goals && Array.isArray(tracking.goals)) {
        processedData['מספר יעדים'] = tracking.goals.length || 0;
        
        // חישוב אחוז התקדמות כללי
        if (tracking.goals.length > 0) {
          const progress = tracking.goals
            .map(goal => goal.progress || 0)
            .reduce((sum, val) => sum + val, 0) / tracking.goals.length;
          
          processedData['אחוז התקדמות כללי'] = `${Math.round(progress)}%`;
        }
        
        // הוסף פירוט יעדים (עד 3 יעדים)
        const mainGoals = tracking.goals.slice(0, 3);
        mainGoals.forEach((goal, idx) => {
          processedData[`יעד ${idx+1}`] = goal.description || '';
          processedData[`יעד ${idx+1} - התקדמות`] = `${goal.progress || 0}%`;
          processedData[`יעד ${idx+1} - סטטוס`] = goal.status || '';
        });
      }
      
      // הוסף הערות כלליות
      if (tracking.notes) {
        processedData['הערות מעקב'] = tracking.notes;
      }
    }
    
    return processedData;
  });
}

// פונקציות עזר להמרת קודים לתוויות בעברית
function getUrgencyLabel(code) {
  const labels = {
    'high': 'דחיפות גבוהה - נדרש טיפול מיידי',
    'medium': 'דחיפות בינונית - ניתן לטפל באופן מדורג',
    'low': 'דחיפות נמוכה - ניתן לתכנן תהליך ארוך טווח'
  };
  return labels[code] || code;
}

function getSupportTypeLabel(code) {
  const labels = {
    'personal': 'תמיכה אישית וממוקדת למורים/צוות',
    'group': 'תמיכה קבוצתית לצוותים מקצועיים',
    'system': 'תמיכה מערכתית לכלל ביה"ס',
    'specific': 'תמיכה נקודתית לפתרון בעיות ספציפיות'
  };
  return labels[code] || code;
}

function getReadinessLabel(code) {
  const labels = {
    'high': 'גבוהה - הצוות מעוניין ופתוח לשינוי',
    'medium': 'בינונית - חלק מהצוות מוכן לשינוי',
    'low': 'נמוכה - קיימת התנגדות לשינוי'
  };
  return labels[code] || code;
}

function getResourcesLabel(code) {
  const labels = {
    'full': 'זמן וגמישות מלאים לתהליך ארוך טווח',
    'partial': 'משאבים חלקיים המאפשרים תהליך מדורג',
    'limited': 'משאבים מוגבלים המחייבים התערבות ממוקדת'
  };
  return labels[code] || code;
}

// פונקציית עזר לפורמוט תאריכים
function formatDate(dateValue) {
  try {
    if (dateValue && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString('he-IL');
    } else if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString('he-IL');
    } else if (dateValue) {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('he-IL');
      }
    }
    return ''; // אם אין תאריך תקין
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
}

// פונקציית עזר לתרגום שם האוסף לעברית
function getHebrewName(collectionName) {
  const names = {
    'forms': 'בתי_ספר',
    'inspections': 'פיקוחים',
    'reports': 'דוחות'
  };
  return names[collectionName] || collectionName;
}