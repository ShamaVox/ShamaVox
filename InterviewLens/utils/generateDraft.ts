type Moment = { t: number; note: string };

export function generateDraft(params: {
  candidate: string;
  company: string;
  moments: Moment[];
  tone: 'warm' | 'concise' | 'executive';
}) {
  const { candidate, company, moments, tone } = params;
  const bullets = moments.slice(0, 8).map(m => `• @${m.t}s — ${m.note}`).join('\n');
  const greeting =
    tone === 'executive' ? `Hello ${candidate},` :
    tone === 'concise' ? `Hi ${candidate},` : `Hi ${candidate},`;
  const opener =
    tone === 'executive'
      ? `Thank you for the thoughtful conversation about the ${company} role. Here are a few highlights I captured:`
      : tone === 'concise'
      ? `Great talking today. Key points I noted:`
      : `It was great speaking today—thanks for the time and insight. Here are a few highlights I captured:`;

  const close =
    tone === 'executive'
      ? `If helpful, I can follow up with a brief one-pager outlining an approach for the first 30–60 days.`
      : tone === 'concise'
      ? `Happy to send a one‑pager with next steps.`
      : `If useful, I’m happy to send a simple one‑pager on how I’d approach the first 30–60 days.`;

  const signoff =
    tone === 'executive' ? `Best regards,` : tone === 'concise' ? `Thanks,` : `Warmly,`;

  return `${greeting}

${opener}

${bullets}

${close}

${signoff}
Shama`;
}
