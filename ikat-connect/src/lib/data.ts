// ==================== TYPES ====================

export type UserRole = "customer" | "weaver" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface WeaverProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  photo: string;
  location: string;
  district: string;
  state: string;
  aadhaarVerified: boolean;
  weaverId: string;
  cooperativeMembership?: string;
  specialization: string;
  experienceYears: number;
  bio: string;
  verificationStatus: VerificationStatus;
  totalProducts: number;
  totalOrders: number;
  rating: number;
  joinedDate: string;
}

export type ProductCategory = "sarees" | "dupattas" | "dress-materials";

export interface Product {
  id: string;
  productId: string; // POC-IKAT-XXXX
  name: string;
  nameTE?: string;
  nameHI?: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  fabric: string;
  color: string;
  images: string[];
  weaverId: string;
  weaverName: string;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviews: number;
  tags: string[];
  createdAt: string;
  isPreOrder?: boolean;
  preOrderLeadTimeDays?: number;
}

export type OrderStatus =
  | "order-received"
  | "yarn-purchased"
  | "weaving-started"
  | "processing"
  | "shipped"
  | "delivered";

export interface Order {
  id: string;
  orderId: string; // POC-IKAT-XXXX
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  productId: string;
  productName: string;
  productImage: string;
  weaverId: string;
  weaverName: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  isPreOrder?: boolean;
  advancePaidAmount?: number;
}

export type YarnType =
  | "silk"
  | "cotton"
  | "mercerized-cotton"
  | "polyester"
  | "wool";

export interface YarnRequest {
  id: string;
  weaverId: string;
  weaverName: string;
  yarnType: YarnType;
  yarnColor: string;
  quantityKg: number;
  urgency: "low" | "medium" | "high";
  status: "pending" | "pooled" | "ordered" | "delivered";
  createdAt: string;
  notes?: string;
}

export interface NotificationLog {
  id: string;
  type: "sms" | "whatsapp";
  recipient: string;
  message: string;
  timestamp: string;
}

// ==================== MOCK DATA ====================

