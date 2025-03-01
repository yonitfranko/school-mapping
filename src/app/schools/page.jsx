"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SchoolsList from "../../components/SchoolsList";

export default function SchoolsPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      // המשתמש לא מחובר - העבר לדף ההתחברות
      router.push('/login');
    } else if (!loading && currentUser) {
      // המשתמש מחובר - אפשר להציג את התוכן
      setIsAuthorized(true);
    }
  }, [currentUser, loading, router]);

  // אם עדיין בטעינה או המשתמש לא מורשה, הצג מסך טעינה
  if (loading || !isAuthorized) {
    return (
      <main className="min-h-screen p-4 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">טוען...</p>
        </div>
      </main>
    );
  }

  // אם המשתמש מורשה, הצג את הדף
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <SchoolsList />
    </main>
  );
}
  