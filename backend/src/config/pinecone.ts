import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
  throw new Error("❌ PINECONE_API_KEY missing in .env");
}

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error("❌ PINECONE_INDEX_NAME missing in .env");
}

console.log("INDEX NAME:", process.env.PINECONE_INDEX_NAME);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});


export const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);