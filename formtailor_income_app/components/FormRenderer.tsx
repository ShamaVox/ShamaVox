'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Field = {
  label: string
  type: 'short_text'|'long_text'|'number'|'select'|'checkbox'
  required?: boolean
  options?: string[]
}

export default function FormRenderer({ formId, title, fields }:{ formId: string, title: string, fields: Field[] }) {
  const [values, setValues] = useState<Record<string, any>>({})
  const router = useRouter()

  async function submit() {
    const res = await fetch(`/api/forms/${formId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values })
    })
    if (!res.ok) {
      alert('Failed to submit')
      return
    }
    router.refresh()
    alert('Submitted — thank you!')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {fields.map((f, i) => (
        <div key={i} className="space-y-1">
          <label className="block text-sm font-medium">{f.label}{f.required ? ' *' : ''}</label>
          {f.type === 'short_text' && (
            <input className="w-full border p-2 rounded"
              onChange={e=>setValues(v=>({ ...v, [f.label]: e.target.value }))}
            />
          )}
          {f.type === 'long_text' && (
            <textarea className="w-full border p-2 rounded"
              onChange={e=>setValues(v=>({ ...v, [f.label]: e.target.value }))}
            />
          )}
          {f.type === 'number' && (
            <input type="number" className="w-full border p-2 rounded"
              onChange={e=>setValues(v=>({ ...v, [f.label]: Number(e.target.value) }))}
            />
          )}
          {f.type === 'select' && (
            <select className="w-full border p-2 rounded"
              onChange={e=>setValues(v=>({ ...v, [f.label]: e.target.value }))}>
              <option value="">Select...</option>
              {(f.options||[]).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {f.type === 'checkbox' && (
            <input type="checkbox"
              onChange={e=>setValues(v=>({ ...v, [f.label]: e.target.checked }))}
            />
          )}
        </div>
      ))}
      <button onClick={submit} className="px-4 py-2 bg-black text-white rounded">Submit</button>
    </div>
  )
}
