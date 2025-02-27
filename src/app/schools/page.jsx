import SchoolsList from "../../components/SchoolsList";

export default function SchoolsPage() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      {/* Using client component for data fetching */}
      <SchoolsList/>
    </main>
      );
}
  
  