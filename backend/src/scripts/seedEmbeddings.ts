import mongoose from "mongoose";
import dotenv from "dotenv";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { Product } from "./models/Product.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("MongoDB Connected");
};

const seedEmbeddings = async () => {
  try {
    await connectDB();

    const products = await Product.find();

    console.log(`Found ${products.length} products`);

    for (const product of products) {
      const text = `
        ${product.name}
        ${product.category}
        ${product.description}
      `;

      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });

      const vector = embeddingRes.data[0].embedding;

      await index.upsert([
        {
          id: product._id.toString(),
          values: vector,
          metadata: {
            name: product.name,
            description: product.description,
            category: product.category,
          },
        },
      ]);

      console.log(`Embedded: ${product.name}`);
    }

    console.log("✅ All products embedded successfully");
    process.exit();

  } catch (error) {
    console.error("❌ Error seeding embeddings:", error);
    process.exit(1);
  }
};

seedEmbeddings();