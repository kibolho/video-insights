import { api } from "@/lib/axios";

export const uploadAudio = async (audioFile: File, prompt?: string): Promise<string> => {
  const data = new FormData();
  data.append("file", audioFile);
  if(prompt)
    data.append("prompt", prompt);
  const responseVideos = await api().post("/api/upload", data);
  const videoId = responseVideos.data.video.id;
  return videoId;
}