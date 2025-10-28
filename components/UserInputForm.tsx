"use client";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send, Loader } from "lucide-react";
import { useState, FormEvent } from "react";

interface UserInputFormProps {
  onDataReceived?: (data: any) => void;
}

const UserInputForm = ({ onDataReceived }: UserInputFormProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!prompt.trim()) {
      setError("Veuillez entrer une demande avant d’envoyer.");
      return;
    }

    const form = new FormData();
    form.append("message", prompt);
    setIsSending(true);

    try {
      const res = await fetch("/api/user-request", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data?.error || `Erreur HTTP ${res.status}`);
      }

      setPrompt("");
      if (onDataReceived) {
        onDataReceived(data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue, veuillez réessayer.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex w-full items-end gap-3">
        <Textarea
          placeholder="Demandez une tenue ici..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        <Button
          type="submit"
          disabled={prompt.length <= 0 || isSending}
          className="flex cursor-pointer items-center gap-2 active:scale-95"
        >
          {isSending ? (
            <>
              Envoi
              <Loader className="animate-spin" size={20} />
            </>
          ) : (
            <>
              Envoyer
              <Send size={20} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default UserInputForm;
