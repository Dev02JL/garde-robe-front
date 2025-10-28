"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export default function ImageUploadForm({ onUploaded }: { onUploaded?: (imagePath: string) => void }) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [summary, setSummary] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSummary(null);
    if (!files.length) {
      setError("Choisis au moins un fichier .jpg");
      return;
    }
    setSubmitting(true);
    try {
      let okCount = 0;
      let koCount = 0;
      for (const f of files) {
        try {
          const form = new FormData();
          form.append("image", f);
          const res = await fetch("/api/add-image", { method: "POST", body: form });
          const data = await res.json().catch(() => null);
          if (!res.ok) {
            throw new Error((data && data.error) || `HTTP ${res.status}`);
          }
          const imagePath = data?.imagePath as string | undefined;
          const fileId = data?.fileId as string | undefined;
          if (imagePath && onUploaded) onUploaded(imagePath);
          if (fileId) {
            try {
              await fetch("/api/analyze-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileId }),
              });
            } catch {}
          }
          okCount++;
        } catch {
          koCount++;
        }
      }
      const results = { okCount, koCount };
      const okCountFinal = results.okCount;
      const koCountFinal = results.koCount;
      setSummary(`${okCountFinal} ajoutée(s), ${koCountFinal} échouée(s)`);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 w-full max-w-3xl rounded-xl bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-secondary-foreground"
        />
        <Button type="submit" disabled={!files.length || submitting}>
          {submitting ? "Envoi…" : "Ajouter"}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {summary && <p className="mt-2 text-sm text-green-600">{summary}</p>}
    </form>
  );
}


