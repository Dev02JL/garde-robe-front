import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import fileList from "@/data/fileList.json";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY n'est pas définie");
  }
  const formData = await req.formData();
  const files = fileList.map((clothe) => clothe.fileId);

  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${formData.get("message") as string}
            Voici les file_ids des images fournies :
            ${files.map((id, idx) => `Image ${idx + 1}: ${id}`).join("\n")}
            
            Renvoie un seul article de chaque catégorie. N'oublie pas les accessoires - manteaux si nécessaire, chaussures accessoires si présent dans la garde robe. Donne les file_id dans l'ordre de la tête aux pieds.

            Réponds UNIQUEMENT avec un objet JSON contenant un tableau "file_ids" avec les file_ids des images qui correspondent le mieux à ma demande.

            Format de réponse attendu :
            {
              "file_ids": ["file_id_1", "file_id_2", ...],
              "explanation": "Brève explication du choix"
            }`,
          },
          ...files.map((fileId: string) => ({
            type: "image" as const,
            source: {
              type: "file" as const,
              file_id: fileId,
            },
          })),
        ],
      },
    ],
    betas: ["files-api-2025-04-14"],
  });
  // const textContent = response.content.find((block) => block.type === "text");
  // if (textContent && textContent.type === "text") {
  //   try {
  //     const result = JSON.parse(textContent.text);
  //     return NextResponse.json(result);
  //   } catch (e) {
  //     // Fallback if JSON parsing fails
  //     return NextResponse.json({
  //       raw_response: textContent.text,
  //       response,
  //     });
  //   }
  // }
  const textContent = response.content.find((block) => block.type === "text");
  if (textContent && textContent.type === "text") {
    // Enlever les balises markdown ```json et ```
    const cleanedText = textContent.text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      const parsedJson = JSON.parse(cleanedText);
      return NextResponse.json(parsedJson);
    } catch (e) {
      return NextResponse.json(
        {
          error: "Erreur de parsing JSON",
          raw: cleanedText,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    {
      error: "Aucun contenu texte trouvé",
    },
    { status: 500 },
  );
  // return NextResponse.json(textContent);
}
