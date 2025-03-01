// src/app/export/page.js
"use client"

import React from 'react';
import ExportData from '@/components/ExportData';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const ExportPage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#0064ff' }}>ייצוא נתונים</h1>
        <Button 
          onClick={() => router.back()} 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          variant="outline"
        >
          חזרה
        </Button>
      </div>
      
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="pt-6">
          <ExportData />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportPage;