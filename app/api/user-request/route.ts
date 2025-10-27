import { Anthropic } from "@anthropic-ai/sdk";

export async function POST() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY n'est pas définie");
  }

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
            text: "Dis moi ce qui apparait sur cette image.",
          },
          {
            type: "image",
            source: {
              type: "file",
              file_id: "file_011CUXpQnRRRhdpVjCwzaaUK",
            },
          },
        ],
      },
    ],
    betas: ["files-api-2025-04-14"],
  });

  console.log(response);
}
