import { NextRequest, NextResponse } from 'next/server'
import { fetchTranscript } from '@/lib/getTranscript'
import Groq from 'groq-sdk'
// import { exec } from 'child_process'
// import { promisify } from 'util'

// const execPromise = promisify(exec);

// Dynamically import video processing libraries
// This prevents build errors if the libraries are not available
// let ffmpeg;
// let ytdl;
// try {
//   ffmpeg = require('fluent-ffmpeg');
//   ytdl = require('ytdl-core');
// } catch (error) {
//   console.warn('Warning: Video processing modules not available, will attempt to use system commands');
// }

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

// type TranscriptLine = {
//   text: string
//   start: number
//   duration: number
// }

type Highlight = {
  start: number
  duration: number
  text: string
  reason?: string
}

export async function POST(req: NextRequest) {
  try {
    const { videoId } = await req.json()

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId in request body' }, { status: 400 })
    }

    // // Step 1: Get transcript
    // const transcript = (await fetchTranscript(videoId)).map(t => t.text).join(' ');
    const transcriptWithTimestamps = await fetchTranscript(videoId)
    const timestampChunks = chunkTranscript(transcriptWithTimestamps, 6000)
    const events: string[] = []
    
    // Step 2: Process transcript chunks
    for(const chunk of timestampChunks){
      try {
        const chunkSummary = await groq.chat.completions.create({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'user',
              content: `You are a creative video editor who converts YouTube videos into viral short-form content for platforms like TikTok, Reels, and Shorts.
        
        Your task:
        1. Summarize the given transcript chunk.
        2. Identify the core **vibe** or **emotional tone** (e.g., funny, inspiring, dramatic, sarcastic, calming).
        3. Suggest a matching **music genre/style** (e.g., upbeat trap, emotional piano, lo-fi, cinematic, glitch).
        4. Suggest **visual editing style** (e.g., fast cuts, meme overlays, subtitles, slow zooms, pop captions).
        5. (Optional) Suggest a **hook line** to start the reel with.
        6. MOST IMPORTANT: Based on the transcript and timestamps, extract 2–4 **highlight moments** that would make great edits. These should be funny, emotional, insightful, shocking, or highly engaging.
        
        Each highlight should include:
        - start: (in seconds or ms)
        - duration: (in seconds or ms)
        - reason: (why this clip is a highlight)
        
        Transcript Chunk:
        ${JSON.stringify(chunk)}
        
        Respond in this format:
        
        Summary:  
        Vibe:  
        Music Style:  
        Visual Style:  
        Hook Line:  
        
        Highlights:  
        [
          {
            "start": 123,  
            "duration": 15,  
            "text": "Example text"
          }
        ]`
            }
          ]
        })
        events.push(chunkSummary.choices[0].message.content!)
      } catch (error) {
        console.error('Error processing chunk:', error);
        continue;
      }
    }

    // Step 3: Generate final summary
    let finalSummary;
    try {
      finalSummary = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `You are a creative video editor working on a short-form cut for TikTok/Reels/Shorts.
        
        Here's a list of highlight moments extracted from different parts of the video:
        
        ${JSON.stringify(events)}
        
        Your task:
        1. Choose the most **impactful 3–5 highlights** (funniest, most emotional, insightful, or shocking).
        2. Ensure the final selection **flows smoothly** and is within **30–60 seconds total**.
        3. Then, generate the final video summary:
           - Vibe: (2 words)
           - Music Style: (2–4 words)
           - Visual Style: (1–2 short lines)
           - Hook Line: (short, punchy opener)
        4. Return the selected highlights in this format:
        
        Final Highlights:
        [
          {
            "start": 123,  
            "duration": 15,  
            "text": "Example text",  
            "reason": "Why this is good"
          }
        ]
        
        5. Finally, write a short **summary of the full video**, highlighting its key themes, insights, or story arc. This summary should help someone understand the full context even if they only watch the short version.
        
        Make sure the selected highlights **make narrative sense together**, and the **text feels coherent** when played in sequence.`
          }
        ]
        
      })
    } catch (error) {
      console.error('Error in final summary creation:', error);
      return NextResponse.json({ error: 'Failed to generate final summary' }, { status: 500 });
    }

    const summary = finalSummary.choices[0].message.content;
    
    // Step 4: Extract meta data and highlights
    let highlights: Highlight[] = [];
    let meta = {
      vibe: '',
      musicStyle: '',
      visualStyle: '',
      hookLine: ''
    };

    const highlightsMatch = summary?.match(/Final Highlights:\s*(\[[\s\S]*?\])/);
    if (highlightsMatch) {
      try {
        highlights = JSON.parse(highlightsMatch[1]);
      } catch (e) {
        console.error('Failed to parse Final Highlights:', e);
      }
    }

    const vibeMatch = summary?.match(/Vibe:\s*(.+)/);
    const musicMatch = summary?.match(/Music Style:\s*(.+)/);
    const visualMatch = summary?.match(/Visual Style:\s*(.+)/);
    const hookMatch = summary?.match(/Hook Line:\s*(.+)/);

    if (vibeMatch) meta.vibe = vibeMatch[1].trim();
    if (musicMatch) meta.musicStyle = musicMatch[1].trim();
    if (visualMatch) meta.visualStyle = visualMatch[1].trim();
    if (hookMatch) meta.hookLine = hookMatch[1].trim();

  //   // Step 5: Process video if highlights exist
  //   let videoPath: string | null = null;
  // let videoProcessed = false;

  // try {
  //   // Create temp directory
  //   const tempDir = process.platform === 'win32' ? 'C:/tmp' : '/tmp';
  //   await mkdir(tempDir, { recursive: true });

  //   // Download video
  //   const inputVideoPath = path.join(tempDir, `input_${Date.now()}.mp4`);
  //   await downloadYouTubeVideo(videoId, inputVideoPath);

  //   // Extract clips
  //   const clipPaths: string[] = [];
  //   for (let i = 0; i < highlights.length; i++) {
  //     const { start, duration } = highlights[i];
  //     if (typeof start !== 'number' || typeof duration !== 'number') {
  //       console.warn(`Invalid start or duration for highlight ${i}:`, highlights[i]);
  //       continue;
  //     }

  //     const outputPath = path.join(tempDir, `clip_${i}_${Date.now()}.mp4`);
  //     await extractClip(inputVideoPath, outputPath, start, duration);
  //     clipPaths.push(outputPath);
  //   }

  //   // Merge clips if we have any
  //   if (clipPaths.length > 0) {
  //     const finalOutputPath = path.join(tempDir, `final_${Date.now()}.mp4`);
  //     await mergeClips(clipPaths, finalOutputPath);
  //     videoPath = finalOutputPath;
  //     videoProcessed = true;

  //     // Clean up temporary clips
  //     for (const clipPath of clipPaths) {
  //       try {
  //         fs.unlinkSync(clipPath);
  //       } catch (e) {
  //         console.warn(`Failed to delete temporary clip: ${clipPath}`);
  //       }
  //     }

  //     // Clean up input video
  //     try {
  //       fs.unlinkSync(inputVideoPath);
  //     } catch (e) {
  //       console.warn(`Failed to delete input video: ${inputVideoPath}`);
  //     }
  //   }

  // } catch (error) {
  //   console.error('Error during video processing:', error);
  // }
    
    // Step 6: Return results
    return NextResponse.json({ 
      summary,
      meta,
      highlights,
      // videoProcessed,
      // videoPath: videoProcessed ? videoPath : undefined
    });
    
  } catch (error) {
    console.error('Main process error:', error);
    {/*@ts-expect-error*/ }
    return NextResponse.json({ error: 'Failed to process request.', details: error.message }, { status: 500 });
  }
}