export const mockWeavers: WeaverProfile[] = [
  {
    id: "w1",
    userId: "u-w1",
    name: "Ramesh Kumar",
    phone: "+91 9876543210",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    location: "Pochampally",
    district: "Yadadri Bhuvanagiri",
    state: "Telangana",
    aadhaarVerified: true,
    weaverId: "TS-WVR-2024-001",
    cooperativeMembership: "Pochampally Handloom Cooperative",
    specialization: "Double Ikat Silk Sarees",
    experienceYears: 25,
    bio: "Master weaver specializing in traditional Pochampally double ikat patterns. Third-generation weaver keeping the art alive.",
    verificationStatus: "verified",
    totalProducts: 12,
    totalOrders: 156,
    rating: 4.8,
    joinedDate: "2024-01-15",
  },
  {
    id: "w2",
    userId: "u-w2",
    name: "Lakshmi Devi",
    phone: "+91 9876543211",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    location: "Pochampally",
    district: "Yadadri Bhuvanagiri",
    state: "Telangana",
    aadhaarVerified: true,
    weaverId: "TS-WVR-2024-002",
    cooperativeMembership: "Pochampally Handloom Cooperative",
    specialization: "Ikat Cotton Dupattas",
    experienceYears: 18,
    bio: "Expert in cotton ikat weaving with vibrant geometric patterns. Specializes in modern fusion designs.",
    verificationStatus: "verified",
    totalProducts: 8,
    totalOrders: 89,
    rating: 4.7,
    joinedDate: "2024-03-10",
  },
  {
    id: "w3",
    userId: "u-w3",
    name: "Suresh Reddy",
    phone: "+91 9876543212",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    location: "Bhudan Pochampally",
    district: "Yadadri Bhuvanagiri",
    state: "Telangana",
    aadhaarVerified: true,
    weaverId: "TS-WVR-2024-003",
    specialization: "Silk Dress Materials",
    experienceYears: 15,
    bio: "Innovative weaver blending traditional tie-dye techniques with contemporary fashion trends.",
    verificationStatus: "verified",
    totalProducts: 6,
    totalOrders: 67,
    rating: 4.6,
    joinedDate: "2024-05-20",
  },
  {
    id: "w4",
    userId: "u-w4",
    name: "Anjali Kumari",
    phone: "+91 9876543213",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    location: "Pochampally",
    district: "Yadadri Bhuvanagiri",
    state: "Telangana",
    aadhaarVerified: false,
    weaverId: "TS-WVR-2024-004",
    specialization: "Traditional Ikat Sarees",
    experienceYears: 10,
    bio: "Young weaver carrying forward ancestral techniques. Known for intricate geometric motifs.",
    verificationStatus: "pending",
    totalProducts: 3,
    totalOrders: 12,
    rating: 4.5,
    joinedDate: "2024-08-01",
  },
  {
    id: "w5",
    userId: "u-w5",
    name: "Venkat Rao",
    phone: "+91 9876543214",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    location: "Choutuppal",
    district: "Yadadri Bhuvanagiri",
    state: "Telangana",
    aadhaarVerified: true,
    weaverId: "TS-WVR-2024-005",
    cooperativeMembership: "Choutuppal Weavers Society",
    specialization: "Patola Ikat Patterns",
    experienceYears: 30,
    bio: "Veteran weaver renowned for creating museum-quality Patola-inspired Ikat designs with intricate resist-dyeing.",
    verificationStatus: "verified",
    totalProducts: 10,
    totalOrders: 203,
    rating: 4.9,
    joinedDate: "2024-01-05",
  },
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    productId: "POC-IKAT-1001",
    name: "Royal Indigo Double Ikat Silk Saree",
    nameTE: "రాయల్ ఇండిగో డబుల్ ఇకత్ సిల్క్ చీర",
    nameHI: "रॉयल इंडिगो डबल इकत सिल्क साड़ी",
    description:
      "Exquisite handwoven double ikat silk saree in deep indigo with traditional geometric patterns. Each thread is individually tied and dyed before weaving, creating the signature blurred-edge Ikat effect. A masterpiece that takes 15-20 days to complete.",
    price: 12500,
    originalPrice: 15000,
    category: "sarees",
    fabric: "Pure Silk",
    color: "Indigo Blue",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
    ],
    weaverId: "w1",
    weaverName: "Ramesh Kumar",
    inStock: true,
    stockQuantity: 5,
    rating: 4.8,
    reviews: 42,
    tags: ["silk", "double-ikat", "traditional", "premium"],
    createdAt: "2025-12-01",
  },
  {
    id: "p2",
    productId: "POC-IKAT-1002",
    name: "Crimson Red Patola Ikat Saree",
    nameTE: "క్రిమ్సన్ రెడ్ పటోలా ఇకత్ చీర",
    nameHI: "क्रिमसन रेड पटोला इकत साड़ी",
    description:
      "Stunning patola-inspired ikat saree in rich crimson red with intricate diamond and floral patterns. Handwoven using traditional resist-dyeing technique passed down through generations.",
    price: 8500,
    originalPrice: 10000,
    category: "sarees",
    fabric: "Silk Cotton Blend",
    color: "Crimson Red",
    images: [
      "https://images.unsplash.com/photo-1617627143233-46f5de8df5eb?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=800&fit=crop",
    ],
    weaverId: "w5",
    weaverName: "Venkat Rao",
    inStock: true,
    stockQuantity: 3,
    rating: 4.9,
    reviews: 58,
    tags: ["silk-cotton", "patola", "traditional", "premium"],
    createdAt: "2025-11-15",
  },
  {
    id: "p3",
    productId: "POC-IKAT-1003",
    name: "Emerald Green Cotton Ikat Saree",
    nameTE: "ఎమరాల్డ్ గ్రీన్ కాటన్ ఇకత్ చీర",
    nameHI: "एमराल्ड ग्रीन कॉटन इकत साड़ी",
    description:
      "Elegant handloom cotton ikat saree in soothing emerald green. Perfect for daily wear with traditional zigzag patterns. Lightweight, breathable, and comfortable.",
    price: 3500,
    category: "sarees",
    fabric: "Pure Cotton",
    color: "Emerald Green",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
    ],
    weaverId: "w2",
    weaverName: "Lakshmi Devi",
    inStock: true,
    stockQuantity: 10,
    rating: 4.6,
    reviews: 31,
    tags: ["cotton", "daily-wear", "lightweight"],
    createdAt: "2025-12-10",
  },
  {
    id: "p4",
    productId: "POC-IKAT-1004",
    name: "Midnight Blue Ikat Dupatta",
    nameTE: "మిడ్‌నైట్ బ్లూ ఇకత్ దుపట్టా",
    nameHI: "मिडनाइट ब्लू इकत दुपट्टा",
    description:
      "Beautifully handwoven ikat dupatta in midnight blue with contrasting border. Perfect accessory to elevate any outfit with authentic Pochampally craftsmanship.",
    price: 1800,
    originalPrice: 2200,
    category: "dupattas",
    fabric: "Cotton Silk",
    color: "Midnight Blue",
    images: [
      "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=800&fit=crop",
    ],
    weaverId: "w2",
    weaverName: "Lakshmi Devi",
    inStock: true,
    stockQuantity: 15,
    rating: 4.7,
    reviews: 27,
    tags: ["dupatta", "cotton-silk", "accessory"],
    createdAt: "2025-12-05",
  },
  {
    id: "p5",
    productId: "POC-IKAT-1005",
    name: "Sunset Orange Geometric Dupatta",
    nameTE: "సన్‌సెట్ ఆరెంజ్ జియోమెట్రిక్ దుపట్టా",
    nameHI: "सनसेट ऑरेंज ज्यॉमेट्रिक दुपट्टा",
    description:
      "Vibrant sunset orange dupatta with bold geometric ikat patterns. A modern interpretation of traditional Pochampally design.",
    price: 2200,
    category: "dupattas",
    fabric: "Pure Silk",
    color: "Sunset Orange",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
    ],
    weaverId: "w3",
    weaverName: "Suresh Reddy",
    inStock: true,
    stockQuantity: 8,
    rating: 4.5,
    reviews: 19,
    tags: ["dupatta", "silk", "modern", "geometric"],
    createdAt: "2025-12-08",
  },
  {
    id: "p6",
    productId: "POC-IKAT-1006",
    name: "Ivory & Gold Silk Dress Material",
    nameTE: "ఐవరీ & గోల్డ్ సిల్క్ డ్రెస్ మెటీరియల్",
    nameHI: "आइवरी & गोल्ड सिल्क ड्रेस मटेरियल",
    description:
      "Premium ikat silk dress material in ivory white with golden border. Comes as a 3-piece set: top, bottom, and dupatta. Ideal for festive occasions.",
    price: 4500,
    originalPrice: 5500,
    category: "dress-materials",
    fabric: "Pure Silk",
    color: "Ivory & Gold",
    images: [
      "https://images.unsplash.com/photo-1617627143233-46f5de8df5eb?w=600&h=800&fit=crop",
    ],
    weaverId: "w1",
    weaverName: "Ramesh Kumar",
    inStock: true,
    stockQuantity: 6,
    rating: 4.7,
    reviews: 35,
    tags: ["dress-material", "silk", "festive", "3-piece"],
    createdAt: "2025-11-28",
  },
  {
    id: "p7",
    productId: "POC-IKAT-1007",
    name: "Teal Cotton Ikat Dress Material",
    nameTE: "టీల్ కాటన్ ఇకత్ డ్రెస్ మెటీరియల్",
    nameHI: "टील कॉटन इकत ड्रेस मटेरियल",
    description:
      "Comfortable handloom cotton dress material in teal with traditional ikat motifs. Versatile for both casual and semi-formal wear.",
    price: 2800,
    category: "dress-materials",
    fabric: "Pure Cotton",
    color: "Teal",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
    ],
    weaverId: "w3",
    weaverName: "Suresh Reddy",
    inStock: true,
    stockQuantity: 12,
    rating: 4.4,
    reviews: 22,
    tags: ["dress-material", "cotton", "casual"],
    createdAt: "2025-12-12",
  },
  {
    id: "p8",
    productId: "POC-IKAT-1008",
    name: "Purple Majesty Wedding Ikat Saree",
    nameTE: "పర్పుల్ మెజెస్టీ వెడ్డింగ్ ఇకత్ చీర",
    nameHI: "पर्पल मैजेस्टी वेडिंग इकत साड़ी",
    description:
      "Opulent wedding-grade double ikat saree in royal purple with gold zari work. A showstopper piece crafted over 30 days using the finest mulberry silk.",
    price: 25000,
    originalPrice: 30000,
    category: "sarees",
    fabric: "Mulberry Silk with Zari",
    color: "Royal Purple",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1617627143233-46f5de8df5eb?w=600&h=800&fit=crop",
    ],
    weaverId: "w5",
    weaverName: "Venkat Rao",
    inStock: true,
    stockQuantity: 2,
    rating: 5.0,
    reviews: 18,
    tags: ["silk", "wedding", "premium", "zari", "luxury"],
    createdAt: "2025-11-20",
  },
  {
    id: "p9",
    productId: "POC-IKAT-1009",
    name: "Custom Kanchi Border Ikat Saree (Pre-Order)",
    nameTE: "కస్టమ్ కంచి బార్డర్ ఇకత్ చీర (ప్రీ-ఆర్డర్)",
    nameHI: "कस्टम कांची बॉर्डर इकत साड़ी (प्री-ऑर्डर)",
    description: "Exclusive custom-made ikat saree with a rich Kanchi border. This item is woven on demand to ensure the highest quality. Please allow 30 days for weaving.",
    price: 18000,
    category: "sarees",
    fabric: "Pure Silk",
    color: "Ruby Red",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop"
    ],
    weaverId: "w1",
    weaverName: "Ramesh Kumar",
    inStock: false,
    stockQuantity: 0,
    rating: 0,
    reviews: 0,
    tags: ["silk", "custom", "pre-order", "premium"],
    createdAt: "2026-06-12",
    isPreOrder: true,
    preOrderLeadTimeDays: 30,
  },
];

