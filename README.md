# SnapShorts🎬

🎬 Turn long videos or scripts into viral TikToks & Reels in seconds using AI.

---

🧠 Built on the Script2Shorts engine:

- Summarize scripts/transcripts
- Generate voiceover
- Add background music
- Auto-edit visuals

A tool to turn long-form video scripts or YouTube links into short, AI-generated teaser videos with auto-edited clips, voiceover, and background music.

---

## 💡 Idea

Many creators struggle to repurpose long videos into engaging short content.  
Script2Shorts solves that by taking in a script (or transcript) and automatically creating a 30-second video summary with:

- AI summarization
- Voiceover generation
- Background music
- Auto-edited visuals (Remotion or ffmpeg.wasm)

---

## 🔧 Planned Tech Stack

- `Next.js` + `TailwindCSS`
- `Remotion` or `ffmpeg.wasm`
- `OpenAI` (for summarization)
- `ElevenLabs` (for voiceover)
- `Supabase` (for auth + storage)

---

## 🚀 Goal(s)

- Ship a working MVP by **15 April**
- Document full build journey on **YouTube and Twitter**

---

## 🛠️ Devlog (Build Journal)

### Day 1

- Created project structure
- Wrote first console log (`"we are so back"`)
- Drafted this README

### Day 2

- Made landing Page
- Learned more about lazy loading
- And also built Shimmer UI
- Night is still young buddy
- Set up basic working MVP for /api/summarize route.
- Integrated youtube-transcript to fetch video transcript from URL.
- Connected Groq API (mixtral-8x7b) to generate a 30s teaser summary script.
- Added support for user-provided transcripts and merged with fetched one.
- Faced Groq 413 error due to token limit (6K TPM) — need to chunk/trim input next.
- API tested end-to-end, UI wired to submit data and show result.
<!-- I’ll keep adding logs like this under the devlog section day-wise -->

---
