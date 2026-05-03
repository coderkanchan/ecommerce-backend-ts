import { pipeline } from "@xenova/transformers";

let extractor: any;

export const getEmbedding = async (text: string) => {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data) as number[];
};