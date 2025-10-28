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
            

            Règles strictes :
            1. Tu ne traites que des demandes de tenue.
            2. Une tenue doit avoir **au moins un haut et un bas**, sauf si une **robe** est sélectionnée, auquel cas elle remplace à la fois le haut et le bas.
            3. Les manteaux ne remplacent pas le haut, le bas ou la robe.
            4. **Sélectionne un seul article par catégorie** : couvre-chef, robe, haut, bas, manteau, chaussures, accessoires.
            5. Pas de doublons dans une catégorie.
            6. Les articles doivent être listés **de la tête aux pieds**.
            7. Si une robe est choisie, ne sélectionne **ni haut ni bas**.
            8. Le nombre de file_id doit correspondre exactement au nombre d'articles cités dans l'explication dans la réponse.


            Réponds UNIQUEMENT avec un objet JSON contenant un tableau "file_ids" avec les file_ids des images qui correspondent le mieux à ma demande.

            Format de réponse attendu :
            {
              "file_ids": ["file_id_1", "file_id_2", ...],
              "explanation": "Très brève explication du choix"
            } 
              Voici l'inventaire complet de la garde-robe au format JSON :

            \`\`\`json
            ${JSON.stringify(fileList, null, 2)}
            \`\`\`
            `,
          },
        ],
      },
    ],
    betas: ["files-api-2025-04-14"],
  });

  const textContent = response.content.find((block) => block.type === "text");
  if (textContent && textContent.type === "text") {
    // Suppression des balises markdown ```json et ```
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
}
