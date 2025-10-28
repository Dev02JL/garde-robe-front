"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export default function ImageUploadForm({ onUploaded }: { onUploaded?: (imagePath: string) => void }) {
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);

    if (!file) {
      setError("Choisis un fichier .jpg");
      return;
    }

    const form = new FormData();
    form.append("image", file);
    setSubmitting(true);
    
    try {
      const res = await fetch("/api/add-image", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      const data = await res.json().catch(() => null);
      const imagePath = (data && data.imagePath) || null;
      setOk(true);
      if (imagePath && onUploaded) onUploaded(imagePath);
      setFile(null);
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
          type="file"
          accept="image/jpeg,image/jpg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-secondary-foreground"
        />
        <Button type="submit" disabled={!file || submitting}>
          {submitting ? "Envoi…" : "Submit"}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {ok && <p className="mt-2 text-sm text-green-600">Vêtement ajouté.</p>}
    </form>
  );
}


