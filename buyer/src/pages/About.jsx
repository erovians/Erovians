import React from "react";
import Layout from "../components/common/Layout";
import { assets } from "../assets/assets";
import {
  Shield,
  FileText,
  Users,
  Globe,
  CheckCircle,
  Lock,
  TrendingUp,
  Award,
  Handshake,
  Package,
  DollarSign,
  Clock,
  Target,
  Eye,
  Zap,
  ShieldCheck,
  FileCheck,
  Building2,
  Blocks,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Smart Legal Contracts",
      description:
        "Every transaction is protected by EU-compliant smart contracts with automatic execution and legal archiving for 10 years.",
    },
    {
      icon: Lock,
      title: "Escrow Payment System",
      description:
        "PSD2-certified escrow ensures your funds are secure until delivery is confirmed and verified.",
    },
    {
      icon: FileCheck,
      title: "KYC/KYB Verification",
      description:
        "All buyers and sellers undergo strict verification under EU Anti-Money-Laundering directives for trust and safety.",
    },
    {
      icon: Globe,
      title: "International Trade Ready",
      description:
        "Full support for CISG, Incoterms, customs, and cross-border transactions with automated legal compliance.",
    },
    {
      icon: Package,
      title: "Custom & CNC Orders",
      description:
        "Upload technical drawings (DXF, DWG, STL) with cryptographic hashing to prevent 99% of disputes.",
    },
    {
      icon: ShieldCheck,
      title: "Blockchain Evidence",
      description:
        "Optional blockchain timestamping provides immutable proof of contracts, payments, and deliveries.",
    },
  ];

  const whyChooseUs = [
    {
      icon: CheckCircle,
      title: "Legal Protection",
      text: "GDPR, eIDAS, DSA compliant with 2-year legal guarantee for B2C transactions.",
    },
    {
      icon: Award,
      title: "Industry Standards",
      text: "CE marking, EN 1469 stone standards, and full material compliance certification.",
    },
    {
      icon: Clock,
      title: "Fast Resolution",
      text: "14-day internal mediation followed by ICC arbitration for international disputes.",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      text: "No hidden fees. Clear breakdown of product, VAT, shipping, customs, and platform commission.",
    },
  ];

  const statistics = [
    { number: "10,000+", label: "Verified Suppliers" },
    { number: "50+", label: "Countries Served" },
    { number: "99.2%", label: "Dispute Prevention" },
    { number: "€50M+", label: "Transactions Secured" },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Browse & Select",
      description:
        "Search through thousands of verified stone products or upload custom CAD drawings for made-to-order items.",
    },
    {
      step: "2",
      title: "Smart Contract Created",
      description:
        "Upon order confirmation, an automatic legal contract is generated with all details, cryptographically signed under eIDAS.",
    },
    {
      step: "3",
      title: "Secure Escrow Payment",
      description:
        "Your payment is held securely by a PSD2-licensed provider. Funds are only released after delivery confirmation.",
    },
    {
      step: "4",
      title: "Manufacturing & Shipping",
      description:
        "Seller prepares your order with full compliance to technical specs, CE standards, and agreed delivery timelines.",
    },
    {
      step: "5",
      title: "Delivery & Verification",
      description:
        "Receive your order, verify conformity with photos and documents. Accept or raise concerns within the legal period.",
    },
    {
      step: "6",
      title: "Payment Release & Archive",
      description:
        "Once confirmed, payment is released to seller. All documents are archived for 10 years as legal proof.",
    },
  ];

  const stoneProducts = [
    {
      name: "Italian Carrara Marble",
      image:
        "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=500&q=80",
      category: "Premium Marble",
    },
    {
      name: "Black Granite Slabs",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80",
      category: "Granite",
    },
    {
      name: "White Marble Tiles",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500&q=80",
      category: "Marble Tiles",
    },
    {
      name: "Natural Stone Blocks",
      image:
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=500&q=80",
      category: "Natural Stone",
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-navyblue text-white">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src={assets.logowhite}
                  alt="Erovians Logo"
                  className="h-16 md:h-20 mb-8"
                />
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  The Future of Stone & Marble Trade
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                  Erovians is a B2B digital marketplace built specifically for
                  the natural stone industry, connecting verified buyers and
                  sellers through legally-binding smart contracts and secure
                  escrow payments.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-semibold">EU Legal Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                    <Lock className="w-5 h-5" />
                    <span className="font-semibold">Escrow Protected</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                    <FileCheck className="w-5 h-5" />
                    <span className="font-semibold">Blockchain Verified</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                  alt="Marble and Stone"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gray-50 py-12 md:py-16 border-b">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-navyblue mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Showcase */}
        <div className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Premium Natural Stone Products
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From Italian Carrara marble to exotic granite, we connect you
                with the finest stone suppliers worldwide.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stoneProducts.map((product, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-navyblue">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900">
                      {product.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-navyblue" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Our Mission
                  </h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To revolutionize the stone and marble industry by providing a
                  transparent, legally-compliant digital marketplace where
                  buyers and sellers can trade with confidence. We eliminate
                  fraud, reduce disputes, and ensure every transaction is
                  protected by European law and smart contract technology.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-navyblue" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Our Vision
                  </h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To become the global standard for B2B stone trade, where every
                  transaction is automated, legally binding, and completely
                  transparent. We envision a future where international trade
                  barriers are eliminated through blockchain technology and
                  smart legal contracts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Makes Us Different
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're not just a marketplace. We're a complete legal and
                technical infrastructure for the stone industry.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-navyblue transition-all"
                >
                  <div className="bg-navyblue/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-navyblue" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
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

        {/* How It Works */}
        <div className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Erovians Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From browsing to delivery, every step is automated, secured, and
                legally protected.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-navyblue transition-colors h-full">
                    <div className="bg-navyblue text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-navyblue text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Erovians
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                We provide comprehensive legal and technical protection for
                every transaction.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/80 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Framework */}
        <div className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Built on Legal Foundations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every transaction is governed by international and European
                legal frameworks.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  law: "GDPR",
                  desc: "Full data protection compliance (EU 2016/679)",
                },
                {
                  law: "eIDAS",
                  desc: "Electronic signatures legally binding (EU 910/2014)",
                },
                {
                  law: "DSA",
                  desc: "Digital Services Act compliance (EU 2022/2065)",
                },
                {
                  law: "CISG",
                  desc: "International sales of goods convention",
                },
                {
                  law: "Consumer Rights",
                  desc: "14-day withdrawal, 2-year guarantee (EU 2011/83)",
                },
                {
                  law: "P2B Regulation",
                  desc: "Platform-to-business transparency (EU 2019/1150)",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-navyblue transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-navyblue shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item.law}
                      </h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products We Handle */}
        <div className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What We Trade
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From ready-to-go slabs to custom CNC-cut pieces, we handle all
                types of natural stone products.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Marble", icon: Blocks },
                { name: "Granite", icon: Blocks },
                { name: "Natural Stone", icon: Blocks },
                { name: "Composite Stone", icon: Blocks },
                { name: "Custom CNC Cutting", icon: Package },
                { name: "Made-to-Order Slabs", icon: FileCheck },
                { name: "Construction Materials", icon: Building2 },
                { name: "Stone Accessories", icon: Package },
              ].map((product, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg text-center hover:border-navyblue hover:shadow-md transition-all"
                >
                  <product.icon className="w-12 h-12 text-navyblue mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-navyblue text-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Trade with Confidence?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of verified buyers and sellers trading marble,
              granite, and natural stone on the world's most secure B2B
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-navyblue px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                Browse Products
              </button>
              <button className="bg-yellow-500 text-navyblue px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors">
                Become A Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
