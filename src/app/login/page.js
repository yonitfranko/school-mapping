// src/components/Login.js או src/app/login/page.js (תלוי במבנה הפרויקט שלך)
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/firebase/auth';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('נא למלא את כל השדות');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      const result = await loginUser(email, password);
      
      if (result.success) {
        // הפניה לדף הראשי או לרשימת בתי הספר
        router.push('/schools');
      } else {
        setError(result.error || 'שגיאה בהתחברות');
      }
    } catch (error) {
      setError('שגיאה בהתחברות: ' + error.message);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">התחברות למערכת</CardTitle>
          <p className="text-blue-100 mt-2">ברוכים הבאים למערכת ניהול בתי הספר</p>
        </CardHeader>
        
        <CardContent className="pt-6 pb-2">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4 border border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">כתובת אימייל</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="הזן כתובת אימייל"
                required
                className="w-full p-2 border rounded"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">סיסמה</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  שכחת סיסמה?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הזן סיסמה"
                required
                className="w-full p-2 border rounded"
                dir="ltr"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? 'מתחבר...' : 'התחבר'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 text-center py-4 text-gray-600">
          <p>אין לך חשבון?</p>
          <Link 
            href="/register" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            צור חשבון חדש
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;