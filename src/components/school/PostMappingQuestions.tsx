"use client"

import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CoreZoneStatus {
  id: string
  name: string
  avgRating: number
  level: 'נמוכה' | 'בינונית' | 'גבוהה'
}

const RenderSelect = ({
    value,
    onChange,
    options,
    placeholder
  }: {
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    name: string
    placeholder: string
  }) => {
    return (
        <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full text-right bg-white" dir="rtl">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent dir="rtl" className="bg-white z-50">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-right hover:bg-gray-100"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  
  
  // 4. הגדרת האפשרויות
  const urgencyOptions = [
    { value: "high", label: "דחיפות גבוהה - נדרש טיפול מיידי" },
    { value: "medium", label: "דחיפות בינונית - ניתן לטפל באופן מדורג" },
    { value: "low", label: "דחיפות נמוכה - ניתן לתכנן תהליך ארוך טווח" }
  ]
  
  const supportTypeOptions = [
    { value: "personal", label: "תמיכה אישית וממוקדת למורים/צוות" },
    { value: "group", label: "תמיכה קבוצתית לצוותים מקצועיים" },
    { value: "system", label: "תמיכה מערכתית לכלל ביה\"ס" },
    { value: "specific", label: "תמיכה נקודתית לפתרון בעיות ספציפיות" }
  ]
  
  const teamReadinessOptions = [
    { value: "high", label: "גבוהה - הצוות מעוניין ופתוח לשינוי" },
    { value: "medium", label: "בינונית - חלק מהצוות מוכן לשינוי" },
    { value: "low", label: "נמוכה - קיימת התנגדות לשינוי" }
  ]
  
  const availableResourcesOptions = [
    { value: "full", label: "זמן וגמישות מלאים לתהליך ארוך טווח" },
    { value: "partial", label: "משאבים חלקיים המאפשרים תהליך מדורג" },
    { value: "limited", label: "משאבים מוגבלים המחייבים התערבות ממוקדת" }
  ]

const PostMappingQuestions = () => {
  const [totalScore, setTotalScore] = useState<number>(0)
  const [autonomyLevel, setAutonomyLevel] = useState<string>("")
  const [coreZonesChallenges, setCoreZonesChallenges] = useState<CoreZoneStatus[]>([])
  const [urgencyLevel, setUrgencyLevel] = useState<string>("")
  const [supportType, setSupportType] = useState<string>("")
  const [teamReadiness, setTeamReadiness] = useState<string>("")
  const [availableResources, setAvailableResources] = useState<string>("")

  // פונקציית עזר להשגת מזהה טופס נוכחי
  const getCurrentFormId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('id');
    return formId || 'new';
  }

  const getZoneName = (id: string): string => ({
    '1': 'זירה 1: מנהיגות ותרבות בית ספרית',
    '2': 'זירה 2: צוות חינוכי',
    '3': 'זירה 3: אקלים',
    '4': 'זירה 4: תהליכי הוראה-למידה'
  }[id] || '')

  useEffect(() => {
    const formId = getCurrentFormId();
    // נסה לקרוא מהמקום החדש עם מזהה בית הספר
    const savedRatings = localStorage.getItem(`zoneRatings_${formId}`)
    // אם אין במקום החדש, נסה לקרוא מהמקום הישן
    const oldSavedRatings = !savedRatings ? localStorage.getItem('zoneRatings') : null;
    
    console.log('Loading ratings for form', formId, ':', savedRatings || oldSavedRatings)

    if (savedRatings || oldSavedRatings) {
      const ratings = JSON.parse(savedRatings || oldSavedRatings || '{}')
      
      // מיפוי הזירות
      const zoneMapping: Record<string, string> = {
        'leadership': '1',
        'staff': '2',
        'climate': '3',
        'teaching': '4',
        'community': '5',
        'parents': '6',
        'environment': '7'
      }

      // חישוב ממוצעים לכל זירה
      const zoneAverages: Record<string, number> = {}
      const zoneCounts: Record<string, number> = {}

      Object.entries(ratings).forEach(([key, value]) => {
        const zonePrefix = key.split('_')[0]
        const zoneId = zoneMapping[zonePrefix]
        
        if (zoneId) {
          zoneAverages[zoneId] = (zoneAverages[zoneId] || 0) + Number(value)
          zoneCounts[zoneId] = (zoneCounts[zoneId] || 0) + 1
        }
      })

      // חישוב ממוצעים סופיים
      const finalAverages: Record<string, number> = {}
      Object.keys(zoneAverages).forEach(zoneId => {
        finalAverages[zoneId] = zoneAverages[zoneId] / zoneCounts[zoneId]
      })

      console.log('Final averages:', finalAverages)

      // חישוב ציון כולל לזירות ליבה
      const CORE_ZONES = ["1", "2", "3", "4"]
      const coreZonesAvg = CORE_ZONES
        .map(id => finalAverages[id])
        .filter(Boolean)
        .reduce((sum, val) => sum + val, 0) / CORE_ZONES.length

      setTotalScore(coreZonesAvg)

      // קביעת רמת העצמאות
      if (coreZonesAvg >= 2.5) setAutonomyLevel("גבוהה")
      else if (coreZonesAvg >= 1.8) setAutonomyLevel("בינונית")
      else setAutonomyLevel("נמוכה")

      // איתור אתגרים בזירות ליבה
      const challengeZones: CoreZoneStatus[] = CORE_ZONES
        .map(id => ({
          id,
          name: getZoneName(id),
          avgRating: finalAverages[id],
          level: finalAverages[id] < 1.8 ? 'נמוכה' as const : 
                 finalAverages[id] < 2.5 ? 'בינונית' as const : 
                 'גבוהה' as const
        }))
        .filter(zone => zone.level === 'נמוכה' || zone.level === 'בינונית')
        .sort((a, b) => a.avgRating - b.avgRating)

      setCoreZonesChallenges(challengeZones)
    }
    
    // טעינת בחירות משתמש שמורות
   
    const savedChoices = localStorage.getItem(`postMappingQuestions_${formId}`);
    if (savedChoices) {
      try {
        const choices = JSON.parse(savedChoices);
        if (choices.urgencyLevel) setUrgencyLevel(choices.urgencyLevel);
        if (choices.supportType) setSupportType(choices.supportType);
        if (choices.teamReadiness) setTeamReadiness(choices.teamReadiness);
        if (choices.availableResources) setAvailableResources(choices.availableResources);
      } catch (e) {
        console.error("Error parsing saved choices:", e);
      }
    }
  }, [])
  
  // שמירת בחירות המשתמש
  const saveUserChoices = (field: string, value: string) => {
    const formId = getCurrentFormId();
    // טעינת נתונים קיימים
    const savedChoices = localStorage.getItem(`postMappingQuestions_${formId}`);
    const choices = savedChoices ? JSON.parse(savedChoices) : {};
    
    // עדכון השדה הרלוונטי
    choices[field] = value;
    
    // שמירה בחזרה ב-localStorage
    localStorage.setItem(`postMappingQuestions_${formId}`, JSON.stringify(choices));
    
    // שמירה גם במפתח הישן לתאימות לאחור
    localStorage.setItem('postMappingQuestions', JSON.stringify(choices));
  }
  
  // עדכון פונקציות ה-setter עם שמירה
  const updateUrgencyLevel = (value: string) => {
    setUrgencyLevel(value);
    saveUserChoices('urgencyLevel', value);
  };
  
  const updateSupportType = (value: string) => {
    setSupportType(value);
    saveUserChoices('supportType', value);
  };
  
  const updateTeamReadiness = (value: string) => {
    setTeamReadiness(value);
    saveUserChoices('teamReadiness', value);
  };
  
  const updateAvailableResources = (value: string) => {
    setAvailableResources(value);
    saveUserChoices('availableResources', value);
  };

  return (
    <div className="space-y-8 p-4" dir="rtl">
   <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">1. רמת העצמאות שזוהתה במיפוי:</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {autonomyLevel && (
            <p className="text-lg">
              <span className="font-medium">רמת עצמאות {autonomyLevel}</span>
              <span className="text-gray-600"> (ציון משוקלל כולל: {totalScore.toFixed(2)})</span>
            </p>
          )}
        </div>
      </div>

      {/* שאלה 2 */}
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">2. אתגר מרכזי באחת מזירות הליבה:</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {coreZonesChallenges.length > 0 ? (
            <div className="space-y-2">
              {coreZonesChallenges.map(zone => (
                <p key={zone.id} className="text-lg">
                  <span className="font-medium">{zone.name}</span>
                  <span className="text-gray-600">
                    : ציון {zone.avgRating.toFixed(2)} (רמה {zone.level})
                  </span>
                </p>
              ))}
            </div>
          ) : (
            <p className="text-lg">לא זוהה אתגר מרכזי בזירות הליבה</p>
          )}
        </div>
      </div>
          
      {/* שאלה 3 */}
      
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-lg font-semibold mb-4 text-right">3. רמת הדחיפות לטיפול באתגרים שזוהו:</h3>
  <RenderSelect
    value={urgencyLevel}
    onChange={updateUrgencyLevel}
    options={urgencyOptions}
    name="urgency"
    placeholder="בחר רמת דחיפות"
  />
</div>
  
      {/* חלק ב */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-right">שאלות לבירור תנאי היישום</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-lg font-semibold mb-4 text-right">1. סוג תמיכה נדרש לבית הספר:</h3>
  <RenderSelect
    value={supportType}
    onChange={updateSupportType}
    options={supportTypeOptions}
    name="support"
    placeholder="בחר סוג תמיכה"
  />
</div>

  {/* חלק ב - שאלה 2 */}
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-lg font-semibold mb-4 text-right">2. רמת המוכנות של הצוות לתהליכי שינוי:</h3>
  <RenderSelect
    value={teamReadiness}
    onChange={updateTeamReadiness}
    options={teamReadinessOptions}
    name="readiness"
    placeholder="בחר רמת מוכנות"
  />
</div>
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-lg font-semibold mb-4 text-right">3. המשאבים הזמינים לתהליך:</h3>
  <RenderSelect
    value={availableResources}
    onChange={updateAvailableResources}
    options={availableResourcesOptions}
    name="resources"
    placeholder="בחר זמינות משאבים"
  />
</div>
      </div>
    </div>
  )
}

export default PostMappingQuestions;