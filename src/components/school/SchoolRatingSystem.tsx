"use client"

import React, { useState, useEffect } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { zones } from '@/data/zones'

const SchoolRatingSystem = () => {
  const [ratings, setRatings] = useState<{[key: string]: number}>({})

  useEffect(() => {
    const savedRatings = localStorage.getItem('zoneRatings')
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings))
    }
  }, [])

// בתוך SchoolRatingSystem, בפונקציית handleRatingSelect
const handleRatingSelect = (zoneId: string, itemId: number, level: number) => {
  const key = `${zoneId}_${itemId}`
  const newRatings = {
    ...ratings,
    [key]: level
  }
  setRatings(newRatings)
  
  // בדיקת הנתונים שנשמרים
  console.log('Saving ratings:', newRatings)
  localStorage.setItem('zoneRatings', JSON.stringify(newRatings))
}

  const calculateZoneAverage = (zoneId: string) => {
    const zoneRatings = Object.entries(ratings)
      .filter(([key]) => key.startsWith(zoneId))
      .map(([, value]) => value)

    if (zoneRatings.length === 0) return null
    
    const average = zoneRatings.reduce((a, b) => a + b, 0) / zoneRatings.length
    return average.toFixed(2)
  }

  return (
    <div className="p-4 bg-gray-50" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">מיפוי זירות ואתגרים</h1>
      <Accordion type="single" collapsible className="space-y-2">
        {zones.map(zone => (
          <AccordionItem key={zone.id} value={zone.id}>
            <AccordionTrigger>
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
              {zone.items.map(item => (
                <div key={item.id} className="mt-2">
                  <div className="flex flex-row-reverse items-start w-full gap-2">
                    <RadioGroup 
                      onValueChange={(value: string) => 
                        handleRatingSelect(zone.id, item.id, parseInt(value))
                      }
                      className="flex gap-1" 
                    >
                      {[3, 2, 1].map((level) => (
                        <div key={level} className="flex flex-col items-center">
                          <RadioGroupItem 
                            value={level.toString()}
                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-lg font-bold
                              ${level === 3 ? 'border-green-400 data-[state=checked]:bg-green-200 text-green-600' : ''}
                              ${level === 2 ? 'border-yellow-400 data-[state=checked]:bg-yellow-200 text-yellow-600' : ''}
                              ${level === 1 ? 'border-red-400 data-[state=checked]:bg-red-200 text-red-600' : ''}
                            `}
                          >
                            {level}
                          </RadioGroupItem>
                          <span className="text-sm mt-1 text-gray-600 whitespace-nowrap">
                            {level === 3 ? 'רמה גבוהה' : level === 2 ? 'רמה בינונית' : 'רמה נמוכה'}
                          </span>
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="text-lg flex-1">{item.description}</div>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default SchoolRatingSystem