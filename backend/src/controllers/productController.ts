import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { index } from "../config/pinecone.js";
import { getEmbedding } from "../utils/embedding.js";

export const createProduct = async (req: any, res: Response) => {
  try {
    const { name, description, price, category, subCategory, stock, imageUrl } = req.body;

    if (!name || !description || !price || !category || stock === undefined || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user || (req.user.role !== 'seller' && !req.user.isAdmin)) {
      return res.status(403).json({ message: "Access Denied: Only sellers or admins can add products" });
    }

    if (Number(price) <= 0 || Number(stock) < 0) {
      return res.status(400).json({ message: "Invalid numerical allocation boundaries" });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      subCategory: subCategory || "",
      stock: Number(stock),
      imageUrl,
      seller: req.user._id,
    });

    const savedProduct = await product.save();

    // Safe plain object parsing to prevent TypeScript element mapping crash
    const productData = savedProduct.toObject();
    const embedding = await getEmbedding(
      `${productData.name} ${productData.description} ${productData.category} ${productData.subCategory || ''}`
    );

    await index.upsert({
      records: [
        {
          id: savedProduct._id.toString(),
          values: embedding,
          metadata: {
            name: productData.name,
            description: productData.description,
            category: productData.category,
            subCategory: productData.subCategory || "",
          },
        },
      ],
    });

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

    const keyword = req.query.keyword as string;
    const category = req.query.category as string;
    const subCategory = req.query.subCategory as string;

    let queryFilter: any = {};

    if (keyword) {
      queryFilter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      queryFilter.category = category;
    }

    if (subCategory) {
      queryFilter.subCategory = subCategory;
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
    res.status(500).json({ message: "Error fetching products from data vector" });
  }
};

export const deleteProduct = async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    await index.deleteMany({ ids: [product._id.toString()] });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
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
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const updateProduct = async (req: any, res: any) => {
  const { name, price, description, imageUrl, category, subCategory, stock } = req.body;

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
      product.subCategory = subCategory || product.subCategory;
      product.stock = stock !== undefined ? Number(stock) : product.stock;

      const updatedProduct = await product.save();

      // Safe plain object mapping context for updates
      const updatePayload = updatedProduct.toObject();

      const embedding = await getEmbedding(
        `${updatePayload.name} ${updatePayload.description} ${updatePayload.category} ${updatePayload.subCategory || ''}`
      );

      await index.upsert({
        records: [
          {
            id: updatePayload._id.toString(),
            values: embedding as number[],
            metadata: {
              name: updatePayload.name,
              description: updatePayload.description,
              category: updatePayload.category,
              subCategory: updatePayload.subCategory || "",
            },
          },
        ],
      });

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Update Product Error:", error);
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