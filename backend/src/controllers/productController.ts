import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { index } from "../config/pinecone.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const getEmbedding = async (text: string): Promise<number[]> => {
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return embeddingRes.data[0].embedding;
};

export const createProduct = async (req: any, res: Response) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    if (!name || !description || !price || !category || stock === undefined || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user || (req.user.role !== 'seller' && !req.user.isAdmin)) {
      return res.status(403).json({
        message: "Access Denied: Only sellers or admins can add products"
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      imageUrl,
      seller: req.user._id,
    });

    const savedProduct = await product.save();

    const embedding = await getEmbedding(
      `${product.name} ${product.description} ${product.category}`
    );

    await index.upsert([
      {
        id: savedProduct._id.toString(),
        values: embedding,
        metadata: {
          name: product.name,
          description: product.description,
          category: product.category,
        },
      },
    ]);

    res.status(201).json(savedProduct);

  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server Error while creating product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    const searchStr = (req.query.keyword || req.query.category || '') as string;

    let queryFilter: any = {};

    if (searchStr && searchStr !== 'All') {
      queryFilter = {
        $or: [
          { name: { $regex: searchStr, $options: 'i' } },
          { category: { $regex: searchStr, $options: 'i' } },
          { description: { $regex: searchStr, $options: 'i' } }
        ]
      };
    }

    let sortOrder: any = { createdAt: -1 };
    if (req.query.sort === 'lowest') sortOrder = { price: 1 };
    else if (req.query.sort === 'highest') sortOrder = { price: -1 };

    const count = await Product.countDocuments(queryFilter);
    const products = await Product.find(queryFilter)
      .sort(sortOrder)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize)
    });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Invalid ID format' });
  }
};

export const createProductReview = async (req: any, res: Response) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400).json({ message: 'Product already reviewed' });
      return;
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const deleteProduct = async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const updateProduct = async (req: any, res: any) => {
  const { name, price, description, imageUrl, category, stock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const isOwner = product.seller.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "You can only edit your own products" });
      }

      if (price !== undefined && Number(price) <= 0) {
        return res.status(400).json({ message: "Price must be positive" });
      }

      product.name = name || product.name;
      product.price = price !== undefined ? Number(price) : product.price;
      product.description = description || product.description;
      product.imageUrl = imageUrl || product.imageUrl;
      product.category = category || product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error while updating product" });
  }
};

export const getSuggestions = async (req: any, res: any) => {
  const keyword = req.query.keyword
    ? { name: { $regex: String(req.query.keyword), $options: "i" } }
    : {};

  const products = await Product.find(keyword).select("name").limit(6);
  res.json(products);
};

export const getSellerProducts = async (req: any, res: Response) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller products" });
  }
};

