"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Trash2, Minus, Plus, Home, CreditCard,
  ArrowRight, CheckCircle, Package, Loader2, Shield,
} from "lucide-react";

import { useCartStore } from "@/lib/cart-store";
import { useSession } from "@/providers/session-provider";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/orders";

type PaymentMethod = "cod" | "online";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const existing = document.getElementById("razorpay-checkout-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { user } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "confirmed">("cart");
  const [orderId, setOrderId] = useState("");
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [shipping, setShipping] = useState({
    name: "", phone: "", email: "", line1: "", city: "", state: "Telangana", pincode: "",
  });

  useEffect(() => {
    if (user) {
      setShipping((s) => ({ ...s, name: user.name ?? s.name, email: user.email ?? s.email }));
    }
  }, [user]);

  const grandTotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const address = {
    line1: shipping.line1, city: shipping.city,
    state: shipping.state, pincode: shipping.pincode, phone: shipping.phone,
  };
  const cartItems = items.map((item) => ({
    productId: item.product.id, quantity: item.quantity, price: item.product.price,
  }));

  const handleCOD = async () => {
    setPlacing(true);
    try {
      const result = await createOrder(cartItems, address, `COD-${Date.now()}`, "PENDING");
      setOrderId(result.orderId);
      setStep("confirmed");
      clearCart();
    } catch (err: any) {
      alert(err.message ?? "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handleRazorpay = async () => {
    setPlacing(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Payment gateway failed to load. Check your connection and try again.");

      const rpOrderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal }),
      });
      const rpOrder = await rpOrderRes.json();
      if (rpOrder.error) throw new Error(rpOrder.error);

      await new Promise<void>((resolve, reject) => {
        const options = {
          key: rpOrder.key,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          order_id: rpOrder.razorpayOrderId,
          name: "IKAT CONNECT",
          description: "Authentic Pochampally Ikat",
          prefill: { name: user?.name ?? "", email: user?.email ?? "", contact: shipping.phone },
          theme: { color: "#C9883A" },
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verify = await verifyRes.json();
              if (!verify.verified) throw new Error("Payment verification failed. Contact support.");

              const result = await createOrder(cartItems, address, response.razorpay_order_id, "PAID");
              setOrderId(result.orderId);
              setStep("confirmed");
              clearCart();
              resolve();
            } catch (err: any) {
              alert(err.message ?? "Payment verification failed.");
              reject(err);
            }
          },
          modal: {
            ondismiss: () => { setPlacing(false); resolve(); },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", (response: any) => {
          alert("Payment failed: " + (response.error?.description ?? "Unknown error"));
          setPlacing(false);
          resolve();
        });
        rzp.open();
      });
    } catch (err: any) {
      alert(err.message ?? "Payment failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!user) { router.push("/sign-in"); return; }
    if (paymentMethod === "cod") handleCOD();
    else handleRazorpay();
  };

  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <ShoppingCart className="w-16 h-16 text-stone-600 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-stone-400 mb-6">Browse our collection of authentic Ikat products</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  if (step === "confirmed") {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-stone-400 mb-6">Your order has been placed successfully</p>
          <div className="card p-6 mb-4">
            <p className="text-stone-400 text-sm mb-1">Order ID</p>
            <p className="text-lg font-mono font-bold text-amber-400 break-all">{orderId}</p>
            <p className="text-stone-500 text-xs mt-2">Track your order from the Orders page</p>
          </div>
          {paymentMethod === "cod" && (
            <div className="card p-4 mb-4 text-left border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Home className="w-4 h-4 text-amber-400" />
                <p className="text-amber-400 text-sm font-medium">Cash on Delivery</p>
              </div>
              <p className="text-stone-500 text-xs">Please keep exact change ready. Our delivery partner will collect payment.</p>
            </div>
          )}
          <div className="card p-4 mb-6 text-left">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-white text-sm font-medium">Estimated Delivery</p>
                <p className="text-stone-500 text-xs">7–14 business days</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/orders" className="btn-outline flex-1">Track Order</Link>
            <Link href="/products" className="btn-primary flex-1">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0a09] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {(["cart", "shipping", "payment"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? "gradient-primary text-white" :
                i < (["cart","shipping","payment"]).indexOf(step) ? "bg-emerald-600 text-white" :
                "bg-stone-800 text-stone-500"
              }`}>{i + 1}</div>
              <span className={`text-sm font-medium capitalize hidden sm:inline ${step === s ? "text-white" : "text-stone-500"}`}>{s}</span>
              {i < 2 && <div className="w-12 h-0.5 bg-stone-800 mx-2 hidden sm:block" />}
            </div>
          ))}
        </div>

        {/* Cart Step */}
        {step === "cart" && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-serif font-bold text-white mb-6">Shopping Cart</h1>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.product.id} className="card p-4 flex gap-4">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{item.product.name}</h3>
                    <p className="text-stone-500 text-xs">by {item.product.weaverName}</p>
                    <p className="text-amber-400 font-bold mt-1">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removeItem(item.product.id)} className="text-stone-500 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-stone-700 rounded-lg">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 text-stone-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                      <span className="px-3 text-white text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 text-stone-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-stone-400">Total</span>
                <span className="text-2xl font-bold text-white">{formatPrice(grandTotal)}</span>
              </div>
              <button onClick={() => setStep("shipping")} className="btn-primary w-full flex items-center justify-center gap-2">
                Continue to Shipping <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Shipping Step */}
        {step === "shipping" && (
          <div className="animate-fade-in-up max-w-lg mx-auto">
            <h1 className="text-2xl font-serif font-bold text-white mb-6">Shipping Details</h1>
            <form onSubmit={(e) => { e.preventDefault(); setStep("payment"); }} className="card p-6 space-y-4">
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Full Name</label>
                <input type="text" value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} className="input-field" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-stone-400 text-sm block mb-1.5">Phone</label>
                  <input type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="text-stone-400 text-sm block mb-1.5">Email</label>
                  <input type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} className="input-field" required />
                </div>
              </div>
              <div>
                <label className="text-stone-400 text-sm block mb-1.5">Address</label>
                <textarea value={shipping.line1} onChange={(e) => setShipping({ ...shipping, line1: e.target.value })} className="input-field min-h-20" required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-stone-400 text-sm block mb-1.5">City</label><input type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="input-field" required /></div>
                <div><label className="text-stone-400 text-sm block mb-1.5">State</label><input type="text" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className="input-field" required /></div>
                <div><label className="text-stone-400 text-sm block mb-1.5">PIN</label><input type="text" value={shipping.pincode} onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })} className="input-field" required /></div>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setStep("cart")} className="btn-outline flex-1">Back</button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="animate-fade-in-up max-w-lg mx-auto">
            <h1 className="text-2xl font-serif font-bold text-white mb-6">Payment Method</h1>
            <div className="space-y-3 mb-6">

              {/* COD Option */}
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                  paymentMethod === "cod"
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-stone-700 hover:border-stone-500 bg-stone-900/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === "cod" ? "bg-amber-500/20" : "bg-stone-800"}`}>
                  <Home className={`w-5 h-5 ${paymentMethod === "cod" ? "text-amber-400" : "text-stone-500"}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${paymentMethod === "cod" ? "text-amber-400" : "text-white"}`}>Cash on Delivery</p>
                  <p className="text-stone-500 text-xs mt-0.5">Pay in cash when your order arrives at your door</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${paymentMethod === "cod" ? "border-amber-500 bg-amber-500" : "border-stone-600"}`}>
                  {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>

              {/* Online Payment Option */}
              <button
                onClick={() => setPaymentMethod("online")}
                className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                  paymentMethod === "online"
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-stone-700 hover:border-stone-500 bg-stone-900/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === "online" ? "bg-indigo-500/20" : "bg-stone-800"}`}>
                  <CreditCard className={`w-5 h-5 ${paymentMethod === "online" ? "text-indigo-400" : "text-stone-500"}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${paymentMethod === "online" ? "text-indigo-400" : "text-white"}`}>Online Payment</p>
                  <p className="text-stone-500 text-xs mt-0.5">Debit / Credit Card · UPI · Net Banking via Razorpay</p>
                  {paymentMethod === "online" && (
                    <div className="mt-3 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-indigo-400 text-xs font-medium">Secured by Razorpay</span>
                      </div>
                      <p className="text-stone-500 text-xs">
                        You will be redirected to the Razorpay secure payment window.
                        Cards, UPI, and Net Banking are all supported.
                      </p>
                      <div className="mt-2 p-2 bg-stone-900/60 rounded-lg space-y-1.5">
                        <p className="text-stone-500 text-[10px] uppercase tracking-wider mb-1">Test credentials (Razorpay test mode)</p>
                        <div>
                          <p className="text-stone-500 text-[10px]">Mastercard (recommended)</p>
                          <p className="text-amber-400 text-xs font-mono">5267 3181 8797 5449</p>
                          <p className="text-stone-500 text-xs">Expiry: 12/26 · CVV: 123 · OTP: 123456</p>
                        </div>
                        <div className="border-t border-stone-800 pt-1.5">
                          <p className="text-stone-500 text-[10px]">UPI (easiest)</p>
                          <p className="text-amber-400 text-xs font-mono">success@razorpay</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${paymentMethod === "online" ? "border-indigo-500 bg-indigo-500" : "border-stone-600"}`}>
                  {paymentMethod === "online" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            </div>

            {/* Order summary */}
            <div className="card p-5 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-stone-400 text-sm">Items ({items.length})</span>
                <span className="text-white font-bold text-lg">{formatPrice(grandTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 text-xs">Shipping</span>
                <span className="text-emerald-400 text-xs font-medium">Free</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep("shipping")} className="btn-outline flex-1">Back</button>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="btn-accent flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {placing
                  ? paymentMethod === "online" ? "Opening Payment..." : "Placing Order..."
                  : paymentMethod === "online" ? `Pay ${formatPrice(grandTotal)}` : "Place Order (COD)"
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
