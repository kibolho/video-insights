"use client";
import { PromptInputForm } from "@/components/prompt-input-form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import VideoInputForm from "@/components/video-input-form";
import { useAlert } from "@/contexts/alert-context";
import { useCompletion } from "ai/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);
  const { setAlert } = useAlert();
  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error: aiError,
  } = useCompletion({
    api: `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ai/complete`,
    body: {
      videoId,
      temperature,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    if (aiError)
      setAlert({ description: aiError.message ?? "Error desconhecido" });
  }, [aiError, setAlert]);

  return (
      <div className="flex flex-col flex-1">
        <main className="flex flex-1 p-6 gap-6">
          <div className="flex flex-col flex-1 gap-4">
            <div className="grid grid-row-2 gap-4 flex-1">
              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Inclua o prompt para a IA..."
                value={input}
                onChange={handleInputChange}
              />
              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Resultado gerado pela IA."
                value={completion}
                readOnly
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Lembre-se: você pode utilizar a variável{" "}
              <code className="text-violet-400">{"{transcription}"}</code> no
              seu prompt para adicionar o conteúdo da transcrição do vídeo
              selecionado.
            </p>
          </div>
          <aside className="w-80 space-y-2">
            <VideoInputForm onVideoSelected={setVideoId} videoId={videoId} />
            {videoId && (
              <>
                <Separator />
                <PromptInputForm
                  promptSubmit={handleSubmit}
                  handlePromptSelect={setInput}
                  temperature={temperature}
                  setTemperature={setTemperature}
                  isLoading={isLoading}
                />
              </>
            )}
          </aside>
        </main>
      </div>
  );
}