// function chunkText(text: string, maxChars: number): string[] {
//   const chunks: string[] = [];
//   for (let i = 0; i < text.length; i += maxChars) {
//     chunks.push(text.slice(i, i + maxChars));
//   }
//   return chunks;
// }

function chunkTranscript(lines: any, maxCharLength: number) {
  const chunks = [];
  let current = [];
  let currentLength = 0;

  for (const line of lines) {
    const lineLength = line.text.length;

    if (currentLength + lineLength > maxCharLength) {
      chunks.push([...current]);
      current = [];
      currentLength = 0;
    }

    current.push(line);
    currentLength += lineLength;
  }

  if (current.length) chunks.push(current);
  return chunks;
}

// async function downloadYouTubeVideo(videoId: string, outputPath: string): Promise<void> {
//   // First try with ytdl-core
//   if (ytdl) {
//     return new Promise((resolve, reject) => {
//       try {
//         const videoUrl = videoId.includes('://') ? videoId : `https://www.youtube.com/watch?v=${videoId}`;
//         const stream = ytdl(videoUrl, { quality: 'highestvideo' });
//         const file = fs.createWriteStream(outputPath);

//         stream.pipe(file);

//         file.on('finish', () => {
//           file.close();
//           resolve();
//         });

//         stream.on('error', (err) => {
//           console.error('ytdl stream error:', err);
//           reject(err);
//         });
        
