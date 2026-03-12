import { useState, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useScribe } from "@elevenlabs/react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const VoiceInputButton = ({ onTranscript, disabled }: VoiceInputButtonProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    commitStrategy: "vad",
    onCommittedTranscript: (data) => {
      if (data.text?.trim()) {
        onTranscript(data.text.trim());
      }
    },
  });

  const handleToggle = useCallback(async () => {
    if (scribe.isConnected) {
      scribe.disconnect();
      return;
    }

    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("elevenlabs-scribe-token");

      if (error || !data?.token) {
        throw new Error("Failed to get transcription token");
      }

      await scribe.connect({
        token: data.token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
    } catch (err) {
      console.error("Voice input error:", err);
      toast({ title: "Error", description: "Failed to start voice input.", variant: "destructive" });
    } finally {
      setIsConnecting(false);
    }
  }, [scribe]);

  const isActive = scribe.isConnected;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled || isConnecting}
      className={`p-2.5 rounded-lg border transition-all ${
        isActive
          ? "bg-primary/10 border-primary/40 text-primary animate-pulse"
          : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
      } disabled:opacity-50`}
      title={isActive ? "Stop listening" : "Speak your idea"}
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isActive ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
};

export default VoiceInputButton;
