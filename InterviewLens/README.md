# InterviewLens (Expo + TypeScript)

**Record → Mark Key Moments → Auto‑Draft Follow‑ups.**  
A privacy‑first companion for interviews and sales calls. No backend required.

## Features
- 🎙️ Voice recording (expo‑av)
- ⏱️ One‑tap *key moments* capture with notes
- ✉️ One‑click **follow‑up drafts** (warm / concise / executive)
- 🗂️ Sessions list with duration, company, and candidate
- 📱 Works offline (AsyncStorage)

## Run Locally
```bash
npm i -g expo-cli
npm i
npm run start   # i = iOS, a = Android
```

## Files
- `app/record.tsx` – microphone recording + moment capture
- `app/sessions.tsx` – list saved sessions
- `app/session.tsx` – moments + draft generator
- `utils/generateDraft.ts` – tone‑aware follow‑up builder
- `lib/store.ts` – simple local persistence (Zustand + AsyncStorage)

## Roadmap (optional next steps)
- Cloud backup (iCloud / Google Drive)
- Real transcription (optional) via an on‑device model or API
- Share audio + transcript bundle
- Templates per scenario (recruiter, hiring manager, partner)

## Store Monetization
- **Free**: record + moments + 1 draft tone
- **Pro $2.99/mo**: multiple tones, export, custom templates

## License
MIT
