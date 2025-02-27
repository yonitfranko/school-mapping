"use client"

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { addData } from '@/firebase/firestore' // וודאי שהנתיב נכון בפרויקט שלך

interface SchoolData {
  schoolName: string
  schoolSymbol: string
  educationStage: string
  regularStudents: string
  specialEdStudents: string
  differentialStudents: string
  teachersExp1to5: string
  teachersExp5to10: string
  teachersExp10Plus: string
}

const SchoolDetailsForm = () => {
  const [formData, setFormData] = useState<SchoolData>({
    schoolName: '',
    schoolSymbol: '',
    educationStage: '',
    regularStudents: '',
    specialEdStudents: '',
    differentialStudents: '',
    teachersExp1to5: '',
    teachersExp5to10: '',
    teachersExp10Plus: ''
  })
  React.useEffect(() => {
    console.log("SchoolDetailsForm initialized");
    const savedData = localStorage.getItem('schoolDetails');
    console.log("Saved school details:", savedData);
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        console.log("Parsed school details:", parsed);
        
        // עדכון הסטייט עם הנתונים שנטענו
        setFormData(prevData => ({
          ...prevData,
          schoolName: parsed.schoolName || '',
          schoolSymbol: parsed.schoolSymbol || '',
          educationStage: parsed.educationStage || '',
          regularStudents: parsed.regularStudents || '',
          specialEdStudents: parsed.specialEdStudents || '',
          differentialStudents: parsed.differentialStudents || '',
          teachersExp1to5: parsed.teachersExp1to5 || '',
          teachersExp5to10: parsed.teachersExp5to10 || '',
          teachersExp10Plus: parsed.teachersExp10Plus || ''
        }));
      } catch (e) {
        console.error("Error parsing school details:", e);
      }
    }
  }, []);

  const handleSaveForm = async () => {
    try {
      // וידוא שהשדות הנדרשים מלאים
      if (!formData.schoolName || !formData.schoolSymbol) {
        alert("אנא מלאי את שם בית הספר וסמל המוסד");
        return;
      }
      
      // העברת הנתונים לפיירבייס
      const result = await addData("forms", {
        name: formData.schoolName,
        schoolcode: formData.schoolSymbol,
        educationStage: formData.educationStage,
        students: {
          regular: formData.regularStudents,
          specialEd: formData.specialEdStudents,
          differential: formData.differentialStudents
        },
        teachers: {
          exp1to5: formData.teachersExp1to5,
          exp5to10: formData.teachersExp5to10,
          exp10Plus: formData.teachersExp10Plus
        },
        isActive: true
      }, "org1"); // שימי במקום "org1" את מזהה הארגון שאת רוצה
      
      if (result.success) {
        alert("פרטי בית הספר נשמרו בהצלחה!");
        // אפשר גם לאפס את הטופס אם רוצים
        // setFormData({ ... }); 
      } else {
        alert("שגיאה בשמירת הנתונים: " + result.error);
      }
    } catch (error) {
      console.error("שגיאה בשמירת פרטי בית הספר:", error);
      alert("שגיאה בשמירת הנתונים");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SchoolData
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSelectChange = (value: string, field: keyof SchoolData) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* פרטי בית ספר בסיסיים */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="space-y-2">
    <Label htmlFor="schoolName" className="text-base">שם בית הספר</Label>
    <Input
      id="schoolName"
      value={formData.schoolName}
      onChange={(e) => handleInputChange(e, 'schoolName')}
      className="text-right bg-white"
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="schoolSymbol" className="text-base">סמל מוסד</Label>
    <Input
      id="schoolSymbol"
      value={formData.schoolSymbol}
      onChange={(e) => handleInputChange(e, 'schoolSymbol')}
      className="text-right bg-white"
    />
  </div>

  <div className="space-y-2">
    <Label className="text-base">שלב חינוך</Label>
    <Select
      value={formData.educationStage}
      onValueChange={(value) => handleSelectChange(value, 'educationStage')}
    >
      <SelectTrigger className="text-right bg-white">
        <SelectValue placeholder="בחר שלב חינוך" />
      </SelectTrigger>
      <SelectContent className="text-right bg-white z-50">
        <SelectItem value="יסודי">יסודי</SelectItem>
        <SelectItem value="חטיבת ביניים">חטיבת ביניים</SelectItem>
        <SelectItem value="תיכון">תיכון</SelectItem>
        <SelectItem value="שש שנתי">שש שנתי</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

      <Separator className="my-8" />

      {/* מספרי תלמידים */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#0064ff' }}>מספר תלמידים</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="regularStudents" className="text-base">רגילים</Label>
            <Input
              id="regularStudents"
              type="number"
              value={formData.regularStudents}
              onChange={(e) => handleInputChange(e, 'regularStudents')}
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialEdStudents" className="text-base">חינוך מיוחד</Label>
            <Input
              id="specialEdStudents"
              type="number"
              value={formData.specialEdStudents}
              onChange={(e) => handleInputChange(e, 'specialEdStudents')}
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="differentialStudents" className="text-base">דיפרנציאליים</Label>
            <Input
              id="differentialStudents"
              type="number"
              value={formData.differentialStudents}
              onChange={(e) => handleInputChange(e, 'differentialStudents')}
              className="text-right"
            />
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* מיפוי צוות המורים */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#0064ff' }}>מיפוי צוות המורים</h3>
        <p className="text-sm text-gray-500 mb-4">התפלגות ותק במערכת</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="teachersExp1to5" className="text-base">1-5 שנים</Label>
            <Input
              id="teachersExp1to5"
              type="number"
              value={formData.teachersExp1to5}
              onChange={(e) => handleInputChange(e, 'teachersExp1to5')}
              className="text-right"
              placeholder="מספר מורים"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teachersExp5to10" className="text-base">5-10 שנים</Label>
            <Input
              id="teachersExp5to10"
              type="number"
              value={formData.teachersExp5to10}
              onChange={(e) => handleInputChange(e, 'teachersExp5to10')}
              className="text-right"
              placeholder="מספר מורים"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teachersExp10Plus" className="text-base">10+ שנים</Label>
            <Input
              id="teachersExp10Plus"
              type="number"
              value={formData.teachersExp10Plus}
              onChange={(e) => handleInputChange(e, 'teachersExp10Plus')}
              className="text-right"
              placeholder="מספר מורים"
            />
          </div>
          {/* כפתור שמירה */}
<div className="mt-8 flex justify-end">
  <button
    onClick={handleSaveForm}
    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
  >
    שמור בענן פרטי בית ספר
  </button>
</div>
        </div>
      </div>
    </div>
  )
}

export default SchoolDetailsForm