export const mockOrders: Order[] = [
  {
    id: "o1",
    orderId: "POC-IKAT-2001",
    customerId: "u-c1",
    customerName: "Priya Sharma",
    customerPhone: "+91 9123456780",
    customerEmail: "priya.sharma@email.com",
    customerAddress: "42 MG Road, Hyderabad, Telangana 500001",
    productId: "p1",
    productName: "Royal Indigo Double Ikat Silk Saree",
    productImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
    weaverId: "w1",
    weaverName: "Ramesh Kumar",
    quantity: 1,
    totalAmount: 12500,
    status: "shipped",
    paymentMethod: "UPI",
    paymentStatus: "completed",
    createdAt: "2026-06-05",
    updatedAt: "2026-06-08",
    estimatedDelivery: "2026-06-15",
  },
  {
    id: "o2",
    orderId: "POC-IKAT-2002",
    customerId: "u-c2",
    customerName: "Rahul Reddy",
    customerPhone: "+91 9123456781",
    customerEmail: "rahul.r@email.com",
    customerAddress: "105 Jubilee Hills, Hyderabad, Telangana 500033",
    productId: "p4",
    productName: "Midnight Blue Ikat Dupatta",
    productImage: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=800&fit=crop",
    weaverId: "w2",
    weaverName: "Lakshmi Devi",
    quantity: 2,
    totalAmount: 3600,
    status: "processing",
    paymentMethod: "Card",
    paymentStatus: "completed",
    createdAt: "2026-06-09",
    updatedAt: "2026-06-09",
    estimatedDelivery: "2026-06-20",
  },
  {
    id: "o3",
    orderId: "POC-IKAT-2003",
    customerId: "u-c3",
    customerName: "Meera Patel",
    customerPhone: "+91 9123456782",
    customerEmail: "meera.p@email.com",
    customerAddress: "78 Banjara Hills, Hyderabad, Telangana 500034",
    productId: "p8",
    productName: "Purple Majesty Wedding Ikat Saree",
    productImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
    weaverId: "w5",
    weaverName: "Venkat Rao",
    quantity: 1,
    totalAmount: 25000,
    status: "order-received",
    paymentMethod: "Net Banking",
    paymentStatus: "completed",
    createdAt: "2026-06-11",
    updatedAt: "2026-06-11",
    estimatedDelivery: "2026-06-25",
  },
  {
    id: "o4",
    orderId: "POC-IKAT-2004",
    customerId: "u-c1",
    customerName: "Priya Sharma",
    customerPhone: "+91 9123456780",
    customerEmail: "priya.sharma@email.com",
    customerAddress: "42 MG Road, Hyderabad, Telangana 500001",
    productId: "p6",
    productName: "Ivory & Gold Silk Dress Material",
    productImage: "https://images.unsplash.com/photo-1617627143233-46f5de8df5eb?w=600&h=800&fit=crop",
    weaverId: "w1",
    weaverName: "Ramesh Kumar",
    quantity: 1,
    totalAmount: 4500,
    status: "delivered",
    paymentMethod: "UPI",
    paymentStatus: "completed",
    createdAt: "2026-05-20",
    updatedAt: "2026-06-01",
    estimatedDelivery: "2026-06-01",
  },
  {
    id: "o5",
    orderId: "POC-IKAT-2005",
    customerId: "u-c2",
    customerName: "Rahul Reddy",
    customerPhone: "+91 9123456781",
    customerEmail: "rahul.r@email.com",
    customerAddress: "105 Jubilee Hills, Hyderabad, Telangana 500033",
    productId: "p9",
    productName: "Custom Kanchi Border Ikat Saree (Pre-Order)",
    productImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
    weaverId: "w1",
    weaverName: "Ramesh Kumar",
    quantity: 1,
    totalAmount: 18000,
    status: "order-received",
    paymentMethod: "Card",
    paymentStatus: "completed",
    createdAt: "2026-06-12",
    updatedAt: "2026-06-12",
    estimatedDelivery: "2026-07-12",
    isPreOrder: true,
    advancePaidAmount: 9000,
  },
];

