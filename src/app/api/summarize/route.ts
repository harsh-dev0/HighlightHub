import { NextRequest, NextResponse } from 'next/server'
import { fetchTranscript } from '@/lib/getTranscript'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { videoId, transcript: userTranscript } = await req.json()

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId in request body' }, { status: 400 })
    }

    const transcript = await fetchTranscript(videoId)

    const combinedTranscript = userTranscript?.trim()
      ? `YouTube Transcript:\n${transcript}\n\nUser Provided Transcript:\n${userTranscript}`
      : transcript
      const chunks = chunkText(combinedTranscript, 6000)
      const summaries: string[] = []
      for (const chunk of chunks) {
        const chunkSummary = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: `Summarize this:\n\n${chunk}` }],
        })
      
        summaries.push(chunkSummary.choices[0].message.content!)
      }
      
      const finalSummary = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: `Now summarize all of these into one short teaser:\n\n${summaries.join('\n\n')}` }],
      })

    const summary = finalSummary.choices[0].message.content
    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Groq summarization error:', error)
    return NextResponse.json({ error: 'Failed to summarize transcript.' }, { status: 500 })
  }
}

function chunkText(text: string, maxChars: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += maxChars) {
    chunks.push(text.slice(i, i + maxChars))
  }
  return chunks
}
