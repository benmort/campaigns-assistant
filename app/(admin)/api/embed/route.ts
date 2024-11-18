import { NextResponse } from "next/server";

import { extractTextFromFile, generateEmbeddings } from "@/ai/embeddings";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await extractTextFromFile(file);
    const embeddings = await generateEmbeddings(text);

    if (!embeddings) {
      return NextResponse.json({ error: "Failed to generate embeddings" }, { status: 500 });
    }

    return NextResponse.json({ embeddings, text });
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return NextResponse.json({ error: "Failed to generate embeddings" }, { status: 500 });
  }
}
