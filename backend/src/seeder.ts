import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { products } from './data/products'; 
import connectDB from './config/db.js';

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany(); 
    await Product.insertMany(products); 
    console.log('Data Imported! ✅');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();