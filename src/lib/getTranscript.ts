import { YoutubeTranscript } from 'youtube-transcript';

export async function fetchTranscript(videoId: string) { 
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    return transcript.map(t => ({
        text: t.text,
        start: t.offset,
        duration: t.duration,
      }));
}

