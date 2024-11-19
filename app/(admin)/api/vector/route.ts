import { NextResponse } from "next/server";

import { getAllDocuments, addDocument, deleteDocument } from "@/lib/ai/pinecone";

export async function GET() {
  try {
    const documents = await getAllDocuments();
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error retrieving documents from Pinecone:", error);
    return NextResponse.json({ error: "Failed to retrieve documents from Pinecone" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, vector, metadata } = await req.json();

    if (!id || !vector || !metadata) {
      return NextResponse.json({ error: "Missing required fields: 'id', 'vector', or 'metadata'" }, { status: 400 });
    }

    await addDocument(id, vector, metadata);
    return NextResponse.json({ message: "Document added successfully" });
  } catch (error) {
    console.error("Error adding document to Pinecone:", error);
    return NextResponse.json({ error: "Failed to add document to Pinecone" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    await deleteDocument(id);
    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document from Pinecone:", error);
    return NextResponse.json({ error: "Failed to delete document from Pinecone" }, { status: 500 });
  }
}
