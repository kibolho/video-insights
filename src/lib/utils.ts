import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string | null) {
  let initials = ""
  if(!name) return initials
  for (let i = 0; i < name.length - 2; i++){
    if (name[i] == ' ')
      initials+= name[i + 1].toUpperCase()
    if(i==0){
      initials+= name[i].toUpperCase()
    }
  }
  return initials
}

export const convertVideoToAudio = async (video: File): Promise<File> => {
  console.log("Converting video to audio");
  const ffmpeg = await getFFmpeg();
  await ffmpeg.writeFile("input.mp4", await fetchFile(video));
  ffmpeg.on("progress", (progress) => {
    console.log("Convert progress: " + Math.round(progress.progress * 100));
  });
  ffmpeg.on("log", (log) => {
    console.log(log);
  });
  const audioName = `${video.name}.mp3`;
  await ffmpeg.exec([
    "-i",
    "input.mp4",
    "-map",
    "0:a",
    "-b:a",
    "20k",
    "-acodec",
    "libmp3lame",
    audioName,
  ]);

  const data = await ffmpeg.readFile(audioName);
  const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
  const audioFile = new File([audioFileBlob], audioName, {
    type: "audio/mpeg",
  });
  console.log("Finished converting video to audio");
  return audioFile;
};