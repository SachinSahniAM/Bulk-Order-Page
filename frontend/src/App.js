import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Phone, MessageCircle, Check, Star, Zap, Send, ArrowRight, TrendingDown } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Floating WhatsApp Button - More Aggressive
const FloatingWhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/917619168045?text=Hi! I want an instant quote for bulk orders"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-3 animate-pulse"
      data-testid="floating-whatsapp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="font-bold">Get Instant Quote</span>
    </a>
  );
};

// Full-Screen Hero with Massive Calculator
const AggressiveHero = () => {
  const [productType, setProductType] = useState("round-neck-tshirt");
  const [quantity, setQuantity] = useState(50);
  const [printingType, setPrintingType] = useState("screen");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateQuote = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/calculate-quote`, {
        product_type: productType,
        quantity: quantity,
        printing_type: printingType
      });
      setQuote(response.data);
    } catch (error) {
      console.error("Error calculating quote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateQuote();
  }, [productType, quantity, printingType]);

  const sendToWhatsApp = () => {
    const message = `Hi! I need a quote for:\n- Product: ${productType}\n- Quantity: ${quantity} pieces\n- Printing: ${printingType}\n- Estimated: ${quote?.estimated_price_range || 'calculating...'}\n\nPlease send me exact pricing and mockup!`;
    window.open(`https://wa.me/917619168045?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white flex items-center py-8 px-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Trust Strip */}
        <div className="text-center mb-6 animate-fadeInUp">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
            <Star className="w-5 h-5 text-yellow-300 mr-2 fill-current" />
            <span className="font-bold text-lg">1M+ Customers • 4.9★ Rating • 98% On-Time</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Headline */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
              Bulk T-Shirts & Hoodies
              <span className="block text-yellow-300 mt-2">Get Quote in 30 Seconds</span>
            </h1>
            <p className="text-2xl mb-8 text-white/90">
              From ₹349/piece • 15-30% OFF • Free Shipping
            </p>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={sendToWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-8 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center text-lg"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Send Quote to WhatsApp
              </button>
              <a
                href="tel:+917619168045"
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-5 px-8 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center text-lg"
              >
                <Phone className="w-6 h-6 mr-3" />
                Call Now
              </a>
            </div>
          </div>

          {/* Right: Massive Calculator */}
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl p-8 lg:p-10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-gray-900">Calculate Your Price</h2>
              <p className="text-gray-600 mt-2">Instant quote with discounts!</p>
            </div>

            {/* Product Selection - Bigger */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3 text-gray-700">SELECT PRODUCT</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "round-neck-tshirt", label: "Round Neck", price: "₹499" },
                  { value: "collar-tshirt", label: "Collar Tee", price: "₹599" },
                  { value: "hoodie", label: "Hoodie", price: "₹799" },
                  { value: "zipper-hoodie", label: "Zipper Hoodie", price: "₹899" }
                ].map((product) => (
                  <button
                    key={product.value}
                    onClick={() => setProductType(product.value)}
                    className={`py-4 px-4 rounded-xl font-bold transition-all text-center ${
                      productType === product.value
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="text-base">{product.label}</div>
                    <div className="text-xs mt-1 opacity-75">{product.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Slider - Bigger */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3 text-gray-700">
                QUANTITY: <span className="text-blue-600 text-3xl ml-2">{quantity}</span> pieces
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>10</span>
                <span>100</span>
                <span>200</span>
                <span>500+</span>
              </div>
            </div>

            {/* Printing Type - Bigger */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3 text-gray-700">PRINTING TYPE</label>
              <select
                value={printingType}
                onChange={(e) => setPrintingType(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent font-semibold text-lg"
              >
                <option value="screen">Screen Printing (Most Popular)</option>
                <option value="digital">Digital/DTF Print</option>
                <option value="embroidery">Embroidery (Premium)</option>
              </select>
            </div>

            {/* MASSIVE Quote Display */}
            {quote && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-6 border-4 border-green-400">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2 font-bold">YOUR PRICE</p>
                  <p className="text-5xl font-black text-green-600 mb-2">{quote.estimated_price_range}</p>
                  <p className="text-xl text-gray-700 mb-4">Per piece: <span className="font-bold text-green-600">{quote.per_piece_price}</span></p>
                  
                  <div className="flex justify-center gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-black text-green-600">{quote.discount_percentage}%</div>
                      <div className="text-xs text-gray-600">DISCOUNT</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{quote.delivery_time}</div>
                      <div className="text-xs text-gray-600">DELIVERY</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-xs text-gray-700">
                    <p className="font-semibold">⚠️ Indicative pricing. Actual price may vary based on print size, position & colors.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Aggressive CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={sendToWhatsApp}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black py-5 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center text-lg"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Send to WhatsApp Now!
              </button>
              <button
                onClick={() => document.getElementById('quick-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-5 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center text-lg"
              >
                <Send className="w-6 h-6 mr-3" />
                Get Free Mockup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Form Section - Ultra Simple
const QuickFormSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    product_type: "round-neck-tshirt",
    quantity: 50,
    printing_type: "screen",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API}/bulk-order-lead`, {
        ...formData,
        quantity: parseInt(formData.quantity)
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting. Please try WhatsApp or call us!");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div id="quick-form" className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black mb-4 text-green-600">Got It! 🎉</h2>
            <p className="text-2xl text-gray-700 mb-4">We'll send your mockup in 24 hours!</p>
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6">
              <p className="font-bold text-blue-800">📧 Email sent to info@almamaterstore.in</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/917619168045"
                className="bg-green-500 text-white font-bold py-4 px-8 rounded-xl"
              >
                Chat on WhatsApp
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-xl"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="quick-form" className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black mb-4">Get Your Free Mockup</h2>
          <p className="text-xl text-gray-600">Fill 6 fields • Get quote in 24 hours</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-8 shadow-xl">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              placeholder="Your Name *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <input
              type="tel"
              placeholder="Phone *"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
            />
            <input
              type="number"
              placeholder="Quantity *"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
              min="10"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
            />
            <select
              value={formData.product_type}
              onChange={(e) => setFormData({...formData, product_type: e.target.value})}
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 text-lg"
            >
              <option value="round-neck-tshirt">T-Shirt</option>
              <option value="hoodie">Hoodie</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black py-5 rounded-xl text-xl shadow-lg hover:scale-105 transition-all"
          >
            {submitting ? "Sending..." : "Get Free Mockup Now →"}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            ✓ Email sent to info@almamaterstore.in • ✓ Response in 24hrs
          </p>
        </form>
      </div>
    </div>
  );
};

// Mini Process - 3 Steps Only
const MiniProcess = () => {
  return (
    <div className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { num: "1", title: "Calculate & Send", desc: "Get instant quote via WhatsApp" },
            { num: "2", title: "Get Mockup", desc: "Free design in 24 hours" },
            { num: "3", title: "Receive Order", desc: "7-10 days delivery" }
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                {step.num}
              </div>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-lg">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mini FAQ - 5 Questions Only
const MiniFAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Minimum order?", a: "10 pieces. Discounts start from 50 pieces (15% OFF)." },
    { q: "Delivery time?", a: "7-10 days for most orders. Faster for urgent needs." },
    { q: "Can I see a sample?", a: "Yes! We send free mockups before production." },
    { q: "All India delivery?", a: "Yes, free shipping pan-India." },
    { q: "Payment terms?", a: "50% advance, 50% before delivery. Flexible for bulk orders." }
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12">Quick Answers</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 font-bold text-lg"
              >
                {faq.q}
                <span className="text-2xl">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 py-4 bg-gray-50 text-gray-700">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Final Aggressive CTA
const FinalCTA = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-black mb-6">Ready? Let's Do This! 🚀</h2>
        <p className="text-2xl mb-10">1M+ customers trust us. Join them today!</p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href="https://wa.me/917619168045?text=Hi! I want a bulk order quote!"
            className="bg-green-500 hover:bg-green-600 text-white font-black py-6 px-12 rounded-xl text-xl shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8 mr-3" />
            WhatsApp Now
          </a>
          <a
            href="tel:+917619168045"
            className="bg-white text-purple-600 hover:bg-gray-100 font-black py-6 px-12 rounded-xl text-xl shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
          >
            <Phone className="w-8 h-8 mr-3" />
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
};

// Minimal Footer
const SimpleFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-8 mb-6 text-lg">
          <div>📞 +91 76191 68045</div>
          <div>📧 info@almamaterstore.in</div>
          <div>💬 WhatsApp +91 76191 68045</div>
        </div>
        <p className="text-gray-400">© 2025 Alma Mater Store • India's #1 Custom Merchandise</p>
      </div>
    </footer>
  );
};

// Main Aggressive Page
const AggressiveBulkOrderPage = () => {
  return (
    <div className="min-h-screen">
      <AggressiveHero />
      <QuickFormSection />
      <MiniProcess />
      <MiniFAQ />
      <FinalCTA />
      <SimpleFooter />
      <FloatingWhatsAppButton />
    </div>
  );
};

// Home Page
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Alma Mater Store</h1>
        <p className="text-xl text-gray-600 mb-8">India's Most Loved Custom Merchandise</p>
        <a
          href="/bulk-order"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg"
        >
          View Bulk Order Page
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bulk-order" element={<AggressiveBulkOrderPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
