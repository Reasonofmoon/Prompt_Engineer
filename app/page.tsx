import PromptEngineer from '@/components/prompt-engineer'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="fixed top-4 right-4 z-50">
        <Link href="/workbench" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md">
          Gemini Workbench
        </Link>
      </div>
      <PromptEngineer />
    </main>
  )
} 