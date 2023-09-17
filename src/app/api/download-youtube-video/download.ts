import ytdl from "ytdl-core"
import { createWriteStream } from "node:fs"

export const downloadYoutubeVideo = async (videoURL: string, path: string) => new Promise((resolve, reject) => {
  console.log("Iniciando download do vídeo...",videoURL,path)
  ytdl(videoURL, { quality: "lowestaudio", filter: "audioonly" })
  .on("end", () => {
    console.log("Download do vídeo finalizado.");
    resolve({})
  }).on("error", (error) => {
    console.error(
      "Não foi possível fazer o download do vídeo. Detalhes do erro:",
      error
    )
    reject()
  }).pipe(createWriteStream(path))
})