'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const FieldSchema = z.object({
  label: z.string().min(1),
  type: z.enum(['short_text','long_text','number','select','checkbox']),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional()
})

export type Field = z.infer<typeof FieldSchema>

export default function FormBuilder() {
  const [title, setTitle] = useState('New Intake Form')
  const [fields, setFields] = useState<Field[]>([
    { label: 'Full Name', type: 'short_text', required: true },
    { label: 'Email', type: 'short_text', required: true },
  ])
  const router = useRouter()

  function addField() {
    setFields([...fields, { label: 'Notes', type: 'long_text', required: false }])
  }

  async function save() {
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, fields }),
    })
    if (!res.ok) {
      alert('Failed to save form')
      return
    }
    const { id } = await res.json()
    router.push(`/forms/${id}`)
  }

  return (
    <div className="space-y-4">
      <input
        className="w-full border p-2 rounded"
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />
      <div className="space-y-3">
        {fields.map((f, i) => (
          <div key={i} className="border rounded p-3">
            <div className="flex gap-2">
              <input className="flex-1 border p-2 rounded" value={f.label}
                onChange={e=>{
                  const v=[...fields]; v[i]={...v[i], label:e.target.value}; setFields(v)
                }} />
              <select className="border p-2 rounded" value={f.type}
                onChange={e=>{
                  const v=[...fields]; v[i]={...v[i], type:e.target.value as any}; setFields(v)
                }}>
                <option value="short_text">Short text</option>
                <option value="long_text">Long text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
                <option value="checkbox">Checkbox</option>
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={f.required}
                  onChange={e=>{
                    const v=[...fields]; v[i]={...v[i], required:e.target.checked}; setFields(v)
                  }} />
                Required
              </label>
            </div>
            {f.type === 'select' && (
              <textarea className="mt-2 w-full border p-2 rounded"
                placeholder="Enter options, one per line"
                onChange={e=>{
                  const opts = e.target.value.split('\n').map(s=>s.trim()).filter(Boolean)
                  const v=[...fields]; v[i]={...v[i], options:opts}; setFields(v)
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={addField} className="px-3 py-2 border rounded">Add Field</button>
        <button onClick={save} className="px-3 py-2 bg-black text-white rounded">Save</button>
      </div>
    </div>
  )
}
