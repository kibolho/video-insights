"use client";
import { useAlert } from "@/contexts/alert-context";
import { api } from "@/lib/axios";
import { convertVideoToAudio } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FileVideo, Upload } from "lucide-react";
import React, {
  ChangeEvent,
  FormEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { Divider } from "./divider";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import VideoYoutubeInputForm from "./video-youtube-input-form";
import { uploadAudio } from "@/services/upload";
import { CODES } from "@/constants";
import { handleCreateCheckoutSession } from "@/services/pay";

interface Video {
  id: string;
  name: string;
  path: string | null;
  transcription: string;
  createdUserId: string;
  createdAt: string;
  updatedAt: string;
}

type Status = "waiting" | "converting" | "transcribing" | "success" | "error";
type VideoType = "old" | "new" | "youtube";

const statusMessages = {
  converting: "Convertendo...",
  transcribing: "Transcrevendo...",
  success: "Sucesso!",
  error: "Erro!",
};

interface Props {
  onVideoSelected: (videoId: string | null) => void;
  videoId: string | null;
}

const VideoInputForm: React.FC<Props> = ({ onVideoSelected, videoId }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoType, setVideoType] = useState<VideoType | null>(null);
  const [status, setStatus] = useState<Status>("waiting");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const { setAlert } = useAlert();

  const { isLoading, data } = useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: () => api().get("/api/videos").then((response) => response.data),
  });

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    if (!files) return;
    const selectedFile = files[0];

    setVideoFile(selectedFile);
    setVideoType("new");
    setStatus("waiting");
  };
  const previewURL = useMemo(() => {
    if (!videoFile) return null;
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const prompt = promptInputRef.current?.value;
      if (!videoFile || !prompt) return;
      setStatus("converting");
      const audioFile = await convertVideoToAudio(videoFile);
      setStatus("transcribing");
      const videoId = await uploadAudio(audioFile, prompt);
      setStatus("success");
      onVideoSelected(videoId);
    } catch (error: any) {
      setStatus("waiting");
      const bodyResponse = error?.response?.data;
      if (bodyResponse.code === CODES.PRO_VERSION_REQUIRED)
        return setAlert({
          title: "Seja PRO",
          description: bodyResponse.error,
          actionLabel: "Assinar",
          onAction: handleCreateCheckoutSession,
          cancelLabel: "Agora não",
        });
      setAlert({
        description: bodyResponse.error ?? "Erro desconhecido",
      });
    }
  };
  return (
    <form onSubmit={handleUploadVideo} className="space-y-2">
      {(!videoType || videoType === "new") && (
        <>
          <label
            htmlFor="video"
            className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
          >
            {previewURL ? (
              <video
                src={previewURL}
                controls={false}
                className="pointer-events-none relative inset-0"
              />
            ) : (
              <>
                <FileVideo className="w-4 h-4" />
                Envie um video
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
        </>
      )}
      {!videoType && <Divider />}
      {(!videoType || videoType === "old") && (
        <Select
          value={!videoType || !videoId ? undefined : videoId}
          onValueChange={(id) => {
            if (!!id && id != "none") {
              setVideoType("old");
              onVideoSelected(id);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                isLoading ? "Carregando Videos" : "Selecione um video..."
              }
            />
          </SelectTrigger>
          <SelectContent>
            {!!data && data.length > 0 ? (
              data.map((video) => {
                return (
                  <SelectItem key={video.id} value={video.id}>
                    {video.name}
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem value={"none"}>Nenhum video encontrado</SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
      {!videoType && <Divider />}
      {(!videoType || videoType === "youtube") && (
        <VideoYoutubeInputForm
          onVideoSelected={(id) => {
            setVideoType("youtube");
            onVideoSelected(id);
          }}
        />
      )}
      {videoType && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setVideoType(null);
            onVideoSelected(null);
            setVideoFile(null);
          }}
        >
          Reset
        </Button>
      )}
      {videoType === "new" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="transcription_prompt">Prompt de transcrição*</Label>
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
            className="w-full data-[success=true]:bg-emerald-400"
          >
            {status === "waiting" ? (
              <>
                Carregar Video <Upload className="w-4 h-4 ml-2" />
              </>
            ) : (
              statusMessages[status]
            )}
          </Button>
        </>
      )}
    </form>
  );
};

export default VideoInputForm;
