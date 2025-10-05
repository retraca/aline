import { FLAGS } from '@/lib/flags'

export default function PublicSharePage() {
  if (!FLAGS.CLOUD_SYNC) return null
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Public Share (Coming Soon)</h1>
      <p className="text-neutral-400">This view will be available when cloud sync is enabled.</p>
    </main>
  )
}


