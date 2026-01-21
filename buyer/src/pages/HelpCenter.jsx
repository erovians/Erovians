import React, { useState } from "react";
import Layout from "../components/common/Layout";
import { assets } from "../assets/assets";
import {
  Search,
  HelpCircle,
  FileText,
  Package,
  CreditCard,
  Shield,
  Truck,
  Users,
  Settings,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Video,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  Lock,
  Globe,
  FileCheck,
  RefreshCw,
  Store,
  Target,
  Zap,
} from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    {
      icon: Package,
      title: "Orders & RFQs",
      description: "How to place orders, post RFQs, and track shipments",
      articles: 12,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      icon: CreditCard,
      title: "Payments & Escrow",
      description: "Payment methods, escrow system, and refunds",
      articles: 8,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      icon: Shield,
      title: "Security & Legal",
      description: "Smart contracts, KYC, and legal protection",
      articles: 10,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      icon: Truck,
      title: "Shipping & Delivery",
      description: "Logistics, tracking, and international shipping",
      articles: 9,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      icon: Users,
      title: "Account & Profile",
      description: "Registration, verification, and account settings",
      articles: 7,
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
    {
      icon: Store,
      title: "Selling on Erovians",
      description: "Become a seller, manage products, and quotations",
      articles: 11,
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
    {
      icon: FileCheck,
      title: "Custom Orders & CNC",
      description: "Upload drawings, specifications, and tolerances",
      articles: 6,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      icon: RefreshCw,
      title: "Returns & Disputes",
      description: "Withdrawal rights, disputes, and arbitration",
      articles: 8,
      color: "bg-red-50 text-red-600 border-red-200",
    },
  ];

  const faqs = [
    {
      category: "Getting Started",
      icon: Target,
      questions: [
        {
          q: "How do I create an account on Erovians?",
          a: "Click 'Sign Up' in the top right corner, fill in your details, and verify your email. For business accounts, you'll need to complete KYC verification with company documents.",
        },
        {
          q: "What is KYC and why is it required?",
          a: "KYC (Know Your Customer) is identity verification required under EU Anti-Money-Laundering laws. It ensures all users are verified and legitimate, creating a safe trading environment.",
        },
        {
          q: "Can I browse products without an account?",
          a: "Yes! You can browse all products, view supplier profiles, and see prices. However, to place orders or post RFQs, you need to create an account.",
        },
      ],
    },
    {
      category: "Orders & Payments",
      icon: Package,
      questions: [
        {
          q: "How does the escrow payment system work?",
          a: "When you pay, funds are held by a PSD2-certified payment provider (not Erovians). The seller only receives payment after you confirm delivery. This protects both parties.",
        },
        {
          q: "What payment methods are accepted?",
          a: "We accept credit/debit cards, bank transfers, and cryptocurrency. All payments are processed through secure, licensed payment gateways.",
        },
        {
          q: "Are there any hidden fees?",
          a: "No. All costs are transparent: product price, VAT, shipping, handling, customs estimate, and platform commission (typically 3-5%) are shown before payment.",
        },
        {
          q: "Can I cancel my order after payment?",
          a: "For ready-to-go products: Yes, within 14 days (EU consumer rights). For custom/made-to-order products: No, as they're personalized (EU Directive exception).",
        },
      ],
    },
    {
      category: "Shipping & Delivery",
      icon: Truck,
      questions: [
        {
          q: "How long does shipping take?",
          a: "Ready-to-go products: 5-10 days. Custom CNC orders: 15-30 days. International shipping depends on destination and customs clearance.",
        },
        {
          q: "Who pays for shipping and customs?",
          a: "Shipping fees are shown at checkout. For customs duties, it depends on the Incoterm used (DAP, FOB, CIF). We provide estimates, but you're responsible for import taxes.",
        },
        {
          q: "Can I track my shipment?",
          a: "Yes! Every order includes tracking. You'll receive the tracking number once the seller ships, and can monitor it in real-time through your dashboard.",
        },
      ],
    },
    {
      category: "Smart Contracts & Legal",
      icon: FileCheck,
      questions: [
        {
          q: "What is a smart legal contract?",
          a: "It's an automatically generated, legally-binding contract with all transaction details. It's cryptographically signed (eIDAS-compliant) and archived for 10 years as required by EU law.",
        },
        {
          q: "What legal protections do I have?",
          a: "EU buyers get: 14-day withdrawal right (ready products), 2-year legal warranty, GDPR data protection, and dispute resolution through mediation/ICC arbitration.",
        },
        {
          q: "How are disputes resolved?",
          a: "First, 14-day internal mediation. If unresolved, ICC arbitration (international standard). Your payment stays in escrow until resolution.",
        },
      ],
    },
    {
      category: "Custom Orders",
      icon: Settings,
      questions: [
        {
          q: "What file formats can I upload for custom orders?",
          a: "We accept DXF, DWG, STEP, and STL files. Your file is cryptographically hashed to prevent disputes and stored for 10 years.",
        },
        {
          q: "What if there's an error in my drawing?",
          a: "The seller validates your drawing before production and will notify you of any issues. Once you approve the final version, that becomes the binding specification.",
        },
        {
          q: "Can I cancel a custom order?",
          a: "No, custom/made-to-order products are exempt from withdrawal rights under EU law (Article 16c, Directive 2011/83) as they're personalized to your specifications.",
        },
      ],
    },
  ];

  const quickLinks = [
    { icon: BookOpen, text: "User Guide", link: "#" },
    { icon: Video, text: "Video Tutorials", link: "#" },
    { icon: Download, text: "Download Contract Template", link: "#" },
    { icon: FileText, text: "Terms & Conditions", link: "#" },
    { icon: Shield, text: "Privacy Policy", link: "#" },
    { icon: Globe, text: "Legal Framework", link: "#" },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      availability: "Mon-Fri, 9AM-6PM CET",
      action: "Start Chat",
      color: "bg-blue-500",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@erovians.com",
      availability: "Response within 24 hours",
      action: "Send Email",
      color: "bg-green-500",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+352 XX XX XX XX",
      availability: "Mon-Fri, 10AM-5PM CET",
      action: "Call Now",
      color: "bg-purple-500",
    },
  ];

  const toggleFaq = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenFaq(openFaq === key ? null : key);
  };

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-navyblue text-white">
          <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
            <div className="text-center">
              <img
                src={assets.logowhite}
                alt="Erovians Logo"
                className="h-12 md:h-14 mb-6 mx-auto"
              />
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                How Can We Help You?
              </h1>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Search our knowledge base or browse categories to find answers
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for help articles, guides, FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-5 py-3 pr-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-navyblue text-white p-2 rounded-md hover:bg-blue-800 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 max-w-xl mx-auto">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-2xl font-bold">71</div>
                  <div className="text-xs text-white/80">Articles</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs text-white/80">Support</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-xs text-white/80">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Browse Categories */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Browse by Category
              </h2>
              <p className="text-gray-600">
                Select a category to find relevant help articles
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`${category.color} border-2 p-5 rounded-lg hover:shadow-md transition-all cursor-pointer group`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      {category.articles} articles
                    </span>
                    <ChevronDown className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">Quick answers to common questions</p>
            </div>

            <div className="space-y-8">
              {faqs.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-navyblue/10 p-2 rounded-lg">
                      <section.icon className="w-5 h-5 text-navyblue" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {section.category}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {section.questions.map((faq, faqIndex) => {
                      const isOpen = openFaq === `${sectionIndex}-${faqIndex}`;
                      return (
                        <div
                          key={faqIndex}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:border-navyblue transition-colors"
                        >
                          <button
                            onClick={() => toggleFaq(sectionIndex, faqIndex)}
                            className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                          >
                            <span className="font-semibold text-gray-900 text-sm pr-4">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-navyblue shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-5 py-4 bg-white border-t border-gray-200">
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Helpful Resources
              </h2>
              <p className="text-gray-600">
                Guides, templates, and documentation
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 hover:border-navyblue hover:shadow-md transition-all group"
                >
                  <div className="bg-navyblue/10 p-2 rounded-lg group-hover:bg-navyblue group-hover:text-white transition-colors">
                    <link.icon className="w-5 h-5 text-navyblue group-hover:text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">
                    {link.text}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto group-hover:text-navyblue" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Still Need Help?
              </h2>
              <p className="text-gray-600">
                Our support team is here to assist you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-navyblue hover:shadow-md transition-all text-center"
                >
                  <div
                    className={`${option.color} w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <option.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {option.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    {option.availability}
                  </p>
                  <button className="bg-navyblue text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                    {option.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Banner */}
        <div className="bg-navyblue text-white py-10">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Clock className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-bold mb-2 text-sm">24/7 Platform Access</h3>
                <p className="text-xs text-white/80">
                  Browse and manage orders anytime
                </p>
              </div>
              <div>
                <Shield className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-bold mb-2 text-sm">Secure & Protected</h3>
                <p className="text-xs text-white/80">
                  All transactions legally guaranteed
                </p>
              </div>
              <div>
                <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-bold mb-2 text-sm">Fast Response</h3>
                <p className="text-xs text-white/80">Support within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
