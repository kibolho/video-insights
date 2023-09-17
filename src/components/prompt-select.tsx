"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface Prompt {
  id: string;
  title: string;
  template: string;
}

interface Props {
  handlePromptSelect: (template: string) => void;
}
const PromptSelect: React.FC<Props> = (props) => {
  const { isLoading, data } = useQuery<Prompt[]>({
    queryKey: ["prompts"],
    queryFn: () => api().get("/api/prompts").then((response) => response.data),
  });

  const handlePromptSelect = (promptId: string) => {
    const selectedPrompt = data?.find((prompt) => prompt.id === promptId);
    if (!selectedPrompt) return;
    props.handlePromptSelect(selectedPrompt.template);
  };
  return (
    <Select onValueChange={handlePromptSelect}>
      <SelectTrigger>
        <SelectValue
          placeholder={
            isLoading ? "Carregando Prompts" : "Selecione um prompt..."
          }
        />
      </SelectTrigger>
      <SelectContent>
        {data?.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PromptSelect;