export const mockYarnRequests: YarnRequest[] = [
  {
    id: "yr1",
    weaverId: "w1",
    weaverName: "Ramesh Kumar",
    yarnType: "silk",
    yarnColor: "Indigo Blue",
    quantityKg: 5,
    urgency: "high",
    status: "pooled",
    createdAt: "2026-06-01",
    notes: "Need finest quality mulberry silk",
  },
  {
    id: "yr2",
    weaverId: "w2",
    weaverName: "Lakshmi Devi",
    yarnType: "cotton",
    yarnColor: "Natural White",
    quantityKg: 10,
    urgency: "medium",
    status: "pooled",
    createdAt: "2026-06-03",
  },
  {
    id: "yr3",
    weaverId: "w5",
    weaverName: "Venkat Rao",
    yarnType: "silk",
    yarnColor: "Royal Purple",
    quantityKg: 8,
    urgency: "high",
    status: "pooled",
    createdAt: "2026-06-02",
    notes: "For wedding collection orders",
  },
  {
    id: "yr4",
    weaverId: "w3",
    weaverName: "Suresh Reddy",
    yarnType: "cotton",
    yarnColor: "Teal Green",
    quantityKg: 7,
    urgency: "low",
    status: "pending",
    createdAt: "2026-06-05",
  },
  {
    id: "yr5",
    weaverId: "w1",
    weaverName: "Ramesh Kumar",
    yarnType: "mercerized-cotton",
    yarnColor: "Crimson Red",
    quantityKg: 6,
    urgency: "medium",
    status: "ordered",
    createdAt: "2026-05-28",
  },
  {
    id: "yr6",
    weaverId: "w2",
    weaverName: "Lakshmi Devi",
    yarnType: "silk",
    yarnColor: "Golden Yellow",
    quantityKg: 4,
    urgency: "high",
    status: "pending",
    createdAt: "2026-06-10",
  },
];

