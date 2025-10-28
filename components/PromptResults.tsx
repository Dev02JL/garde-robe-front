"use client";
import { useState } from "react";
import UserInputForm from "./UserInputForm";
import fileList from "@/data/fileList.json";
import Image from "next/image";

interface ApiResponse {
  file_ids: string[];
  explanation: string;
}

const PromptResults = () => {
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string>("");

  const handleDataFromChild = (data: ApiResponse) => {
    const paths = data.file_ids
      .map((fileId) => {
        const file = fileList.find((f) => f.fileId === fileId);
        return file?.imagePath;
      })
      .filter((path): path is string => path !== undefined);

    setImagePaths(paths);
    setExplanation(data.explanation);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <UserInputForm onDataReceived={handleDataFromChild} />
      {explanation && <p className="w-full max-w-4xl">{explanation}</p>}
      {imagePaths.length > 0 && (
        <>
          <div className="w-full max-w-4xl space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {imagePaths.map((path, index) => (
                <div
                  key={path}
                  className="relative aspect-square overflow-hidden rounded-lg border"
                >
                  <Image
                    src={path}
                    alt={`Vêtement ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PromptResults;
