import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Order ID Generator: POC-IKAT-XXXX
let orderCounter = 2004;
export function generateOrderId(): string {
  orderCounter++;
  return `POC-IKAT-${orderCounter}`;
}

// Product ID Generator
let productCounter = 1008;
export function generateProductId(): string {
  productCounter++;
  return `POC-IKAT-${productCounter}`;
}

// Format price in INR
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

// Format date
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Estimated delivery date (7-14 days from now)
export function getEstimatedDelivery(): string {
  const days = Math.floor(Math.random() * 7) + 7;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

// Multilingual labels
export const labels = {
  en: {
    home: "Home",
    products: "Products",
    orders: "Orders",
    profile: "Profile",
    login: "Login",
    register: "Register",
    addProduct: "Add Product",
    yarnBoard: "Yarn Board",
    dashboard: "Dashboard",
    verify: "Verify Authenticity",
    search: "Search products...",
    buyNow: "Buy Now",
    addToCart: "Add to Cart",
    checkout: "Checkout",
    trackOrder: "Track Order",
    orderPlaced: "Order Placed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    authentic: "Authentic Pochampally Ikat",
    directFromWeavers: "Direct from Weavers",
    sarees: "Sarees",
    dupattas: "Dupattas",
    dressMaterials: "Dress Materials",
  },
  te: {
    home: "హోమ్",
    products: "ఉత్పత్తులు",
    orders: "ఆర్డర్లు",
    profile: "ప్రొఫైల్",
    login: "లాగిన్",
    register: "నమోదు",
    addProduct: "ఉత్పత్తిని జోడించు",
    yarnBoard: "నూలు బోర్డు",
    dashboard: "డాష్‌బోర్డ్",
    verify: "ప్రామాణికత ధృవీకరించు",
    search: "ఉత్పత్తులు శోధించు...",
    buyNow: "ఇప్పుడు కొనండి",
    addToCart: "కార్ట్‌కి జోడించు",
    checkout: "చెక్అవుట్",
    trackOrder: "ఆర్డర్ ట్రాక్ చేయి",
    orderPlaced: "ఆర్డర్ పెట్టబడింది",
    processing: "ప్రాసెసింగ్",
    shipped: "షిప్ చేయబడింది",
    delivered: "డెలివరీ అయింది",
    authentic: "ప్రామాణిక పోచంపల్లి ఇకత్",
    directFromWeavers: "నేరుగా నేతగాళ్ల నుండి",
    sarees: "చీరలు",
    dupattas: "దుపట్టాలు",
    dressMaterials: "డ్రెస్ మెటీరియల్స్",
  },
  hi: {
    home: "होम",
    products: "उत्पाद",
    orders: "ऑर्डर",
    profile: "प्रोफाइल",
    login: "लॉगिन",
    register: "पंजीकरण",
    addProduct: "उत्पाद जोड़ें",
    yarnBoard: "धागा बोर्ड",
    dashboard: "डैशबोर्ड",
    verify: "प्रामाणिकता सत्यापित करें",
    search: "उत्पाद खोजें...",
    buyNow: "अभी खरीदें",
    addToCart: "कार्ट में जोड़ें",
    checkout: "चेकआउट",
    trackOrder: "ऑर्डर ट्रैक करें",
    orderPlaced: "ऑर्डर दिया गया",
    processing: "प्रोसेसिंग",
    shipped: "भेज दिया गया",
    delivered: "डिलीवर हो गया",
    authentic: "प्रामाणिक पोचमपल्ली इकत",
    directFromWeavers: "बुनकरों से सीधे",
    sarees: "साड़ियाँ",
    dupattas: "दुपट्टे",
    dressMaterials: "ड्रेस मटेरियल",
  },
};
