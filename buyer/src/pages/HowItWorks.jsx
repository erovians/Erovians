import React from "react";
import Layout from "../components/common/Layout";
import { assets } from "../assets/assets";
import {
  Search,
  FileText,
  MessageSquare,
  FileCheck,
  Lock,
  Hammer,
  Truck,
  PackageCheck,
  CheckCircle,
  AlertCircle,
  Archive,
  Shield,
  Users,
  Clock,
  DollarSign,
  Settings,
  Scale,
  Camera,
  Upload,
  Download,
  ShieldCheck,
  Fingerprint,
  Globe,
  CreditCard,
  ArrowRight,
  ChevronRight,
  Zap,
  Award,
  Target,
} from "lucide-react";

const HowItWorks = () => {
  const processSteps = [
    {
      step: "1",
      icon: Search,
      title: "Browse & Discover",
      description:
        "Search thousands of verified stone products or browse by category - marble, granite, natural stone, and more.",
      details: [
        "Filter by material type, origin, color",
        "View verified supplier profiles",
        "Check ratings and reviews",
        "Compare products and prices",
      ],
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    },
    {
      step: "2",
      icon: FileText,
      title: "Post RFQ (Request for Quotation)",
      description:
        "Submit your requirements and let verified suppliers compete to give you the best price and terms.",
      details: [
        "Specify product type and quantity",
        "Upload technical drawings (DXF, DWG, STL)",
        "Set dimensions and tolerances",
        "Define delivery location and timeline",
      ],
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
    },
    {
      step: "3",
      icon: MessageSquare,
      title: "Receive Multiple Quotations",
      description:
        "Get detailed quotes from verified suppliers within 24-48 hours with complete price breakdown.",
      details: [
        "Unit price & total (excl. VAT)",
        "VAT calculation by country",
        "Shipping & handling fees",
        "Customs duties estimate",
        "Platform commission (transparent)",
      ],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    },
    {
      step: "4",
      icon: FileCheck,
      title: "Smart Contract Auto-Generated",
      description:
        "Upon acceptance, a legally-binding smart contract is created automatically with all transaction details.",
      details: [
        "KYC-verified buyer & seller data",
        "Complete product specifications",
        "Technical drawing hash (cryptographic)",
        "Price, VAT, fees breakdown",
        "Incoterms, delivery terms",
        "Legal framework (GDPR, eIDAS, CISG)",
        "eIDAS-compliant electronic signature",
      ],
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
    },
    {
      step: "5",
      icon: Lock,
      title: "Secure Escrow Payment",
      description:
        "Your payment is held safely by a PSD2-certified provider. Seller only gets paid after you confirm delivery.",
      details: [
        "Payment via card, bank, or crypto",
        "Funds locked in secure escrow",
        "Seller cannot access until confirmation",
        "Full refund protection",
        "Transaction ID & cryptographic proof",
      ],
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80",
    },
    {
      step: "6",
      icon: Hammer,
      title: "Manufacturing & Preparation",
      description:
        "Seller manufactures your order according to exact specifications with quality checks and documentation.",
      details: [
        "Validates technical drawings",
        "CNC cutting for custom orders",
        "Quality control & CE compliance",
        "Photos/videos as manufacturing proof",
        "Professional packaging (wooden crates)",
      ],
      image:
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80",
    },
    {
      step: "7",
      icon: Truck,
      title: "Shipping & Tracking",
      description:
        "Professional logistics with real-time tracking, insurance, and complete transparency.",
      details: [
        "Carrier selection with tracking",
        "Proof of shipment uploaded",
        "Real-time tracking updates",
        "Transport insurance included",
        "Incoterms compliance (DAP, FOB, CIF)",
      ],
      image:
        "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&q=80",
    },
    {
      step: "8",
      icon: PackageCheck,
      title: "Delivery & Inspection",
      description:
        "Receive your order and verify everything matches the contract before final payment release.",
      details: [
        "Inspect package condition on arrival",
        "Take photos if any damage",
        "Verify dimensions and quality",
        "Check against technical drawings",
        "14-day inspection period (consumers)",
      ],
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
    },
    {
      step: "9",
      icon: CheckCircle,
      title: "Confirm & Release Payment",
      description:
        "Once satisfied, confirm delivery and payment is automatically released to the seller.",
      details: [
        "Click 'Confirm Receipt' button",
        "Escrow releases funds to seller",
        "Auto-release after X days if no issues",
        "2-year legal warranty starts (B2C)",
        "Transaction marked as complete",
      ],
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
    },
    {
      step: "10",
      icon: AlertCircle,
      title: "Dispute Resolution (If Needed)",
      description:
        "If there's any issue, our mediation system and ICC arbitration ensure fair resolution.",
      details: [
        "Upload evidence (photos, measurements)",
        "14-day platform mediation",
        "Seller provides counter-evidence",
        "ICC arbitration if no agreement",
        "Escrow holds funds until resolved",
      ],
      image:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    },
    {
      step: "11",
      icon: Archive,
      title: "Legal Archive (10 Years)",
      description:
        "All documents are securely stored for 10 years as required by European law.",
      details: [
        "Complete contract & all versions",
        "Technical drawings with hash",
        "Payment & shipping proofs",
        "Photos & inspection reports",
        "KYC verification hashes",
        "Blockchain timestamp (optional)",
      ],
      image:
        "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80",
    },
  ];

  const escrowFlow = [
    {
      stage: "Payment",
      icon: CreditCard,
      description: "Buyer pays via secure payment gateway",
    },
    {
      stage: "Escrow Hold",
      icon: Lock,
      description: "PSD2-certified provider holds funds safely",
    },
    {
      stage: "Delivery",
      icon: Truck,
      description: "Seller ships product with tracking",
    },
    {
      stage: "Verification",
      icon: PackageCheck,
      description: "Buyer inspects and confirms receipt",
    },
    {
      stage: "Release",
      icon: CheckCircle,
      description: "Payment released to seller's account",
    },
  ];

  const securityFeatures = [
    {
      icon: Fingerprint,
      title: "KYC/KYB Verification",
      description:
        "All users verified under EU Anti-Money-Laundering directives (AMLD4/AMLD5)",
    },
    {
      icon: ShieldCheck,
      title: "Smart Legal Contracts",
      description:
        "Automatically generated, eIDAS-compliant electronic signatures, legally binding",
    },
    {
      icon: Lock,
      title: "PSD2 Escrow",
      description:
        "Payment held by EU-licensed provider until delivery confirmed",
    },
    {
      icon: Globe,
      title: "Blockchain Evidence",
      description:
        "Optional cryptographic timestamping for immutable transaction proof",
    },
    {
      icon: FileCheck,
      title: "Drawing Hash Protection",
      description:
        "Technical files hashed to prevent 99% of custom order disputes",
    },
    {
      icon: Scale,
      title: "ICC Arbitration",
      description:
        "International disputes resolved by ICC arbitration in Luxembourg/Brussels",
    },
  ];

  const faqs = [
    {
      q: "How long does the entire process take?",
      a: "For ready-to-go products: 5-10 days. For custom CNC orders: 15-30 days depending on complexity and shipping distance.",
    },
    {
      q: "What happens if the product doesn't match specifications?",
      a: "You have 14 days to inspect (for consumers). Upload evidence and our mediation team will resolve it. Payment stays in escrow until resolution.",
    },
    {
      q: "Are there any hidden fees?",
      a: "No. All fees are clearly shown: product price, VAT, shipping, handling, customs estimate, and platform commission (typically 3-5%).",
    },
    {
      q: "Can I cancel after payment?",
      a: "For ready-to-go products: Yes, within 14 days (EU consumer right). For custom/made-to-order: No, as these are personalized (EU Directive 2011/83 Article 16c).",
    },
    {
      q: "How is my payment protected?",
      a: "Your money is held by a PSD2-licensed payment provider (like a bank). Erovians never touches your funds. Release only happens after you confirm delivery.",
    },
    {
      q: "What about international orders and customs?",
      a: "We support all Incoterms (DAP, FOB, CIF, etc.). Customs duties are estimated at checkout. You're responsible for import taxes as per your country's law.",
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-navyblue text-white">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <img
                src={assets.logowhite}
                alt="Erovians Logo"
                className="h-16 md:h-20 mb-8 mx-auto"
              />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                How Erovians Works
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                From browsing to delivery, every step is automated, secured by
                smart contracts, and legally protected. Here's your complete
                journey on the world's most advanced B2B stone marketplace.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">100% Secure</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <FileCheck className="w-5 h-5" />
                  <span className="font-semibold">Legally Binding</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Fully Automated</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="py-12 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-navyblue mb-2">
                  11 Steps
                </div>
                <p className="text-gray-600">Complete Process</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-navyblue mb-2">
                  99.2%
                </div>
                <p className="text-gray-600">Dispute Prevention</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-navyblue mb-2">
                  10 Years
                </div>
                <p className="text-gray-600">Legal Archiving</p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps - Detailed */}
        <div className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                The Complete Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every transaction follows this secure, transparent 11-step
                process
              </p>
            </div>

            <div className="space-y-16">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`grid md:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-navyblue text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <step.icon className="w-8 h-8 text-navyblue" />
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed mb-4">
                          {step.description}
                        </p>
                        <ul className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-gray-700"
                            >
                              <ChevronRight className="w-5 h-5 text-navyblue shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-64 md:h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Escrow Payment Flow */}
        <div className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Escrow Payment Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your money is protected at every step until you confirm delivery
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {escrowFlow.map((flow, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 text-center h-full">
                    <div className="bg-navyblue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <flow.icon className="w-8 h-8 text-navyblue" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {flow.stage}
                    </h3>
                    <p className="text-sm text-gray-600">{flow.description}</p>
                  </div>
                  {index < escrowFlow.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-navyblue" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-navyblue/5 border-l-4 border-navyblue p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-navyblue shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Your Money is Safe
                  </h3>
                  <p className="text-gray-700">
                    Erovians never holds your funds. All payments are managed by
                    a PSD2-licensed payment service provider (like a bank). The
                    seller cannot access your money until you explicitly confirm
                    delivery or the auto-release period expires. If there's a
                    dispute, funds remain locked until resolution through
                    mediation or ICC arbitration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Security & Legal Protection
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Multiple layers of protection for every transaction
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-navyblue hover:shadow-md transition-all"
                >
                  <div className="bg-navyblue/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-navyblue" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Contract Details */}
        <div className="py-16 md:py-20 bg-navyblue text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What's Inside a Smart Contract?
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Every contract is automatically generated with complete legal
                and technical details
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Party Details",
                  items: [
                    "KYC-verified buyer & seller",
                    "Company numbers (VAT, SIRET)",
                    "Legal addresses",
                    "Contact information",
                  ],
                },
                {
                  title: "Product Data",
                  items: [
                    "Complete specifications",
                    "Technical drawings (DXF/DWG)",
                    "Cryptographic file hash",
                    "Material compliance (CE, EN)",
                  ],
                },
                {
                  title: "Financial Terms",
                  items: [
                    "Unit & total prices",
                    "VAT calculation",
                    "Shipping & handling fees",
                    "Platform commission",
                  ],
                },
                {
                  title: "Delivery Terms",
                  items: [
                    "Incoterms (DAP, FOB, CIF)",
                    "Shipping method & tracking",
                    "Delivery address",
                    "Timeline commitments",
                  ],
                },
                {
                  title: "Legal Framework",
                  items: [
                    "GDPR compliance",
                    "eIDAS signature",
                    "CISG (international)",
                    "Consumer rights (if B2C)",
                  ],
                },
                {
                  title: "Protection & Archive",
                  items: [
                    "2-year warranty (B2C)",
                    "14-day withdrawal (if applicable)",
                    "10-year legal archive",
                    "Blockchain timestamp",
                  ],
                },
              ].map((section, index) => (
                <div key={index} className="bg-white/10 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-white/90"
                      >
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about trading on Erovians
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-3">
                    <Target className="w-6 h-6 text-navyblue shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed pl-9">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-navyblue text-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of buyers and sellers trading with complete
              security and legal protection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-navyblue px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Browse Products
              </button>
              <button className="bg-yellow-500 text-navyblue px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Post Your RFQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
