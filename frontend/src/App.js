import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Phone, MessageCircle, Check, Star, Package, Truck, Leaf, Award, Users, Building2, ChevronDown, ChevronUp, Zap, Send } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Sticky Contact Buttons Component
const StickyContactButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href="https://wa.me/917619168045?text=Hi, I'm interested in bulk orders"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        data-testid="whatsapp-button"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="ml-2 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">WhatsApp</span>
      </a>
      <a
        href="tel:+917619168045"
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        data-testid="call-button"
      >
        <Phone className="w-6 h-6" />
        <span className="ml-2 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">Call Now</span>
      </a>
    </div>
  );
};

// Hero Section with Quote Calculator
const HeroSection = ({ onScrollToForm }) => {
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

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Headline */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-yellow-300 mr-2" />
              <span className="text-sm font-semibold">Trusted by 1,000,000+ Happy Customers</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" data-testid="hero-headline">
              Get Custom Bulk T-Shirts & Hoodies
              <span className="block text-yellow-300 mt-2">Instant Quote in Seconds</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Premium quality • Free shipping • 7-10 days delivery • Custom designs
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Check className="w-5 h-5 text-green-300 mr-2" />
                <span className="text-sm">Minimum 10 pieces</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Check className="w-5 h-5 text-green-300 mr-2" />
                <span className="text-sm">Pan-India delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column - Quote Calculator */}
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8" data-testid="quote-calculator">
            <h2 className="text-2xl font-bold mb-6 text-center">Calculate Your Quote</h2>
            
            {/* Product Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Select Product</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "round-neck-tshirt", label: "Round Neck T-Shirt", price: "₹499" },
                  { value: "collar-tshirt", label: "Collar T-Shirt", price: "₹599" },
                  { value: "hoodie", label: "Hoodie", price: "₹799" },
                  { value: "zipper-hoodie", label: "Zipper Hoodie", price: "₹899" }
                ].map((product) => (
                  <button
                    key={product.value}
                    onClick={() => setProductType(product.value)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all text-left ${
                      productType === product.value
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    data-testid={`product-${product.value}`}
                  >
                    <div className="font-bold">{product.label}</div>
                    <div className="text-xs opacity-80">From {product.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Slider */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">
                Quantity: <span className="text-blue-600 text-xl">{quantity}</span> pieces
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                data-testid="quantity-slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10</span>
                <span>500+</span>
              </div>
            </div>

            {/* Printing Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Printing Type</label>
              <select
                value={printingType}
                onChange={(e) => setPrintingType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="printing-type-select"
              >
                <option value="screen">Screen Printing (Most Popular)</option>
                <option value="digital">Digital/DTF Print</option>
                <option value="embroidery">Embroidery (Premium)</option>
              </select>
            </div>

            {/* Quote Display */}
            {quote && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-green-200" data-testid="quote-result">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">Estimated Total Price</p>
                  <p className="text-3xl font-bold text-green-600">{quote.estimated_price_range}</p>
                  <p className="text-sm text-gray-600 mt-1">Per piece: {quote.per_piece_price}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Discount</p>
                    <p className="font-bold text-green-600">{quote.discount_percentage}% OFF</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Delivery</p>
                    <p className="font-bold text-blue-600">{quote.delivery_time}</p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={onScrollToForm}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
              data-testid="get-free-mockup-btn"
            >
              <Send className="w-5 h-5 mr-2" />
              Get Free Mockup & Confirm Order
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">✓ No credit card required • ✓ Response in 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Benefits Section
const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "7-10 days turnaround for most orders",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Bio-wash cotton, perfect stitching",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Eco-Friendly",
      description: "Sustainable materials & processes",
      color: "from-green-400 to-teal-500"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Shipping",
      description: "Pan-India delivery at no extra cost",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Custom Designs",
      description: "Free design support from our team",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Bulk Discounts",
      description: "Up to 30% off on large orders",
      color: "from-indigo-400 to-purple-500"
    }
  ];

  return (
    <div className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Alma Mater Store?</h2>
          <p className="text-xl text-gray-600">Everything you need for the perfect bulk order</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              data-testid={`benefit-card-${index}`}
            >
              <div className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${benefit.color} text-white mb-4`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Social Proof Section
const SocialProofSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="transform hover:scale-110 transition-all duration-300" data-testid="stat-customers">
            <div className="text-5xl font-bold mb-2">1,000,000+</div>
            <div className="text-blue-200">Happy Customers</div>
          </div>
          <div className="transform hover:scale-110 transition-all duration-300" data-testid="stat-companies">
            <div className="text-5xl font-bold mb-2">5,000+</div>
            <div className="text-blue-200">Companies Served</div>
          </div>
          <div className="transform hover:scale-110 transition-all duration-300" data-testid="stat-rating">
            <div className="text-5xl font-bold mb-2 flex items-center justify-center">
              4.9 <Star className="w-8 h-8 text-yellow-300 ml-2 fill-current" />
            </div>
            <div className="text-blue-200">Customers Love Rating</div>
          </div>
          <div className="transform hover:scale-110 transition-all duration-300" data-testid="stat-delivery">
            <div className="text-5xl font-bold mb-2">98%</div>
            <div className="text-blue-200">On-Time Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Process Section
const ProcessSection = () => {
  const steps = [
    {
      number: "1",
      title: "Submit Requirement",
      description: "Fill the form with your order details and preferences"
    },
    {
      number: "2",
      title: "Get Free Mockup",
      description: "Our team creates a design mockup within 24 hours"
    },
    {
      number: "3",
      title: "Approve Design",
      description: "Review and approve the final design or request changes"
    },
    {
      number: "4",
      title: "Receive Order",
      description: "Get your custom merchandise delivered to your doorstep"
    }
  ];

  return (
    <div className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Simple 4-step process to get your bulk order</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative" data-testid={`process-step-${index}`}>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-0"></div>
              )}
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ravi Arora",
      company: "Tech Conference",
      text: "The custom hoodies elevated our tech conference. Excellent color matches and incredibly fast turnaround time!",
      rating: 5
    },
    {
      name: "Sameer Singhania",
      company: "Corporate Event",
      text: "Premium material and they nailed our complex logo with ease. Bulk pricing is unbeatable for the quality!",
      rating: 5
    },
    {
      name: "Abhijeet Ray",
      company: "College Reunion",
      text: "Great fabric, warm and comfy. The print quality was outstanding. Really appreciated the bulk discount!",
      rating: 5
    }
  ];

  return (
    <div className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trusted by Thousands</h2>
          <p className="text-xl text-gray-600">See what our customers say about us</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              data-testid={`testimonial-${index}`}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How many pieces do I need to order for bulk pricing?",
      a: "You can start with just 10 pieces for bulk pricing. Perfect for teams, clubs, college fests, and startup squads!"
    },
    {
      q: "Can I see a sample before placing my full order?",
      a: "Yes! We offer sample pieces so you're confident about the fabric, fit, and print before going all in."
    },
    {
      q: "How soon will I get my bulk order?",
      a: "Most orders ship within 7–10 working days after design approval — super fast, even for last-minute events."
    },
    {
      q: "Do you deliver across India?",
      a: "Yes! We ship pan-India for free — colleges, startups, hostels, anywhere you need."
    },
    {
      q: "Can I mix different products in one order?",
      a: "Absolutely! You can mix and match hoodies, t-shirts, and sweatshirts in different sizes and colors."
    },
    {
      q: "What if I don't have a design ready?",
      a: "No worries — our designers can help you create a fresh, personalized design based on your idea or theme."
    },
    {
      q: "What sizes are available?",
      a: "From XS to 5XL, we've got every body type covered — no teammate left behind!"
    },
    {
      q: "Do you offer discounts on large orders?",
      a: "Yes! The more you order, the more you save. Get up to 30% off on bulk orders."
    }
  ];

  return (
    <div className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Everything you need to know about bulk orders</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
              data-testid={`faq-item-${index}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                data-testid={`faq-question-${index}`}
              >
                <span className="font-semibold text-lg">{faq.q}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200" data-testid={`faq-answer-${index}`}>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Lead Form Section
const LeadFormSection = ({ formRef }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    product_type: "round-neck-tshirt",
    quantity: 50,
    printing_type: "screen",
    message: ""
  });
  const [quote, setQuote] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateQuote = async () => {
    try {
      const response = await axios.post(`${API}/calculate-quote`, {
        product_type: formData.product_type,
        quantity: parseInt(formData.quantity),
        printing_type: formData.printing_type
      });
      setQuote(response.data);
    } catch (error) {
      console.error("Error calculating quote:", error);
    }
  };

  useEffect(() => {
    calculateQuote();
  }, [formData.product_type, formData.quantity, formData.printing_type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API}/bulk-order-lead`, {
        ...formData,
        quantity: parseInt(formData.quantity),
        estimated_price: quote ? quote.estimated_price_range : null
      });
      setSubmitted(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company_name: "",
        product_type: "round-neck-tshirt",
        quantity: 50,
        printing_type: "screen",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your request. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50" ref={formRef}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-green-600">Request Received!</h2>
            <p className="text-xl text-gray-700 mb-6">
              Thank you for your interest! Our team will review your requirements and send you a free mockup within 24 hours.
            </p>
            <p className="text-gray-600 mb-8">
              Check your email for confirmation. Need urgent assistance? Call us at +91 76191 68045
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
              data-testid="submit-another-btn"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50" ref={formRef}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Get Your Free Mockup</h2>
          <p className="text-xl text-gray-600">Fill in your details and we'll get back to you within 24 hours</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} data-testid="lead-form">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                  data-testid="form-name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  data-testid="form-email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                  data-testid="form-phone"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Company/Organization</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                  data-testid="form-company"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Product Type *</label>
                <select
                  name="product_type"
                  value={formData.product_type}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="form-product-type"
                >
                  <option value="round-neck-tshirt">Round Neck T-Shirt (₹499)</option>
                  <option value="collar-tshirt">Collar T-Shirt (₹599)</option>
                  <option value="hoodie">Hoodie (₹799)</option>
                  <option value="zipper-hoodie">Zipper Hoodie (₹899)</option>
                  <option value="sweatshirt">Sweatshirt (₹699)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="10"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="form-quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Printing Type *</label>
                <select
                  name="printing_type"
                  value={formData.printing_type}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="form-printing-type"
                >
                  <option value="screen">Screen Printing</option>
                  <option value="digital">Digital Print</option>
                  <option value="embroidery">Embroidery</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Additional Requirements</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about your design requirements, color preferences, delivery date, etc."
                data-testid="form-message"
              ></textarea>
            </div>

            {quote && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-2">Estimated Price for Your Order:</p>
                <p className="text-2xl font-bold text-green-600 mb-1">{quote.estimated_price_range}</p>
                <p className="text-sm text-gray-600">
                  {quote.discount_percentage}% discount • {quote.delivery_time} delivery
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              data-testid="submit-form-btn"
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Request & Get Free Mockup
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              ✓ Your information is secure • ✓ We'll respond within 24 hours
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// Final CTA Section
const FinalCTASection = ({ onScrollToForm }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Join 1,000,000+ happy customers who trust Alma Mater Store for their bulk merchandise needs
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onScrollToForm}
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            data-testid="final-cta-form"
          >
            Get Free Mockup Now
          </button>
          <a
            href="https://wa.me/917619168045?text=Hi, I'm interested in bulk orders"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center"
            data-testid="final-cta-whatsapp"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat on WhatsApp
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-300 mr-2" />
            <span>Free Design Support</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-300 mr-2" />
            <span>Pan-India Free Shipping</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-300 mr-2" />
            <span>7-10 Days Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Alma Mater Store</h3>
            <p className="text-gray-400">India's most loved customised merchandise brand</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-400 mb-2">Phone: +91 98765 43210</p>
            <p className="text-gray-400 mb-2">Email: bulk@almamater.com</p>
            <p className="text-gray-400">WhatsApp: +91 98765 43210</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Products</h4>
            <ul className="text-gray-400 space-y-2">
              <li>Custom T-Shirts</li>
              <li>Custom Hoodies</li>
              <li>Custom Sweatshirts</li>
              <li>Bulk Orders</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="text-gray-400 space-y-2">
              <li>About Us</li>
              <li>Contact</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Alma Mater Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Home Component
const Home = () => {
  const formRef = useState(null)[0];

  const scrollToForm = () => {
    formRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <HeroSection onScrollToForm={scrollToForm} />
      <BenefitsSection />
      <SocialProofSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <LeadFormSection formRef={formRef} />
      <FinalCTASection onScrollToForm={scrollToForm} />
      <Footer />
      <StickyContactButtons />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
