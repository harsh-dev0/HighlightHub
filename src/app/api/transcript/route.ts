import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(req: Request) {
  try {
    const { videoId } = await req.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const mappedTranscript = transcript.map(t => ({
      text: t.text,
      start: t.offset,
      duration: t.duration,
    }));

    return NextResponse.json({ transcript: mappedTranscript });
  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch transcript' }, { status: 500 });
  }
}
