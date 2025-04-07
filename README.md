# HighlightHub 📍

🎥 **Summarize YouTube videos and highlight key moments with AI.**

---

🧠 **Powered by HighlightHub Engine:**

- Fetches YouTube video transcripts
- Summarizes full video into clear takeaways
- Extracts eventful, highlight-worthy timestamps
- Outputs structured JSON with `{ start, duration, text }`
- (Coming Soon) Optional preview + download of video clips

HighlightHub helps you quickly turn long YouTube videos into structured insights and actionable short-form segments — ideal for content creators, editors, and learners.

---

## 💡 The Problem

Long-form videos often bury **golden moments** deep inside.  
Manually watching and scrubbing for highlights is time-consuming.

---

## ✅ The Solution

**HighlightHub** analyzes video transcripts and gives you:

- A **coherent summary** of the full video
- A set of **highlight timestamps** (e.g., funniest, most insightful, most emotional, etc.)
- Perfect for making Shorts, Reels, or just skimming valuable moments

---

## ⚙️ Features

- 🔗 Input: Paste any YouTube video link
- 🧠 AI Summary: High-level overview of what the video is about
- ⏱️ Highlight Timestamps: Detect 30–60s clip-worthy segments
- 🧾 Output: Clean structured JSON (can be used in editing tools or automated clip makers)
- 🧰 (Optional) Download-ready metadata for editors
- 📥 (Coming Soon) Export short clips directly using ffmpeg/remotion

---

## 🧱 Tech Stack

- `Next.js` + `TailwindCSS` – Frontend
- `Node.js` – Backend processing
- `youtube-transcript` – Transcript extraction
- `Groq (meta-llama/llama-4-scout-17b-16e-instruct)` or `OpenAI` – Summarization
- `ffmpeg.wasm` or `Remotion` (optional) – Clip previews

---

## 🛠️ Devlog (Build Journal)

### Day 1

- Created project structure
- Wrote first console log (`"we are so back"`)
- Drafted this README

### Day 2

- Built landing page
- Learned about lazy loading + Shimmer UI
- Built basic `/api/summarize` route
- Integrated `youtube-transcript` to fetch transcript from video
- Connected to Groq API (`meta-llama/llama-4-scout-17b-16e-instruct`) to generate a 30s teaser summary
- Added support for both user and auto transcript merging
- Faced Groq 413 error due to token limits (6K TPM) — chunking needed next

### Day 3

- Changed the entire product direction to **highlight timestamp generation**
- Full video rendering with voiceover was **too time-consuming** and **API-heavy**
- EleventLabs + OpenAI combo required subscriptions and would block free MVP
- This new direction gives faster output, better dev velocity
- Refactored API to return a list of highlight objects with `{start, duration, text}`
- Will add JSON download and optional UI to preview or edit highlights next
- Might experiment with direct ffmpeg-based clip cutting using those timestamps

---

### Final Log

- While the tool works flawlessly in local dev, YouTube blocks transcript access on production servers for many videos due to bot detection and lack of official API support.

This breaks the core functionality, so I'm pausing this direction and will pivot to something more robust tomorrow. Lesson learned: relying on scraped content from third-party platforms is risky for production apps.
