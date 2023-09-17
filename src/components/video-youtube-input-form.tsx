"use client";
import { useAlert } from "@/contexts/alert-context";
import { api } from "@/lib/axios";
import React, { useState } from "react";
import { z } from "zod";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CODES } from "@/constants";
import { handleCreateCheckoutSession } from "@/services/pay";

interface Props {
  onVideoSelected: (videoId: string | null) => void;
}

type Status = "waiting" | "transcribing" | "success" | "error";

const statusMessages = {
  transcribing: "Transcrevendo...",
  success: "Sucesso!",
  error: "Erro!",
};

const VideoYoutubeInputForm: React.FC<Props> = ({ onVideoSelected }) => {
  const [status, setStatus] = useState<Status>("waiting");
  const { setAlert } = useAlert();

  const handleUploadVideo = async (videoURL: string) => {
    try {
      setStatus("transcribing");
      const responseVideos = await api().post("/api/download-youtube-video", {
        shortsURL: videoURL,
      });
      const videoId = responseVideos.data.video.id;
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
        });
      setAlert({
        description: bodyResponse.error ?? "Erro desconhecido",
      });
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="youtubeURL">Youtube Shorts URL</Label>
      <Input
        onChange={(e) => {
          const videoURL = e.currentTarget.value;
          const regex = /https:\/\/www\.youtube\.com\/shorts\/([^\/]+)\/?/;
          const videoUrlSchema = z.string().url().regex(regex);
          const result = videoUrlSchema.safeParse(videoURL);
          console.log({ videoURL });
          if (!result.success) return setStatus("error");
          handleUploadVideo(videoURL);
        }}
        type="url"
        id="youtubeURL"
        placeholder="https://www.youtube.com/shorts/f7z0v16XbB4"
      />
      {status === "error" ? (
        <span className="text-sm text-destructive">Invalid Url</span>
      ) : (
        status !== "waiting" && <Label>{statusMessages[status]}</Label>
      )}
    </div>
  );
};

export default VideoYoutubeInputForm;
