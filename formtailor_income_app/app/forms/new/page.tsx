import { requireUser } from '@/lib/auth-helpers'
import FormBuilder from '@/components/FormBuilder'

export default async function NewFormPage() {
  await requireUser()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Create a form</h1>
      <FormBuilder />
    </div>
  )
}
