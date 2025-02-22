import SchoolDetailsForm from '@/components/school/SchoolDetails'
import SchoolRatingSystem from '@/components/school/SchoolRatingSystem'
import WeightsCalculator from '@/components/school/WeightsCalculator'
import PostMappingQuestions from '@/components/school/PostMappingQuestions'
import MentoringModels from '@/components/school/MentoringModels'

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50" dir="rtl">
      <div className="container mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0064ff' }}>חלק א׳ - פרטי בית הספר</h2>
          <SchoolDetailsForm />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0064ff' }}>חלק ב׳ - מיפוי זירות ואתגרים</h2>
          <SchoolRatingSystem />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0064ff' }}>חלק ג׳ - חישוב משקולות</h2>
          <WeightsCalculator />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0064ff' }}>חלק ד׳ - שאלות לאחר המיפוי</h2>
          <PostMappingQuestions />
        </div>
        <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#0064ff' }}>חלק ה׳ - מודלי חניכה מומלצים</h2>
         <MentoringModels />
</div>

      </div>
    </main>
  )
}