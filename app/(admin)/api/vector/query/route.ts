import { NextResponse } from "next/server";

import { generateEmbeddings } from "@/ai/embeddings";
import { getQueryDocuments } from "@/ai/pinecone";

// use this method/route for searching the store [not yet implemented]
export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing required field: 'query'" }, { status: 400 });
    }

    const queryEmbedding = await generateEmbeddings(query);
    const queryDocuments = await getQueryDocuments(queryEmbedding)

    return NextResponse.json(queryDocuments);
  } catch (error) {
    console.error("Failed with query to retrieve documents from Pinecone:", error);
    return NextResponse.json({ error: "Failed with query to retrieve documents from Pinecone" }, { status: 500 });
  }
}
