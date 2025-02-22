"use client"

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SchoolData {
  // פרטי בית ספר בסיסיים
  schoolName: string
  schoolSymbol: string
  educationStage: string
  // נתוני תלמידים
  regularStudents: string
  specialEdStudents: string
  differentialStudents: string
  // נתוני מורים
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

  const handleSave = () => {
    // שמירת הנתונים ב-localStorage
    localStorage.setItem('schoolData', JSON.stringify(formData))
    alert('הנתונים נשמרו בהצלחה!')
  }

  return (
        <div className="max-w-2xl mr-0 ml-auto p-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-right text-indigo-900">פרטי בית הספר</h2>
          <p className="text-sm text-indigo-600 text-right">אנא מלאו את כל הפרטים הנדרשים</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* פרטי בית ספר בסיסיים */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName" className="text-indigo-700">שם בית הספר</Label>
                <Input
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange(e, 'schoolName')}
                  className="border-indigo-200 focus:border-indigo-400"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolSymbol" className="text-indigo-700">סמל מוסד</Label>
                <Input
                  id="schoolSymbol"
                  value={formData.schoolSymbol}
                  onChange={(e) => handleInputChange(e, 'schoolSymbol')}
                  className="border-indigo-200 focus:border-indigo-400"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-indigo-700">שלב חינוך</Label>
                <Select
                  value={formData.educationStage}
                  onValueChange={(value) => handleSelectChange(value, 'educationStage')}
                >
                  <SelectTrigger className="border-indigo-200">
                    <SelectValue placeholder="בחר שלב חינוך" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="יסודי">יסודי</SelectItem>
                    <SelectItem value="חטיבת ביניים">חטיבת ביניים</SelectItem>
                    <SelectItem value="תיכון">תיכון</SelectItem>
                    <SelectItem value="שש שנתי">שש שנתי</SelectItem>
                  </SelectContent>
                </Select>
              </div> 00
            </div>

            {/* מספרי תלמידים */}
            <div className="pt-4">
              <Label className="text-lg font-semibold text-indigo-800 block mb-3">מספר תלמידים</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regularStudents" className="text-indigo-700">רגילים</Label>
                  <Input
                    id="regularStudents"
                    type="number"
                    value={formData.regularStudents}
                    onChange={(e) => handleInputChange(e, 'regularStudents')}
                    className="border-indigo-200 focus:border-indigo-400"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialEdStudents" className="text-indigo-700">חינוך מיוחד</Label>
                  <Input
                    id="specialEdStudents"
                    type="number"
                    value={formData.specialEdStudents}
                    onChange={(e) => handleInputChange(e, 'specialEdStudents')}
                    className="border-indigo-200 focus:border-indigo-400"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="differentialStudents" className="text-indigo-700">דיפרנציאליים</Label>
                  <Input
                    id="differentialStudents"
                    type="number"
                    value={formData.differentialStudents}
                    onChange={(e) => handleInputChange(e, 'differentialStudents')}
                    className="border-indigo-200 focus:border-indigo-400"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-indigo-200" />

          {/* מיפוי צוות המורים */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-indigo-800 text-right">מיפוי צוות המורים</h3>
            <p className="text-sm text-indigo-600 text-right">התפלגות ותק במערכת</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teachersExp1to5" className="text-indigo-700">1-5 שנים</Label>
                <Input
                  id="teachersExp1to5"
                  type="number"
                  value={formData.teachersExp1to5}
                  onChange={(e) => handleInputChange(e, 'teachersExp1to5')}
                  className="border-indigo-200 focus:border-indigo-400"
                  dir="rtl"
                  placeholder="מספר מורים"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teachersExp5to10" className="text-indigo-700">5-10 שנים</Label>
                <Input
                  id="teachersExp5to10"
                  type="number"
                  value={formData.teachersExp5to10}
                  onChange={(e) => handleInputChange(e, 'teachersExp5to10')}
                  className="border-indigo-200 focus:border-indigo-400"
                  dir="rtl"
                  placeholder="מספר מורים"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teachersExp10Plus" className="text-indigo-700">10+ שנים</Label>
                <Input
                  id="teachersExp10Plus"
                  type="number"
                  value={formData.teachersExp10Plus}
                  onChange={(e) => handleInputChange(e, 'teachersExp10Plus')}
                  className="border-indigo-200 focus:border-indigo-400"
                  dir="rtl"
                  placeholder="מספר מורים"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 text-left">
            <Button 
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              שמור נתונים
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SchoolDetailsForm