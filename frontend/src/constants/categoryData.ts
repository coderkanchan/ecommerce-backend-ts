
export const CATEGORY_TREE: Record<string, string[]> = {
  "Electronics": ["Laptops", "Mice", "Keyboards", "Monitors", "Air Conditioners"],
  "Hardware & Tools": ["Hand Tools", "Power Tools", "Safety Gear"],
  "Apparel & Wearables": ["T-Shirts", "Footwear", "Watches"],
  "Digital Assets & Software": ["SaaS Licenses", "UI Kits", "Dev Toolkits"],
  "Home Automation": ["Smart Lights", "Security Hubs"],
  "Mechanical Nodes": ["Actuators", "Sensors", "Gearboxes"]
};

export const PRODUCT_CATEGORIES = Object.keys(CATEGORY_TREE);

export const SEARCH_CATEGORIES = ["All", ...PRODUCT_CATEGORIES];

export const QUICK_FILTERS = ["All", ...PRODUCT_CATEGORIES];