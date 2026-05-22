// Single Source of Truth for the entire Marketplace Taxonomy
export const CATEGORY_TREE: Record<string, string[]> = {
  "Electronics": ["Laptops", "Mice", "Keyboards", "Monitors", "Microwaves", "Air Conditioners", "Washing machines"],
  "Fashion": ["T-Shirts", "Shirts", "Jeans", "Shoes"],
  "Home & Kitchen": ["Cushion covers & bedsheets", "Figurines & Vases", "Home storage", "Lighting solutions"],
  "Automotive": ["Cleaning supplies", "Car electronics", "Helmets", "Vehicle tools"],
  "Books": ["Fiction", "Non-Fiction", "Academic"],
  "Toys": ["Action Figures", "Puzzles", "Board Games"],
  "Beauty": ["Skincare", "Makeup", "Fragrances"],
  "Grocery": ["Snacks", "Beverages", "Staples"],
  "Health": ["Supplements", "Fitness Gear"],
  "Sports": ["Cricket", "Football", "Gym Equipment"]
};

// Frontend Dropdowns aur Filters ke liye automatic derivation
export const PRODUCT_CATEGORIES = Object.keys(CATEGORY_TREE);
export const SEARCH_CATEGORIES = ["All", ...PRODUCT_CATEGORIES];
export const QUICK_FILTERS = ["All", "Electronics", "Fashion", "Home & Kitchen", "Automotive"];