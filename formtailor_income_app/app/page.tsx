import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Intake forms that write the first draft for you.</h1>
        <p className="text-slate-700">
          FormTailor collects structured data and generates session notes + a next-step checklist.
        </p>
        <div className="flex gap-3">
          <Link href="/signin" className="px-4 py-2 bg-black text-white rounded">Get Started</Link>
          <Link href="/demo" className="px-4 py-2 border rounded">See Demo</Link>
        </div>
      </div>
      <div className="border rounded-md p-4">
        <p className="text-sm text-slate-600">Preview</p>
        <div className="mt-2 border rounded p-4">
          <p className="font-semibold">Client Intake</p>
          <ul className="list-disc ml-6 text-sm text-slate-700">
            <li>Full Name</li>
            <li>Chief concern</li>
            <li>Goals</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
