import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { 
  ShoppingCart, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRODUCTS = [
  { 
    id: '1', 
    name: 'Enterprise License', 
    price: '199.00', 
    description: 'Full access for up to 50 users with priority 24/7 support and custom integration.',
    tag: 'Popular'
  },
  { 
    id: '2', 
    name: 'Professional Tier', 
    price: '49.00', 
    description: 'Advanced features for individuals and small teams. Includes API access.',
    tag: null
  },
  { 
    id: '3', 
    name: 'Starter Pack', 
    price: '19.00', 
    description: 'Essential tools to get your project off the ground. Perfect for hobbyists.',
    tag: null
  },
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[1]);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);

  const initialOptions = {
    clientId: (import.meta as any).env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
  };

  const createOrder = async () => {
    setPaymentStatus('processing');
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: selectedProduct.price }),
      });
      const order = await response.json();
      return order.id;
    } catch (error) {
      console.error("Error creating order:", error);
      setPaymentStatus('error');
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID }),
      });
      const details = await response.json();
      setOrderId(details.id);
      setPaymentStatus('success');
    } catch (error) {
      console.error("Error capturing order:", error);
      setPaymentStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1A1A1A] selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
              <CreditCard className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight uppercase italic">PayHub.</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[13px] font-semibold uppercase tracking-widest text-black/40">
            <a href="#" className="hover:text-black transition-colors">Solutions</a>
            <a href="#" className="hover:text-black transition-colors">Pricing</a>
            <a href="#" className="hover:text-black transition-colors">Developers</a>
            <button className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-black/80 transition-all">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Product Selection */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure Checkout
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-6">
                Choose your <br />
                <span className="text-indigo-600">experience.</span>
              </h1>
              <p className="text-lg text-black/50 max-w-lg leading-relaxed">
                Select the plan that best fits your needs. All payments are processed securely via PayPal's global infrastructure.
              </p>
            </motion.div>

            <div className="space-y-4">
              {PRODUCTS.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    setSelectedProduct(product);
                    if (paymentStatus === 'success') setPaymentStatus('idle');
                  }}
                  className={`group relative p-8 rounded-[32px] border transition-all duration-500 cursor-pointer ${
                    selectedProduct.id === product.id
                      ? 'border-black bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]'
                      : 'border-black/5 bg-transparent hover:border-black/20'
                  }`}
                >
                  {product.tag && (
                    <div className="absolute -top-3 right-8 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {product.tag}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-2xl font-bold transition-colors ${selectedProduct.id === product.id ? 'text-black' : 'text-black/40'}`}>
                          {product.name}
                        </h3>
                        {selectedProduct.id === product.id && (
                          <motion.div layoutId="check" className="text-indigo-600">
                            <CheckCircle2 className="w-5 h-5" />
                          </motion.div>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed transition-colors max-w-md ${selectedProduct.id === product.id ? 'text-black/60' : 'text-black/30'}`}>
                        {product.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold tracking-tight mb-1 ${selectedProduct.id === product.id ? 'text-black' : 'text-black/30'}`}>
                        ${product.price}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-black/30">
                        USD / One-time
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-3xl bg-black/5 border border-black/5 flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Info className="w-5 h-5 text-black/40" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">Need a custom solution?</h4>
                <p className="text-sm text-black/50 leading-relaxed">
                  For teams larger than 50 or specialized requirements, contact our sales team for a tailored quote and dedicated support.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-black/5"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold tracking-tight">Summary</h2>
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-black/30">
                  <Lock className="w-3 h-3" />
                  Encrypted
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-black/30 mb-1">Selected Plan</div>
                    <div className="font-bold text-lg">{selectedProduct.name}</div>
                  </div>
                  <div className="font-bold text-lg">${selectedProduct.price}</div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-black/30 mb-1">Processing Fee</div>
                    <div className="font-bold text-lg">Included</div>
                  </div>
                  <div className="font-bold text-lg">$0.00</div>
                </div>

                <div className="h-px bg-black/5" />

                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold tracking-tighter">Total</span>
                  <div className="text-right">
                    <span className="text-4xl font-bold tracking-tighter text-indigo-600">${selectedProduct.price}</span>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-black/30 mt-1">All taxes included</div>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {paymentStatus === 'idle' || paymentStatus === 'processing' ? (
                  <motion.div
                    key="paypal-container"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative z-0"
                  >
                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons
                        style={{ 
                          layout: "vertical", 
                          shape: "rect", 
                          label: "pay",
                          height: 54
                        }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={() => setPaymentStatus('error')}
                      />
                    </PayPalScriptProvider>
                    <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Powered by PayPal Secure
                    </div>
                  </motion.div>
                ) : paymentStatus === 'success' ? (
                  <motion.div
                    key="success-state"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight mb-3">Payment Confirmed</h3>
                    <p className="text-black/50 text-sm mb-8 leading-relaxed">
                      Your transaction was successful. Order ID: <br />
                      <span className="font-mono text-indigo-600 font-bold mt-2 inline-block">{orderId}</span>
                    </p>
                    <button
                      onClick={() => setPaymentStatus('idle')}
                      className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-all flex items-center justify-center gap-3"
                    >
                      Return to Dashboard <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="error-state"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight mb-3">Transaction Failed</h3>
                    <p className="text-black/50 text-sm mb-8 leading-relaxed">
                      We couldn't process your payment at this time. Please check your details and try again.
                    </p>
                    <button
                      onClick={() => setPaymentStatus('idle')}
                      className="w-full py-5 bg-rose-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-rose-700 transition-all"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-8 opacity-20 grayscale hover:opacity-40 transition-opacity duration-500">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-black/5 bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <CreditCard className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight uppercase italic">PayHub.</span>
              </div>
              <p className="text-black/40 text-sm max-w-xs leading-relaxed">
                Empowering digital commerce with secure, seamless payment experiences for businesses of all sizes.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-[11px] uppercase tracking-widest text-black/30 mb-6">Product</h5>
              <ul className="space-y-4 text-sm font-semibold">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-[11px] uppercase tracking-widest text-black/30 mb-6">Company</h5>
              <ul className="space-y-4 text-sm font-semibold">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-black/5 text-[11px] font-bold uppercase tracking-widest text-black/30">
            <p>© 2026 PayHub Global Systems. All rights reserved.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
              <a href="#" className="hover:text-black transition-colors">Terms</a>
              <a href="#" className="hover:text-black transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