//         file.on('error', (err) => {
//           console.error('File write error:', err);
//           reject(err);
//         });
//       } catch (error) {
//         console.error('ytdl general error:', error);
//         reject(error);
//       }
//     });
//   } 
  
//   // Fallback to yt-dlp if available on system
//   try {
//     const videoUrl = videoId.includes('://') ? videoId : `https://www.youtube.com/watch?v=${videoId}`;
//     await execPromise(`yt-dlp -f "best" "${videoUrl}" -o "${outputPath}"`);
//     return;
//   } catch (error) {
//     console.error('yt-dlp error:', error);
//     throw new Error('Failed to download video: both ytdl-core and yt-dlp failed');
//   }
// }

// async function extractClip(input: string, output: string, start: number, duration: number): Promise<void> {
//   // First try with fluent-ffmpeg
//   if (ffmpeg) {
//     return new Promise((resolve, reject) => {
//       ffmpeg(input)
//         .setStartTime(start)
//         .setDuration(duration)
//         .output(output)
//         .on('end', resolve)
//         .on('error', (err) => {
//           console.error('ffmpeg error:', err);
//           reject(err);
//         })
//         .run();
//     });
//   }
  
//   // Fallback to system ffmpeg
//   try {
//     await execPromise(`ffmpeg -i "${input}" -ss ${start} -t ${duration} -c copy "${output}"`);
//     return;
//   } catch (error) {
//     console.error('System ffmpeg error:', error);
//     throw new Error('Failed to extract clip: both fluent-ffmpeg and system ffmpeg failed');
//   }
// }

// async function mergeClips(inputs: string[], output: string): Promise<void> {
//   if (inputs.length === 0) {
//     throw new Error('No input clips to merge');
//   }
  
//   // For a single clip, just copy it
//   if (inputs.length === 1) {
//     try {
//       fs.copyFileSync(inputs[0], output);
//       return;
//     } catch (error) {
//       console.error('Error copying single clip:', error);
//       throw error;
//     }
//   }
  
//   const tempDir = process.platform === 'win32' ? 'C:/tmp' : '/tmp';
//   const fileList = path.join(tempDir, `concat_list_${Date.now()}.txt`);
  
//   // Create file list with proper escaping
//   fs.writeFileSync(fileList, inputs.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n'));
  
//   // First try with fluent-ffmpeg
//   if (ffmpeg) {
//     return new Promise((resolve, reject) => {
//       ffmpeg()
//         .input(fileList)
//         .inputOptions(['-f', 'concat', '-safe', '0'])
//         .outputOptions(['-c', 'copy'])
//         .output(output)
//         .on('end', () => {
//           try {
//             fs.unlinkSync(fileList);
//           } catch (e) {
//             console.warn('Failed to delete concat list file');
//           }
//           resolve();
//         })
//         .on('error', (err) => {
//           console.error('ffmpeg concat error:', err);
//           reject(err);
//         })
//         .run();
//     });
//   }
  
//   // Fallback to system ffmpeg
//   try {
//     await execPromise(`ffmpeg -f concat -safe 0 -i "${fileList}" -c copy "${output}"`);
//     try {
//       fs.unlinkSync(fileList);
//     } catch (e) {
//       console.warn('Failed to delete concat list file');
//     }
//     return;
//   } catch (error) {
//     console.error('System ffmpeg concat error:', error);
//     throw new Error('Failed to merge clips: both fluent-ffmpeg and system ffmpeg failed');
//   }
// }