// ==================== MOCK USERS ====================

export const mockUsers: User[] = [
  {
    id: "u-c1",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 9123456780",
    role: "customer",
    address: "42 MG Road",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500001",
  },
  {
    id: "u-admin",
    name: "Admin User",
    email: "admin@ikatconnect.com",
    phone: "+91 9000000000",
    role: "admin",
  },
  {
    id: "u-w1",
    name: "Ramesh Kumar",
    email: "ramesh@ikatconnect.com",
    phone: "+91 9876543210",
    role: "weaver",
  },
];

// Helper functions
export function getWeaverById(id: string): WeaverProfile | undefined {
  return mockWeavers.find((w) => w.id === id);
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return mockProducts.filter((p) => p.category === category);
}

export function getProductsByWeaver(weaverId: string): Product[] {
  return mockProducts.filter((p) => p.weaverId === weaverId);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return mockOrders.filter((o) => o.customerId === customerId);
}

export function getOrdersByWeaver(weaverId: string): Order[] {
  return mockOrders.filter((o) => o.weaverId === weaverId);
}

export function getOrderById(orderId: string): Order | undefined {
  return mockOrders.find(
    (o) => o.orderId === orderId || o.id === orderId
  );
}

export function verifyProduct(productId: string): Product | undefined {
  return mockProducts.find((p) => p.productId === productId);
}
