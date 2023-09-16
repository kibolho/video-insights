import { Wand2 } from "lucide-react";
import PromptSelect from "./prompt-select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";

interface Props {
  handlePromptSelect: (template: string) => void;
  temperature: number;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  promptSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}
export const PromptInputForm: React.FC<Props> = ({
  promptSubmit,
  handlePromptSelect,
  temperature,
  setTemperature,
  isLoading,
}) => {
  return (
    <form onSubmit={promptSubmit} className="space-y-2">
      <div className="space-y-2">
        <Label>Prompt</Label>
        <PromptSelect handlePromptSelect={handlePromptSelect} />
      </div>
      <Separator />
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Select disabled defaultValue="gpt3.5">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
          </SelectContent>
        </Select>
        <span className="block text-sm text-muted-foreground italic">
          Você poderá customizar essa opção em breve
        </span>
      </div>
      <Separator />
      <div className="space-y-4">
        <Label>Temperatura</Label>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={[temperature]}
          onValueChange={(value) => setTemperature(value[0])}
        />
        <span className="block text-sm text-muted-foreground italic leading-relaxed">
          Valores mais altos tendem a deixar o resultado mais criativo e com
          possíveis erros.
        </span>
      </div>
      <Separator />
      <Button type="submit" className="w-full" disabled={isLoading}>
        Executar
        <Wand2 className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
};
