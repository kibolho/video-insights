import { FFmpeg } from '@ffmpeg/ffmpeg'

let ffmpeg: FFmpeg | null = null

export async function getFFmpeg() {
  if(ffmpeg) return ffmpeg
  ffmpeg = new FFmpeg()
  if(!ffmpeg.loaded) {
    const coreURL = `https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd/ffmpeg-core.js`;
    const wasmURL = `https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd/ffmpeg-core.wasm`;
    const workerURL = `https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd/ffmpeg-worker.js`;

    // const coreURL = `${process.env.NEXT_PUBLIC_VERCEL_URL}/ffmpeg/ffmpeg-core.js`;
    // const wasmURL = `${process.env.NEXT_PUBLIC_VERCEL_URL}/ffmpeg/ffmpeg-core.wasm`;
    // const workerURL = `${process.env.NEXT_PUBLIC_VERCEL_URL}/ffmpeg/ffmpeg-worker.js`;
    await ffmpeg.load({
      coreURL,
      wasmURL,
      workerURL
    })
  }
  return ffmpeg
}