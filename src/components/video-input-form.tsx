import { FileVideo, Upload } from "lucide-react";
import React, {
  ChangeEvent,
  FormEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

type Status =
  | "waiting"
  | "converting"
  | "transcribing"
  | "success"
  | "error";

const statusMessages = {
  converting: "Convertendo...",
  transcribing: "Transcrevendo...",
  success: "Sucesso!",
  error: "Erro!",
};

interface Props {
  onVideoUploaded: (videoId: string) => void;
}

const VideoInputForm: React.FC<Props> = ({onVideoUploaded}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("waiting");

  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    if (!files) return;
    const selectedFile = files[0];
    setVideoFile(selectedFile);
  };
  const previewURL = useMemo(() => {
    if (!videoFile) return null;
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  const convertVideoToAudio = async (video: File) => {
    console.log("Converting video to audio");
    const ffmpeg = await getFFmpeg();
    await ffmpeg.writeFile("input.mp4", await fetchFile(video));
    ffmpeg.on("progress", (progress) => {
      console.log("Convert progress: " + Math.round(progress.progress * 100));
    });
    ffmpeg.on("log", (log) => {
      console.log(log);
    });
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");
    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "output.mp3", {
      type: "audio/mpeg",
    });
    console.log("Finished converting video to audio");
    return audioFile;
  };
  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = promptInputRef.current?.value;
    if (!videoFile || !prompt) return;
    setStatus("converting");
    const audioFile = await convertVideoToAudio(videoFile);
    setStatus("transcribing");
    const data = new FormData();
    data.append("file", audioFile);
    data.append("prompt", prompt);

    const responseVideos = await api.post("/api/upload", data);
    const videoId = responseVideos.data.video.id;

    setStatus("success");
    onVideoUploaded(videoId)
  };
  return (
    <form onSubmit={handleUploadVideo} className="space-y-2">
      <label
        htmlFor="video"
        className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Selecione um video
          </>
        )}
      </label>

      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />
      <Separator />
      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          disabled={status !== "waiting"}
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no video separadas por vírgula (,)"
        />
      </div>
      <Button 
          data-success={status === "success"}
          disabled={status !== "waiting"} 
          type="submit"
          className="w-full data-[success=true]:bg-emerald-400">
        {status === "waiting" ? (
          <>
            Carregar Video <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  );
};

export default VideoInputForm;