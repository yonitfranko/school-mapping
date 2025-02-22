"use client"

import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Type definitions for Mentoring Models
interface MentoringModel {
  id: string
  name: string
  title: string
  goal: string
  characteristics: string[]
  principles: string[]
  tools: string[]
  color: {
    background: string
    text: string
    hover: string
  }
}

// Scenario Models
const scenarioModels: Record<string, MentoringModel[]> = {
  limited: [
    {
      id: "systemic",
      name: "Systemic Mentoring",
      title: "חניכה מערכתית",
      goal: "זיהוי התרבות הארגונית שטעונה שינוי בביה״ס במסגרת הצמיחה",
      characteristics: [
        "מיקוד של שיתוף פעולה על ממוקדות הנחיה",
        "הבנה הוליסטית המתמקדת בארגון כולו",
        "הנחיה מבוססת נתונים מדידים ואגדות שיתוף",
        "התפתחות בדרכים שונות לביסוס שינוי רחב"
      ],
      principles: [
        "בניית מבנים וצוותי הנהגה מוגדרים",
        "סנכרון בין מהלכות מורים לתלמידים"
      ],
      tools: ["כלים מדידים"],
      color: {
        background: "bg-blue-50",
        text: "text-blue-800",
        hover: "hover:bg-blue-100"
      }
    },
    {
      id: "leadership",
      name: "Leadership Pipeline",
      title: "חניכת עתודה ניהולית",
      goal: "הכשרת מנהלים עתידיים תפקידי מפתח",
      characteristics: [
        "תהליכים הכרחיים להבנת עתודה ניהולית",
        "מיקוד בחוזקות והכנסת חזון"
      ],
      principles: [
        "תכנון אסטרטגי של תכנית ניהולית בארגון",
        "מיסוד תפקידי ניהולים, ליווי צמוד על ידי מנהלים",
        "פיתוח מנהיגות"
      ],
      tools: ["כלים מדידים"],
      color: {
        background: "bg-green-50",
        text: "text-green-800",
        hover: "hover:bg-green-100"
      }
    },
    {
      id: "community",
      name: "Community-Based",
      title: "חניכה מבוססת קהילות מקצועיות",
      goal: "עבודה במסגרת קהילות מקצועיות, תהליכים המבוססים על הכלים המשותפים",
      characteristics: [
        "בניות רוח בית מקצועי",
        "שיתוף ידע והזדמנויות מקצועית"
      ],
      principles: ["הזדמנות ידע מקהילתיות, תכניות חניכה קהילתיות"],
      tools: ["כלים מדידים"],
      color: {
        background: "bg-purple-50",
        text: "text-purple-800",
        hover: "hover:bg-purple-100"
      }
    }
  ],
  partial: [
    {
      id: "group",
      name: "Group Mentoring",
      title: "חניכה קבוצתית",
      goal: "הזנת עבודה צוות ושיתוף ידע חניכתי",
      characteristics: [
        "הבנית קבוצתית של נהלי עבודה וחלוקה"
      ],
      principles: [
        "עידוד רוח הצוות",
        "חיזוק תחושת הקהילה"
      ],
      tools: ["הכשרות ודיון מקצועי שיתופי"],
      color: {
        background: "bg-teal-50",
        text: "text-teal-800",
        hover: "hover:bg-teal-100"
      }
    },
    {
      id: "peer",
      name: "Peer Mentoring",
      title: "חניכת עמיתים",
      goal: "חיזוק שיתוף פעולה ולמידת עמיתים",
      characteristics: [
        "שיתוף פעולה בין מורים באופן ישיר ובניית תורכלית"
      ],
      principles: [
        "שוויונות",
        "שיתוף פעולה הדדי"
      ],
      tools: ["מפגשים קבועים, פעילויות חברתית"],
      color: {
        background: "bg-indigo-50",
        text: "text-indigo-800",
        hover: "hover:bg-indigo-100"
      }
    },
    {
      id: "project",
      name: "Project-Based",
      title: "חניכה מבוססת פרויקטים",
      goal: "חניכה משימתית לפי פרויקטים",
      characteristics: [
        "עבודה מתוקדת בפרויקטים",
        "שילוב עובדים בפרויקטים"
      ],
      principles: [
        "הנחיה תוך כדי עשייה"
      ],
      tools: ["הגדרת יעדים ברורים", "מעקב והערכה"],
      color: {
        background: "bg-amber-50",
        text: "text-amber-800",
        hover: "hover:bg-amber-100"
      }
    }
  ],
  full: [
    {
      id: "personal-mentoring",
      name: "Personal Mentoring",
      title: "חונכות אישית",
      goal: "ליווי והדרכה אישית מעמיקה",
      characteristics: [
        "התמקדות בצרכים האישיים של החונך",
        "קשר אישי וארוך טווח",
        "פיתוח מקצועי וערכי"
      ],
      principles: [
        "מתן תמיכה אישית",
        "קידום התפתחות אישית",
        "בניית מערכת יחסים מקצועית"
      ],
      tools: ["שיחות עומק", "ליווי מתמשך", "משוב אישי"],
      color: {
        background: "bg-rose-50",
        text: "text-rose-800",
        hover: "hover:bg-rose-100"
      }
    },
    {
      id: "coaching",
      name: "Coaching",
      title: "אימון",
      goal: "פיתוח מיומנויות וכישורים",
      characteristics: [
        "מיקוד בהשגת מטרות",
        "חשיפת הפוטנציאל האישי",
        "הכוונה עצמית"
      ],
      principles: [
        "העצמת יכולות אישיות",
        "מיקוד בפתרונות",
        "הנעה עצמית"
      ],
      tools: ["שאלות מכוונות", "תכנית פעולה", "הערכה מתמדת"],
      color: {
        background: "bg-sky-50",
        text: "text-sky-800",
        hover: "hover:bg-sky-100"
      }
    },
    {
      id: "micro-mentoring",
      name: "Micro Mentoring",
      title: "מיקרו-חניכה",
      goal: "התערבויות ממוקדות וקצרות טווח",
      characteristics: [
        "חניכה ממוקדת וקצרה",
        "מענה לצרכים ספציפיים",
        "גמישות זמן"
      ],
      principles: [
        "יעילות מרבית בזמן קצר",
        "התמקדות בנושאים ממוקדים"
      ],
      tools: ["מפגשים קצרים", "יעדים ברורים", "משוב מהיר"],
      color: {
        background: "bg-emerald-50",
        text: "text-emerald-800",
        hover: "hover:bg-emerald-100"
      }
    }
  ],
  emergency: [
    {
      id: "micro-mentoring",
      name: "Micro Mentoring",
      title: "מיקרו-חניכה",
      goal: "מענה מהיר מאוד בזמני חירום",
      characteristics: [
        "חניכה ממוקדת וקצרה מאוד",
        "מענה מהיר לצרכים דחופים"
      ],
      principles: [
        "הנחיה במינון מזערי",
        "יעילות בזמן קצר"
      ],
      tools: ["מפגשים קצרצרים", "פתרונות מיידיים"],
      color: {
        background: "bg-red-50",
        text: "text-red-800",
        hover: "hover:bg-red-100"
      }
    },
    {
      id: "speed-mentoring",
      name: "Speed Mentoring",
      title: "חונכות בזק",
      goal: "מענה מהיר, תמיכה קצרה ויעילה",
      characteristics: [
        "מיקוד בצרכים מהירים",
        "תהליך קצר ותכליתי"
      ],
      principles: [
        "מענה מהיר וממוקד",
        "תמיכה קצרה ויעילה"
      ],
      tools: ["מפגשים קצרים", "מטרות ברורים"],
      color: {
        background: "bg-orange-50",
        text: "text-orange-800",
        hover: "hover:bg-orange-100"
      }
    },
    {
      id: "focused-coaching",
      name: "Focused Coaching",
      title: "אימון ממוקד",
      goal: "התמקדות בנקודות ספציפיות לשיפור",
      characteristics: [
        "ליווי ממוקד בנושא מסוים",
        "פיתוח מיומנויות ספציפיות"
      ],
      principles: [
        "מיקוד בתחום ספציפי",
        "פתרון ממוקד בעיות"
      ],
      tools: ["שיחות ממוקדות", "תכנית פעולה מדויקת"],
      color: {
        background: "bg-lime-50",
        text: "text-lime-800",
        hover: "hover:bg-lime-100"
      }
    }
  ]
}

