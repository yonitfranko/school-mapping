"use client"

import React, { useState, useEffect } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { zones } from '@/data/zones'

const SchoolRatingSystem = () => {
  const [ratings, setRatings] = useState<{[key: string]: number}>({})
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // פונקציית עזר להשגת מזהה טופס נוכחי
  const getCurrentFormId = () => {
    // ניתן להשיג את מזהה הטופס מפרמטרים בכתובת URL
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('id');
    return formId || 'new';  // 'new' כברירת מחדל אם אין מזהה
  }

  useEffect(() => {
    const formId = getCurrentFormId();
    
    // טעינת דירוגים מ-localStorage עם מזהה בית ספר
    const savedRatings = localStorage.getItem(`zoneRatings_${formId}`)
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings))
    }
    
    // טעינת מצב אקורדיון פתוח מ-localStorage (אופציונלי)
    const savedExpanded = localStorage.getItem(`expandedZones_${formId}`)
    if (savedExpanded) {
      setExpandedItems(JSON.parse(savedExpanded))
    }
  }, [])

  // טיפול בפתיחה/סגירה של אקורדיון
  const handleAccordionChange = (value: string) => {
    const formId = getCurrentFormId();
    
    // אם נלחץ על פריט שכבר פתוח, סגור אותו
    if (expandedItems.includes(value)) {
      setExpandedItems(expandedItems.filter(item => item !== value))
    } else {
      // אחרת, הוסף אותו לרשימת הפריטים הפתוחים
      setExpandedItems([...expandedItems, value])
    }
    
    // שמירת מצב האקורדיון ב-localStorage עם מזהה בית ספר
    localStorage.setItem(`expandedZones_${formId}`, JSON.stringify(
      expandedItems.includes(value) 
        ? expandedItems.filter(item => item !== value) 
        : [...expandedItems, value]
    ))
  }

  // טיפול בבחירת דירוג
  const handleRatingSelect = (zoneId: string, itemId: number, level: number) => {
    const formId = getCurrentFormId();
    const key = `${zoneId}_${itemId}`
    const newRatings = {
      ...ratings,
      [key]: level
    }
    setRatings(newRatings)
    
    // שמירת הדירוגים ב-localStorage עם מזהה בית ספר
    console.log(`Saving ratings for form ${formId}:`, newRatings)
    localStorage.setItem(`zoneRatings_${formId}`, JSON.stringify(newRatings))
    
    // עדכון גם ב-localStorage הקיים של רכיב SchoolRatingSystem לתאימות לאחור
    localStorage.setItem('ratingSystem', JSON.stringify({
      ...JSON.parse(localStorage.getItem('ratingSystem') || '{}'),
      ratings: newRatings
    }))
  }

  // חישוב ממוצע לכל זירה
  const calculateZoneAverage = (zoneId: string) => {
    const zoneRatings = Object.entries(ratings)
      .filter(([key]) => key.startsWith(zoneId))
      .map(([, value]) => value)

    if (zoneRatings.length === 0) return null
    
    const average = zoneRatings.reduce((a, b) => a + b, 0) / zoneRatings.length
    return average.toFixed(2)
  }

  // פונקציה לבדיקה אם דירוג נבחר
  const isRatingSelected = (zoneId: string, itemId: number, level: number) => {
    const key = `${zoneId}_${itemId}`
    return ratings[key] === level
  }

  return (
    <div className="p-4 bg-gray-50" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">מיפוי זירות ואתגרים</h1>
      <Accordion 
        type="multiple" 
        value={expandedItems}
        onValueChange={setExpandedItems}
        className="space-y-2"
      >
        {zones.map(zone => (
          <AccordionItem key={zone.id} value={zone.id}>
            <AccordionTrigger onClick={() => handleAccordionChange(zone.id)}>
              <div className="flex justify-between items-center w-full">
                <span className="text-xl font-semibold">{zone.title}</span>
                {calculateZoneAverage(zone.id) && (
                  <span className="text-lg font-medium mr-4">
                    ממוצע: {calculateZoneAverage(zone.id)}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {zone.items.map(item => {
                const key = `${zone.id}_${item.id}`;
                const selectedValue = ratings[key]?.toString() || "";
                
                return (
                  <div key={item.id} className="mt-2">
                    <div className="flex flex-row-reverse items-start w-full gap-2">
                      <RadioGroup 
                        value={selectedValue}
                        onValueChange={(value: string) => 
                          handleRatingSelect(zone.id, item.id, parseInt(value))
                        }
                        className="flex gap-1" 
                      >
                        {[3, 2, 1].map((level) => {
                          const isSelected = isRatingSelected(zone.id, item.id, level);
                          return (
                            <div key={level} className="flex flex-col items-center">
                              <RadioGroupItem 
                                value={level.toString()}
                                id={`${zone.id}_${item.id}_${level}`}
                                checked={isSelected}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-lg font-bold
                                  ${level === 3 ? 'border-green-400 text-green-600' : ''}
                                  ${level === 2 ? 'border-yellow-400 text-yellow-600' : ''}
                                  ${level === 1 ? 'border-red-400 text-red-600' : ''}
                                  ${isSelected && level === 3 ? 'bg-green-200' : ''}
                                  ${isSelected && level === 2 ? 'bg-yellow-200' : ''}
                                  ${isSelected && level === 1 ? 'bg-red-200' : ''}
                                `}
                              >
                                {level}
                              </RadioGroupItem>
                              <span className="text-sm mt-1 text-gray-600 whitespace-nowrap">
                                {level === 3 ? 'רמה גבוהה' : level === 2 ? 'רמה בינונית' : 'רמה נמוכה'}
                              </span>
                            </div>
                          );
                        })}
                      </RadioGroup>
                      <div className="text-lg flex-1">{item.description}</div>
                    </div>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default SchoolRatingSystem