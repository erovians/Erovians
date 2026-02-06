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
  Building2,
  Scale,
  FileSignature,
  Anchor,
  Database,
} from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    {
      icon: Package,
      title: "Orders & RFQs",
      description:
        "Place orders, post RFQs, track shipments & manage deliveries",
      articles: 15,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      icon: CreditCard,
      title: "Payments & Escrow",
      description: "Secure payments, escrow protection, refunds & invoicing",
      articles: 12,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      icon: Shield,
      title: "Smart Contracts & Legal",
      description: "Digital contracts, KYC/KYB, legal framework & compliance",
      articles: 14,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      icon: Truck,
      title: "Shipping & Incoterms",
      description: "International logistics, Incoterms, customs & tracking",
      articles: 11,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      icon: Building2,
      title: "Business Verification",
      description:
        "Company registration, KYB, VAT/EORI & document verification",
      articles: 9,
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
    {
      icon: Store,
      title: "Selling on Erovians",
      description: "Become a seller, product listings, quotations & management",
      articles: 13,
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
    {
      icon: FileCheck,
      title: "Custom Orders & CNC",
      description:
        "Technical drawings, specifications, tolerances & validation",
      articles: 10,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      icon: RefreshCw,
      title: "Returns & Disputes",
      description: "Withdrawal rights, dispute mediation & ICC arbitration",
      articles: 8,
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      icon: Scale,
      title: "B2B vs B2C Rules",
      description:
        "Understand different legal rules for business & consumer buyers",
      articles: 7,
      color: "bg-teal-50 text-teal-600 border-teal-200",
    },
    {
      icon: FileSignature,
      title: "Standards & Compliance",
      description: "CE marking, EN standards, material certifications & safety",
      articles: 6,
      color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    },
  ];

  const faqs = [
    {
      category: "Getting Started",
      icon: Target,
      questions: [
        {
          q: "How do I register my company on Erovians?",
          a: "Click 'Sign Up' and select 'Business Account'. You'll need: company registration certificate, VAT number, director's ID proof, and proof of business address. Individual buyers can register with personal ID. Business verification (KYB) is mandatory under EU Anti-Money Laundering Directives (AMLD4/AMLD5).",
        },
        {
          q: "What is KYC/KYB and why is it required?",
          a: "KYC (Know Your Customer) for individuals and KYB (Know Your Business) for companies is identity verification required by EU law (Directive 2015/849 & 2018/843). It ensures all users are legitimate and verified, creating a safe B2B trading environment. Documents are verified and stored as cryptographic hashes.",
        },
        {
          q: "Can I browse products without registering?",
          a: "Yes! You can browse all products, view supplier profiles, check prices, and explore categories. However, to place orders, post RFQs, or contact sellers directly, you must create a verified account.",
        },
        {
          q: "What's the difference between B2B and B2C on Erovians?",
          a: "B2B (Business-to-Business): No automatic withdrawal rights, CISG rules apply, VAT/EORI required for international orders, bulk pricing available. B2C (Business-to-Consumer): 14-day withdrawal right for standard products, 2-year legal warranty (EU Directive 2019/771), consumer protection applies.",
        },
      ],
    },
    {
      category: "Orders & Payments",
      icon: Package,
      questions: [
        {
          q: "How does the escrow payment system work?",
          a: "When you pay, funds are held by a PSD2-certified payment service provider (NOT Erovians). The seller receives payment only after you confirm delivery and the withdrawal period expires (if applicable). This protects both parties. Payment status: paid → locked → released. Erovians never directly holds customer funds.",
        },
        {
          q: "What payment methods are accepted?",
          a: "We accept: credit/debit cards (Visa, Mastercard), SEPA bank transfers, international wire transfers, and cryptocurrency wallets (future feature). All payments are processed through secure, EU-licensed payment gateways compliant with PSD2 regulations.",
        },
        {
          q: "What fees are charged?",
          a: "Fully transparent pricing: Product price (excluding VAT) + Applicable VAT (country-dependent) + Shipping fee + Handling fee (for heavy stone) + Packaging fee + Estimated customs duties (international) + Erovians platform commission (3-5%). All fees shown before payment confirmation.",
        },
        {
          q: "Can I cancel my order after payment?",
          a: "B2C (Consumer buyers): Yes, 14-day withdrawal right for ready-to-go products (EU Directive 2011/83/EU). NO withdrawal for custom/made-to-order products (Article 16c exception - personalized goods). B2B: No automatic withdrawal right, cancellation by mutual agreement or contract terms. CISG Article 49 may apply.",
        },
        {
          q: "How do I get an invoice?",
          a: "Invoices are automatically generated and include: seller details, VAT number, product description, prices, taxes, platform commission, and payment proof. Invoices are archived for 10 years as required by EU law and available in your account dashboard.",
        },
      ],
    },
    {
      category: "Shipping & Incoterms",
      icon: Truck,
      questions: [
        {
          q: "What are Incoterms and which ones does Erovians use?",
          a: "Incoterms define shipping responsibilities. We support: DAP (Delivered At Place - seller pays shipping to your address), FOB (Free On Board - buyer arranges transport from port), EXW (Ex Works - buyer collects from seller's location), CIF (Cost, Insurance, Freight - seller pays shipping + insurance). Your choice affects who pays customs and transport insurance.",
        },
        {
          q: "How long does shipping take?",
          a: "Ready-to-go products: 5-15 days (EU), 10-25 days (international). Custom CNC orders: 15-40 days depending on complexity. Heavy stone products: 20-35 days (includes special packaging). Estimated delivery shown before order confirmation. Tracking number provided upon shipment.",
        },
        {
          q: "Who pays for customs duties and import taxes?",
          a: "Depends on Incoterm: DAP (seller pays), FOB/EXW (buyer pays). For international shipments, buyer is responsible for import VAT, customs duties, and handling fees unless stated otherwise. We provide customs estimates at checkout based on destination country. Buyer needs VAT/EORI number for EU imports.",
        },
        {
          q: "Can I track my shipment in real-time?",
          a: "Yes! Every order includes tracking. Once shipped, you receive: tracking number, carrier name, estimated delivery date, and shipment proof (documents + photos). Track in real-time through your dashboard. Delivery confirmation required with timestamp and carrier signature.",
        },
        {
          q: "What if my shipment arrives damaged?",
          a: "Immediately: 1) Document damage with photos before unpacking, 2) Note reservations on carrier's delivery receipt, 3) Report to Erovians within 48 hours with evidence. Your payment stays in escrow until resolution. Transport insurance (if included) covers damages. Initial shipment photos serve as proof of original condition.",
        },
      ],
    },
    {
      category: "Smart Contracts & Legal Protection",
      icon: FileCheck,
      questions: [
        {
          q: "What is a Smart Legal Contract?",
          a: "Every order automatically generates a legally-binding contract containing: all transaction details (seller, buyer, product specs, pricing, shipping), eIDAS-compliant electronic signature (EU 910/2014), 10-year legal archiving (EU Directive 2011/83/EU), optional blockchain hash for tamper-proof timestamp, full legal framework references (DSA, GDPR, CISG). This is your legal proof of purchase.",
        },
        {
          q: "What legal protections do I have?",
          a: "EU Framework: Directive 2000/31/EC (e-Commerce), Regulation 2022/2065 (Digital Services Act - DSA), Directive 2011/83/EU (Consumer Rights - B2C), Directive 2019/771 (Product Guarantee - B2C), GDPR 2016/679 (Data Protection), eIDAS 910/2014 (Electronic Signatures), CISG (International B2B Sales), P2B Regulation 2019/1150 (Platform-to-Business). All contracts archived with cryptographic proof.",
        },
        {
          q: "How long is the legal warranty?",
          a: "B2C (Consumer): 2-year legal guarantee of conformity (EU Directive 2019/771). Covers product defects and non-conformity. B2B: Warranty as per contract terms or CISG Article 35. Additional seller commercial warranty may apply. Exclusion: Natural stone variations (veining, color, porosity) are NOT defects - specified in exclusion clauses per EN 1469 and EN 1341 standards.",
        },
        {
          q: "How are disputes resolved?",
          a: "3-Step Process: 1) Internal Mediation (14 days via Erovians platform) - both parties submit evidence (photos, documents, technical files), 2) ICC Arbitration (if mediation fails) - Seat: Luxembourg/Brussels, Language: English, Decision: final and binding, 3) Payment Decision - escrow releases funds based on arbitration outcome. Your payment stays in escrow during entire dispute period.",
        },
        {
          q: "Is my personal/business data protected?",
          a: "Yes. Full GDPR compliance (EU 2016/679). We process data under: purpose limitation, data minimization, secure encrypted storage, 10-year legal retention (then deleted). Your rights: access, rectification, erasure, data portability, opposition. KYC/KYB data stored as cryptographic hashes. Privacy Policy version timestamped in every contract.",
        },
      ],
    },
    {
      category: "Custom Orders & Technical Specifications",
      icon: Settings,
      questions: [
        {
          q: "What file formats can I upload for custom CNC orders?",
          a: "Accepted formats: DXF, DWG, STEP, STL, PDF (technical drawings). Your file is: cryptographically hashed (tamper-proof), validated by seller before production, stored for 10 years (legal requirement), used as binding specification. Upload via secure platform - hash generated instantly.",
        },
        {
          q: "What technical parameters can I specify?",
          a: "Full specifications: Dimensions (height, width, length, thickness in mm), Tolerances (±0.5mm standard, custom available), Radii (corner radius values), Angles (cutting angles), Finish types (polished, honed, brushed, flamed), Chamfers/Bevels, Vein orientation (for natural stone), Drilling positions/inserts. 3D preview available for complex designs.",
        },
        {
          q: "How does the drawing validation process work?",
          a: "Process: 1) Upload technical drawing, 2) Seller validates within 24-48 hours, 3) Seller notifies you of any issues/impossibilities, 4) You approve final plan (timestamped), 5) Approved version becomes binding specification. Both parties sign off digitally. This prevents 99% of disputes caused by drawing errors (as stated in contract data specifications).",
        },
        {
          q: "Can I cancel a custom/made-to-order product?",
          a: "No. Custom products are exempt from withdrawal rights under EU Directive 2011/83/EU Article 16(c) because they are personalized to your specifications. This applies to both B2B and B2C. Once you approve the final drawing and payment is made, the order is binding. Seller begins production immediately.",
        },
        {
          q: "What if there's an error in my uploaded drawing?",
          a: "Seller validation catches most errors before production. If error discovered after production starts: drawing hash proves original specifications, dispute resolution determines liability based on approved final plan version, photographic evidence required. Always double-check dimensions, tolerances, and material compatibility before approval.",
        },
      ],
    },
    {
      category: "Material Standards & Compliance",
      icon: FileSignature,
      questions: [
        {
          q: "What safety standards must products meet?",
          a: "All products must comply with: CE marking (when required for construction materials), EU construction standards (EN 1469 for natural stone, EN 1341 for slabs), Material safety regulations, Sanitary compliance (for bathroom/kitchen products). Seller provides: technical data sheets, compliance certificates, material origin documentation. Non-compliant products are seller's liability.",
        },
        {
          q: "Are color variations in natural stone considered defects?",
          a: "No. Natural variations are NOT defects per industry standards (EN 1469, EN 1341). Expected variations include: veining patterns, color shading, porosity differences, grain structure, natural fissures. These are specified in contract exclusion clauses. Photos taken at shipment serve as proof of condition. Seller must disclose material origin and natural characteristics.",
        },
        {
          q: "What documentation do I receive with my order?",
          a: "Standard documentation: Product invoice (VAT included), Smart Legal Contract (full terms), Technical data sheets, Compliance certificates (CE, material standards), Material origin certificate (optional but recommended), Batch number (for traceability), Shipment proof (documents + photos), Warranty documentation. All archived for 10 years.",
        },
      ],
    },
    {
      category: "Withdrawal Rights & Returns (B2C Focus)",
      icon: RefreshCw,
      questions: [
        {
          q: "When can I return a product? (Consumer Buyers)",
          a: "14-day withdrawal period for B2C ready-to-go products (EU Directive 2011/83/EU). Starts from delivery date. NO withdrawal for: custom/made-to-order products (Article 16c), personalized CNC items, products made to buyer's drawings. B2B transactions: no automatic withdrawal right (CISG rules apply). Return shipping cost: buyer's responsibility.",
        },
        {
          q: "How do I initiate a return?",
          a: "Process: 1) File withdrawal request through Erovians platform within 14 days, 2) Receive return authorization and shipping instructions, 3) Return product in original condition with all packaging, 4) Seller validates return, 5) Escrow refunds payment (minus return shipping). Deadline strictly enforced. Automated validation or manual review depending on product type.",
        },
        {
          q: "What if the product is non-conforming or defective?",
          a: "Immediate action: 1) Report within 48 hours of delivery with photos, 2) Submit evidence via platform (delivery photos, carrier reservations, defect documentation), 3) Seller has 7 days to respond with solution (replacement/repair/refund), 4) If unresolved, mediation starts, 5) Payment held in escrow until resolution. Legal warranty covers conformity issues for 2 years (B2C).",
        },
      ],
    },
    {
      category: "For Sellers",
      icon: Store,
      questions: [
        {
          q: "How do I become a verified seller on Erovians?",
          a: "Requirements: Valid business registration (VAT/SIRET/BCE/RC number), KYB verification (company documents), Professional address proof, Director ID verification, Bank account details (for payouts), Product liability insurance (recommended). Verification takes 3-5 business days. Verified badge displayed on your profile.",
        },
        {
          q: "What are my obligations as a seller?",
          a: "Legal obligations: Provide accurate product information (dimensions, material, specifications), Ensure CE marking and compliance (EU standards), Honor manufacturing and delivery deadlines, Validate custom drawings before production, Fulfill legal warranties (2 years B2C), Issue compliant invoices (VAT, company details), Handle returns as per withdrawal policy, Respond to disputes with evidence within 7 days, Cooperate with mediation/arbitration.",
        },
        {
          q: "When do I receive payment for orders?",
          a: "Payment release conditions: Buyer confirms delivery + Inspection period complete + Withdrawal period expires (14 days for B2C ready products, immediate for custom B2B) + No dispute filed. Funds transfer from escrow to your bank account within 3-5 business days after release. Platform commission (3-5%) deducted automatically. Full transaction record in Seller Central.",
        },
        {
          q: "What happens if a buyer disputes an order?",
          a: "Dispute process: 1) Notification via platform, 2) Submit your evidence (shipment proof, photos, validated drawings, communication logs) within 7 days, 3) Platform reviews both sides, 4) Mediation attempt (14 days), 5) ICC arbitration if unresolved, 6) Payment decision based on evidence. Maintain complete records: shipment proofs, drawing validations, photos, timestamps.",
        },
      ],
    },
  ];

  const quickLinks = [
    {
      icon: BookOpen,
      text: "User Guide & Documentation",
      link: "/documentation",
      description: "Complete platform guide",
    },
    {
      icon: Video,
      text: "Video Tutorials",
      link: "/tutorials",
      description: "How-to videos",
    },
    {
      icon: Download,
      text: "Download Contract Template",
      link: "/contract-template",
      description: "Sample smart contract",
    },
    {
      icon: FileText,
      text: "Terms & Conditions",
      link: "/terms-of-service",
      description: "Platform rules",
    },
    {
      icon: Shield,
      text: "Privacy Policy (GDPR)",
      link: "/privacy-policy",
      description: "Data protection",
    },
    {
      icon: Globe,
      text: "Legal Framework",
      link: "/legal-framework",
      description: "EU laws & compliance",
    },
    {
      icon: Scale,
      text: "Dispute Resolution Guide",
      link: "/dispute-resolution",
      description: "Mediation & arbitration",
    },
    {
      icon: Anchor,
      text: "Incoterms Explained",
      link: "/incoterms-guide",
      description: "Shipping terms",
    },
    {
      icon: Database,
      text: "Material Standards Database",
      link: "/material-standards",
      description: "CE, EN compliance",
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Chat with our B2B support team",
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
      title: "Phone Support (Business)",
      description: "+352 XX XX XX XX (Luxembourg)",
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
                Erovians Help Center
              </h1>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Find answers about B2B stone trading, smart contracts, payments,
                shipping & more
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search: smart contracts, escrow, customs, Incoterms, KYB verification..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-5 py-4 pr-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-navyblue text-white p-2 rounded-md hover:bg-blue-800 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-10 max-w-3xl mx-auto">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                  <div className="text-2xl font-bold">110+</div>
                  <div className="text-xs text-white/80">Help Articles</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                  <div className="text-2xl font-bold">10</div>
                  <div className="text-xs text-white/80">Categories</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs text-white/80">Platform Access</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                  <div className="text-2xl font-bold">EU</div>
                  <div className="text-xs text-white/80">Legal Protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice Banner */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-4">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-center gap-3 text-sm">
              <Shield className="w-5 h-5" />
              <p>
                <strong>Legal Protection:</strong> All transactions covered by
                Smart Legal Contracts, EU regulations (DSA, GDPR, eIDAS, CISG),
                and escrow payment protection.
              </p>
            </div>
          </div>
        </div>

        {/* Browse Categories */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Browse Help by Category
              </h2>
              <p className="text-gray-600">
                Select a category to find detailed guides and documentation
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`${category.color} border-2 p-5 rounded-xl hover:shadow-lg transition-all cursor-pointer group`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="bg-white p-3 rounded-lg w-fit group-hover:scale-110 transition-transform">
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">
                      {category.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed min-h-10">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                      <span className="text-xs font-semibold">
                        {category.articles} articles
                      </span>
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </div>
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
              <p className="text-gray-600">
                Comprehensive answers to common questions
              </p>
            </div>

            <div className="space-y-10">
              {faqs.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-navyblue">
                    <div className="bg-navyblue p-2.5 rounded-lg">
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {section.category}
                    </h3>
                    <span className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">
                      {section.questions.length} questions
                    </span>
                  </div>

                  <div className="space-y-3">
                    {section.questions.map((faq, faqIndex) => {
                      const isOpen = openFaq === `${sectionIndex}-${faqIndex}`;
                      return (
                        <div
                          key={faqIndex}
                          className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-navyblue transition-colors"
                        >
                          <button
                            onClick={() => toggleFaq(sectionIndex, faqIndex)}
                            className="w-full px-5 py-4 flex items-start justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                          >
                            <span className="font-semibold text-gray-900 text-sm pr-4 leading-relaxed">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-navyblue shrink-0 mt-0.5" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-5 py-5 bg-white border-t-2 border-gray-200">
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
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

        {/* Helpful Resources */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Documentation & Resources
              </h2>
              <p className="text-gray-600">
                Guides, legal templates, compliance docs & video tutorials
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  className="flex items-start gap-4 bg-white p-5 rounded-lg border-2 border-gray-200 hover:border-navyblue hover:shadow-lg transition-all group"
                >
                  <div className="bg-navyblue/10 p-3 rounded-lg group-hover:bg-navyblue group-hover:text-white transition-colors shrink-0">
                    <link.icon className="w-6 h-6 text-navyblue group-hover:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-navyblue">
                      {link.text}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-navyblue shrink-0 mt-1" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Compliance Info */}
        <div className="py-10 bg-linear-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
              <Scale className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">
                Legal Framework & Compliance
              </h3>
              <p className="text-white/90 max-w-3xl mx-auto text-sm">
                Erovians operates under strict EU and international legal
                frameworks to protect all transactions
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                <FileSignature className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold text-sm mb-1">eIDAS Compliant</div>
                <div className="text-xs text-white/80">
                  Electronic signatures
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold text-sm mb-1">GDPR Protected</div>
                <div className="text-xs text-white/80">Data privacy</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold text-sm mb-1">DSA Regulated</div>
                <div className="text-xs text-white/80">
                  Platform transparency
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                <Globe className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold text-sm mb-1">CISG Applied</div>
                <div className="text-xs text-white/80">International B2B</div>
              </div>
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
                Our B2B support team is ready to assist with complex inquiries
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-navyblue hover:shadow-lg transition-all text-center"
                >
                  <div
                    className={`${option.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <option.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-700 font-semibold mb-1">
                    {option.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-5">
                    {option.availability}
                  </p>
                  <button className="bg-navyblue text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors w-full">
                    {option.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Info Banner */}
        <div className="bg-navyblue text-white py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Clock className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-bold mb-2">10-Year Legal Archiving</h3>
                <p className="text-sm text-white/80">
                  All contracts, drawings, and proofs stored as required by EU
                  law
                </p>
              </div>
              <div>
                <Shield className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-bold mb-2">Escrow Payment Protection</h3>
                <p className="text-sm text-white/80">
                  Your funds held securely until delivery confirmed
                </p>
              </div>
              <div>
                <Scale className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-bold mb-2">ICC Arbitration Available</h3>
                <p className="text-sm text-white/80">
                  International dispute resolution for complex cases
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