const MentoringModels = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>("")

  const scenarios = [
    { value: "limited", label: "ליווי מצומצם" },
    { value: "partial", label: "ליווי חלקי" },
    { value: "full", label: "ליווי מלא" },
    { value: "emergency", label: "מצב חירום/דחיפות" }
  ]

  return (
    <div className="space-y-8 p-4" dir="rtl">
      <h2 className="text-2xl font-bold text-right">מודלי החניכה המומלצים לפי תרחישים</h2>

      <Card className="w-full">
        <CardHeader>
          <h3 className="text-lg font-semibold">בחר תרחיש:</h3>
          <Select value={selectedScenario} onValueChange={setSelectedScenario}>
            <SelectTrigger className="w-full text-right">
              <SelectValue placeholder="בחר תרחיש" />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map((scenario) => (
                <SelectItem key={scenario.value} value={scenario.value}>
                  {scenario.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          {selectedScenario && scenarioModels[selectedScenario] && (
            <Accordion type="single" collapsible className="space-y-4">
              {scenarioModels[selectedScenario].map((model) => (
                <AccordionItem key={model.id} value={model.id}>
                  <AccordionTrigger
                    className={`text-right px-4 py-2 ${model.color.background} ${model.color.text} ${model.color.hover} transition-colors duration-300`}
                  >
                    {model.title}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4 text-right">
                    <div>
                      <h4 className="font-semibold mb-2">מטרה:</h4>
                      <p>{model.goal}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">מאפיינים:</h4>
                      <ul className="list-disc list-inside">
                        {model.characteristics.map((char, index) => (
                          <li key={index}>{char}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">עקרונות:</h4>
                      <ul className="list-disc list-inside">
                        {model.principles.map((principle, index) => (
                          <li key={index}>{principle}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      
                      <h4 className="font-semibold mb-2">כלים מרכזיים:</h4>
                      <ul className="list-disc list-inside">
                        {model.tools.map((tool, index) => (
                          <li key={index}>{tool}</li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MentoringModels
