import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

export const convertMP4AudioToMP3Audio = async (filePath: string,outputPath:string) => new Promise((resolve, reject) => {
  console.log("Convertendo o vídeo...")
  if(!ffmpegStatic)
    throw new Error("ffmpegStatic not found");
  ffmpeg.setFfmpegPath(ffmpegStatic)
  ffmpeg()
  .input(filePath)
  .audioFrequency(16000)
  .audioChannels(1)
  .format("wav")
  .on("end", () => {
    resolve({})
  })
  .on("error", (error) => {
    console.log("Erro ao converter o vídeo", error)
    reject(error);
  })
  .save(outputPath)
})