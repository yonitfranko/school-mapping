"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface ZoneWeight {
  id: string
  name: string
  weight: number
  avgRating?: number      // ציון ממוצע לזירה
  weightedScore?: number  // ציון משוקלל (אחוז × ציון)
}

const zoneWeights: ZoneWeight[] = [
  { id: "4", name: "זירה 4: תהליכי הוראה-למידה", weight: 30 },
  { id: "2", name: "זירה 2: צוות חינוכי", weight: 20 },
  { id: "3", name: "זירה 3: למידה רגשית-חברתית", weight: 20 },
  { id: "1", name: "זירה 1: מנהיגות ותרבות בית ספרית", weight: 15 },
  { id: "6", name: "זירה 6: הורים וקהילה", weight: 7 },
  { id: "5", name: "זירה 5: חינוך חברתי קהילתי", weight: 5 },
  { id: "7", name: "זירה 7: סביבות למידה", weight: 3 }
]

const WeightsCalculator = () => {
  const [schoolName, setSchoolName] = useState<string>("")
  const [calculatedWeights, setCalculatedWeights] = useState<ZoneWeight[]>(zoneWeights)

  const calculateWeights = useCallback(() => {
    const savedRatings = localStorage.getItem('zoneRatings')
    console.log('Loading ratings:', savedRatings)
    
    if (savedRatings) {
      const loadedRatings = JSON.parse(savedRatings)
      console.log('Parsed ratings:', loadedRatings)

      // מיפוי בין המפתחות לזירות
      const zoneMapping: { [key: string]: string } = {
        'leadership': '1',    // מנהיגות
        'staff': '2',        // צוות חינוכי
        'climate': '3',      // אקלים
        'teaching': '4',     // תהליכי הוראה
        'community': '5',    // חינוך חברתי
        'parents': '6',      // הורים
        'environment': '7'   // סביבות למידה
      }

      const zoneAverages: { [key: string]: { sum: number; count: number } } = {}
      
      // איתחול אובייקט הממוצעים עם כל הזירות
      Object.values(zoneMapping).forEach(zoneId => {
        zoneAverages[zoneId] = { sum: 0, count: 0 }
      })
      
      // חישוב הסכומים והספירה לכל זירה
      Object.entries(loadedRatings).forEach(([key, value]) => {
        const zoneName = key.split('_')[0]
        const zoneId = zoneMapping[zoneName]
        
        if (zoneId && zoneAverages[zoneId]) {
          zoneAverages[zoneId].sum += Number(value)
          zoneAverages[zoneId].count++
        }
      })

      console.log('Zone averages after mapping:', zoneAverages)

      // עדכון המשקולות עם הממוצעים והציונים המשוקללים
      const updatedWeights = zoneWeights.map(zone => {
        const average = zoneAverages[zone.id]
        const avgRating = average && average.count > 0 
          ? average.sum / average.count 
          : undefined
        const weightedScore = avgRating !== undefined 
          ? (avgRating * zone.weight) / 100 
          : undefined
        return { ...zone, avgRating, weightedScore }
      })

      console.log('Updated weights:', updatedWeights)
      setCalculatedWeights(updatedWeights)
    }
  }, [])

  // טעינת שם בית הספר
  useEffect(() => {
    const savedSchoolData = localStorage.getItem('schoolData')
    if (savedSchoolData) {
      const data = JSON.parse(savedSchoolData)
      setSchoolName(data.schoolName || "")
    }
  }, [])

  // טעינה ראשונית והאזנה לשינויים
  useEffect(() => {
    calculateWeights()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'zoneRatings') {
        calculateWeights()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [calculateWeights])

  // חישוב הציון הכולל המשוקלל
  const totalWeightedScore = calculatedWeights
    .reduce((sum, zone) => sum + (zone.weightedScore || 0), 0)

  return (
    <Card className="mt-8" dir="rtl">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold">ציון משוקלל לביה"ס:</h2>
          <span className="text-2xl">{schoolName}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-right">שם הזירה</th>
                <th className="border p-2 text-center">משקל</th>
                <th className="border p-2 text-center">ציון ממוצע לזירה</th>
                <th className="border p-2 text-center">ציון משוקלל</th>
              </tr>
            </thead>
            <tbody>
              {calculatedWeights.map((zone) => (
                <tr key={zone.id} className={zone.id <= "4" ? "bg-green-50" : "bg-yellow-50"}>
                  <td className="border p-2 text-right">{zone.name}</td>
                  <td className="border p-2 text-center">{zone.weight}%</td>
                  <td className="border p-2 text-center">
                    {zone.avgRating?.toFixed(2) || "-"}
                  </td>
                  <td className="border p-2 text-center">
                    {zone.weightedScore?.toFixed(2) || "-"}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td className="border p-2 text-right">סה"כ</td>
                <td className="border p-2 text-center">100%</td>
                <td className="border p-2 text-center">-</td>
                <td className="border p-2 text-center">{totalWeightedScore.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 space-y-2">
            <p>ציון משוקלל זירות ליבה: {calculatedWeights
              .filter(zone => ["1", "2", "3", "4"].includes(zone.id))
              .reduce((sum, zone) => sum + (zone.weightedScore || 0), 0)
              .toFixed(2)}</p>
            <p>ציון משוקלל זירות תומכות: {calculatedWeights
              .filter(zone => ["5", "6", "7"].includes(zone.id))
              .reduce((sum, zone) => sum + (zone.weightedScore || 0), 0)
              .toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeightsCalculator