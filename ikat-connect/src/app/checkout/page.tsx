"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  CreditCard,
  Smartphone,
  Building2,
  ArrowRight,
  CheckCircle,
  Package,
} from "lucide-react";

import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useDataStore } from "@/lib/data-store";
import { formatPrice, generateOrderId } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCartStore();
  const { user } = useAuthStore();
  const { addOrder, addNotificationLog } = useDataStore();
  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "confirmed">(
    "cart"
  );
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [selectedBank, setSelectedBank] = useState("");
  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Telangana",
    pincode: "",
  });
  const router = useRouter();

  const grandTotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalAmountToPay = items.reduce((acc, item) => {
    if (item.product.isPreOrder) {
      return acc + (item.product.price * item.quantity * 0.5);
    }
    return acc + (item.product.price * item.quantity);
  }, 0);
  const hasPreOrders = items.some(item => item.product.isPreOrder);

  // Pre-populate shipping details if user is logged in
  useEffect(() => {
    if (user) {
      setShipping({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "Telangana",
        pincode: user.pincode || "",
      });
    }
  }, [user]);

  const handlePlaceOrder = () => {
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    // Save orders to the dynamic data store
    items.forEach((item, index) => {
      const isPreOrder = item.product.isPreOrder;
      const advancePaidAmount = isPreOrder ? item.product.price * item.quantity * 0.5 : undefined;
      
      const order = {
        id: `o-${Date.now()}-${index}`,
        orderId: newOrderId,
        customerId: user?.id || `guest-${Date.now()}`,
        customerName: shipping.name,
        customerPhone: shipping.phone,
        customerEmail: shipping.email,
        customerAddress: `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.pincode}`,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        weaverId: item.product.weaverId,
        weaverName: item.product.weaverName,
        quantity: item.quantity,
        totalAmount: item.product.price * item.quantity,
        status: "order-received" as const,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: "completed" as const,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        estimatedDelivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        isPreOrder,
        advancePaidAmount,
      };
      addOrder(order);

      // Trigger notification log
      addNotificationLog({
        type: "sms",
        recipient: item.product.weaverName,
        message: `New Order Received! ${item.quantity}x ${item.product.name}. Order ID: ${newOrderId}`,
      });
      addNotificationLog({
        type: "whatsapp",
        recipient: item.product.weaverName,
        message: `Hello ${item.product.weaverName}, you have a new order (${newOrderId}) for ${item.quantity}x ${item.product.name}. Please check your dashboard for details.`,
      });
    });

    setStep("confirmed");
    clearCart();
  };

  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <ShoppingCart className="w-16 h-16 text-stone-600 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-stone-400 mb-6">
            Browse our collection of authentic Ikat products
          </p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (step === "confirmed") {
    return (
      <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully
          </p>
          <div className="card p-6 mb-6 bg-white/30 backdrop-blur-lg">
            <p className="text-gray-500 text-sm mb-1">Order ID</p>
            <p className="text-2xl font-mono font-bold text-amber-600">
              {orderId}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Save this ID to track your order
            </p>
          </div>
          {/* Show QR for UPI */}
          {paymentMethod === "upi" && (
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Your UPI QR Code:</p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${orderId}`}
                alt="UPI QR Code"
                className="mx-auto"
              />
            </div>
          )}
          <div className="card p-6 mb-6 bg-white/30 backdrop-blur-lg">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-indigo-400" />
              <div className="text-left">
                <p className="text-gray-800 text-sm font-medium">
                  Estimated Delivery
                </p>
                <p className="text-gray-500 text-xs">7-14 business days</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs">
              You will receive SMS and email updates about your order
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/orders" className="btn-outline flex-1">
              Track Order
            </Link>
            <Link href="/products" className="btn-primary flex-1">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {["cart", "shipping", "payment"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s
                    ? "gradient-primary text-white"
                    : i < ["cart", "shipping", "payment"].indexOf(step)
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-800 text-stone-500"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm font-medium capitalize hidden sm:inline ${
                  step === s ? "text-white" : "text-stone-500"
                }`}
              >
                {s}
              </span>
              {i < 2 && (
                <div className="w-12 h-0.5 bg-stone-800 mx-2 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Cart Step */}
        {step === "cart" && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-serif font-bold text-white mb-6">
              Shopping Cart
            </h1>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.product.id} className="card p-4 flex gap-4">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-stone-500 text-xs">
                      by {item.product.weaverName}
                    </p>
                    <p className="text-amber-400 font-bold mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-stone-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-stone-700 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="px-2 py-1 text-stone-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-white text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="px-2 py-1 text-stone-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-stone-400">Total Value</span>
                <span className="text-2xl font-bold text-white">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              {hasPreOrders && (
                <div className="mb-4 space-y-2 border-t border-stone-800 pt-4">
                  <p className="text-amber-400 text-sm">Your cart contains Pre-Order items. You only need to pay 50% advance for these items now.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 font-medium">To Pay Now</span>
                    <span className="text-xl font-bold text-amber-500">
                      {formatPrice(totalAmountToPay)}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setStep("shipping")}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Continue to Shipping <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Shipping Step */}
        {step === "shipping" && (
          <div className="animate-fade-in-up max-w-lg mx-auto">
            <h1 className="text-2xl font-serif font-bold text-white mb-6">
              Shipping Details
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("payment");
              }}
              className="card p-6 space-y-4"
            >
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={shipping.name}
                  onChange={(e) =>
                    setShipping({ ...shipping, name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-stone-400 text-sm block mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) =>
                      setShipping({ ...shipping, phone: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-stone-400 text-sm block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={shipping.email}
                    onChange={(e) =>
                      setShipping({ ...shipping, email: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Address</label>
                <textarea
                  value={shipping.address}
                  onChange={(e) =>
                    setShipping({ ...shipping, address: e.target.value })
                  }
                  className="input-field min-h-[80px]"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-stone-400 text-sm block mb-1.5">City</label>
                  <input
                    type="text"
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping({ ...shipping, city: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-stone-400 text-sm block mb-1.5">State</label>
                  <input
                    type="text"
                    value={shipping.state}
                    onChange={(e) =>
                      setShipping({ ...shipping, state: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-stone-400 text-sm block mb-1.5">PIN</label>
                  <input
                    type="text"
                    value={shipping.pincode}
                    onChange={(e) =>
                      setShipping({ ...shipping, pincode: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("cart")}
                  className="btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="animate-fade-in-up max-w-lg mx-auto">
            <h1 className="text-2xl font-serif font-bold text-white mb-6">
              Payment Method
            </h1>
            <div className="card p-6 space-y-4">
              {[
                { id: "upi", label: "UPI", icon: Smartphone, desc: "PhonePe, Google Pay, Paytm" },
                { id: "card", label: "Card", icon: CreditCard, desc: "Credit/Debit Card" },
                { id: "netbanking", label: "Net Banking", icon: Building2, desc: "All major banks" },
              ].map((method) => (
                <div key={method.id}>
                  <button
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      paymentMethod === method.id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-stone-700 hover:border-stone-500"
                    }`}
                  >
                    <method.icon
                      className={`w-5 h-5 ${
                        paymentMethod === method.id
                          ? "text-indigo-400"
                          : "text-stone-500"
                      }`}
                    />
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">
                        {method.label}
                      </p>
                      <p className="text-stone-500 text-xs">{method.desc}</p>
                    </div>
                  </button>

                  {/* Conditional inputs */}
                  {paymentMethod === method.id && method.id === "card" && (
                    <div className="mt-4 p-4 bg-stone-900 rounded-lg space-y-3">
                      <input type="text" placeholder="Card Number" className="input-field" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="MM/YY" className="input-field" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} />
                        <input type="password" placeholder="CVV" className="input-field" value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} />
                      </div>
                    </div>
                  )}
                  {paymentMethod === method.id && method.id === "netbanking" && (
                    <select className="mt-4 input-field" value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                      <option value="">Select Bank</option>
                      <option value="sbi">SBI</option>
                      <option value="hdfc">HDFC</option>
                      <option value="icici">ICICI</option>
                    </select>
                  )}
                </div>
              ))}

              <div className="border-t border-stone-800 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-stone-400">Total Amount To Pay</span>
                  <span className="text-2xl font-bold text-white">
                    {formatPrice(totalAmountToPay)}
                  </span>
                </div>
                {hasPreOrders && (
                  <p className="text-amber-400 text-xs mb-4">Includes 50% advance for pre-order items. Balance due on delivery.</p>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("shipping")}
                    className="btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      // Simple validation
                      if (paymentMethod === "card" && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
                        alert("Please fill all card details");
                        return;
                      }
                      if (paymentMethod === "netbanking" && !selectedBank) {
                        alert("Please select a bank");
                        return;
                      }
                      handlePlaceOrder();
                    }}
                    className="btn-accent flex-1 flex items-center justify-center gap-2"
                  >
                    Place Order <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
