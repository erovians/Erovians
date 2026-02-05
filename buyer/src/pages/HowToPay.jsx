import React, { useState } from "react";
import Layout from "../components/common/Layout";
import { assets } from "../assets/assets";
import {
  CreditCard,
  Building2,
  Wallet,
  Lock,
  Shield,
  CheckCircle,
  Clock,
  DollarSign,
  Euro,
  Globe,
  ArrowRight,
  FileText,
  AlertCircle,
  Info,
  Zap,
  TrendingUp,
  Package,
  Truck,
  RefreshCw,
  Award,
  ShieldCheck,
  Banknote,
  Smartphone,
  QrCode,
  Calculator,
} from "lucide-react";

const HowToPay = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    {
      id: "card",
      icon: CreditCard,
      title: "Credit / Debit Card",
      subtitle: "Visa, Mastercard, American Express",
      processing: "Instant",
      fees: "2.5% + €0.25",
      popular: true,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      features: [
        "Instant payment confirmation",
        "3D Secure authentication",
        "International cards accepted",
        "PCI DSS Level 1 compliant",
      ],
    },
    {
      id: "bank",
      icon: Building2,
      title: "Bank Transfer (SEPA)",
      subtitle: "Direct bank-to-bank transfer",
      processing: "1-3 business days",
      fees: "€0 - €5",
      popular: true,
      color: "bg-green-50 text-green-600 border-green-200",
      features: [
        "Lower transaction fees",
        "Ideal for large orders",
        "SEPA supported (EU)",
        "SWIFT for international",
      ],
    },
    {
      id: "crypto",
      icon: Wallet,
      title: "Cryptocurrency",
      subtitle: "Bitcoin, Ethereum, USDT",
      processing: "10-30 minutes",
      fees: "Network fees only",
      popular: false,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      features: [
        "Blockchain verified",
        "No chargebacks",
        "Lower fees for large amounts",
        "Global acceptance",
      ],
    },
    {
      id: "wire",
      icon: Globe,
      title: "International Wire",
      subtitle: "SWIFT transfer worldwide",
      processing: "3-5 business days",
      fees: "€15 - €50",
      popular: false,
      color: "bg-orange-50 text-orange-600 border-orange-200",
      features: [
        "Any country supported",
        "Multi-currency",
        "Bank-level security",
        "For high-value orders",
      ],
    },
    {
      id: "invoice",
      icon: FileText,
      title: "Invoice (Net 30/60)",
      subtitle: "For verified business clients",
      processing: "Credit approval required",
      fees: "0%",
      popular: false,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
      features: [
        "Payment terms available",
        "Credit line up to €100k",
        "KYB verification required",
        "Bulk order discounts",
      ],
    },
  ];

  const paymentSteps = [
    {
      step: "1",
      title: "Select Products & Get Quote",
      description:
        "Browse products or post RFQ. Receive detailed quotations from verified sellers.",
      icon: Package,
    },
    {
      step: "2",
      title: "Review Price Breakdown",
      description:
        "See complete cost: product price, VAT, shipping, handling, customs estimate, and platform fee.",
      icon: Calculator,
    },
    {
      step: "3",
      title: "Choose Payment Method",
      description:
        "Select from card, bank transfer, crypto, or invoice. All methods are secure and PSD2 compliant.",
      icon: CreditCard,
    },
    {
      step: "4",
      title: "Payment Goes to Escrow",
      description:
        "Your funds are held by a licensed payment provider. Seller cannot access until delivery confirmed.",
      icon: Lock,
    },
    {
      step: "5",
      title: "Smart Contract Generated",
      description:
        "Legal contract auto-created with all details, cryptographically signed under eIDAS regulation.",
      icon: FileText,
    },
    {
      step: "6",
      title: "Seller Ships Order",
      description:
        "Manufacturing and shipping begins. You receive tracking information and delivery updates.",
      icon: Truck,
    },
    {
      step: "7",
      title: "Confirm Delivery",
      description:
        "Inspect your order. Confirm receipt or raise concerns within the legal inspection period.",
      icon: CheckCircle,
    },
    {
      step: "8",
      title: "Payment Released",
      description:
        "Once confirmed, escrow releases payment to seller. If disputed, funds stay locked until resolution.",
      icon: DollarSign,
    },
  ];

  const priceBreakdown = [
    { label: "Product Unit Price", value: "€1,200.00", icon: Package },
    { label: "Quantity", value: "10 units", icon: Calculator },
    { label: "Subtotal (excl. VAT)", value: "€12,000.00", icon: DollarSign },
    { label: "VAT (21% - Belgium)", value: "€2,520.00", icon: FileText },
    { label: "Shipping Fee", value: "€450.00", icon: Truck },
    { label: "Handling Fee (Heavy Stone)", value: "€150.00", icon: Package },
    { label: "Customs Estimate (Non-EU)", value: "€0.00", icon: Globe },
    { label: "Platform Commission (3.5%)", value: "€420.00", icon: Award },
  ];

  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: "PSD2 Compliant",
      description:
        "All payments processed through EU-licensed payment institutions",
    },
    {
      icon: Lock,
      title: "SSL Encrypted",
      description: "256-bit encryption for all transactions and data transfer",
    },
    {
      icon: Shield,
      title: "Escrow Protection",
      description: "Funds held securely until delivery confirmation",
    },
    {
      icon: FileText,
      title: "Legal Documentation",
      description:
        "Every payment generates legal contract archived for 10 years",
    },
  ];

  const faqs = [
    {
      q: "When is my payment charged?",
      a: "Payment is charged immediately upon order confirmation. However, funds are held in escrow and only released to the seller after you confirm delivery.",
    },
    {
      q: "Is my payment information secure?",
      a: "Yes. We use PSD2-licensed payment providers with bank-level security. Erovians never stores your full card details. All transactions are encrypted and PCI DSS Level 1 compliant.",
    },
    {
      q: "What happens if I don't receive my order?",
      a: "Your payment stays in escrow. If you don't receive your order or it doesn't match specifications, you can open a dispute. The funds remain locked until resolution through mediation or arbitration.",
    },
    {
      q: "Can I get a refund?",
      a: "For ready-to-go products: Yes, within 14 days (EU consumer right). For custom/made-to-order: No, as they're personalized. In case of non-conformity or damage, dispute resolution determines refund eligibility.",
    },
    {
      q: "Are there additional fees for international payments?",
      a: "Currency conversion fees may apply (typically 2-3%). For SWIFT transfers, your bank may charge additional fees. We show all Erovians fees transparently at checkout.",
    },
    {
      q: "Do you support payment in installments?",
      a: "For large B2B orders (€50k+), we offer payment terms (Net 30/60) after credit approval and KYB verification. Contact our sales team for details.",
    },
  ];

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
                How to Pay on Erovians
              </h1>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Secure, transparent, and flexible payment options for B2B stone
                trade. Every payment is protected by escrow and smart legal
                contracts.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8 max-w-xl mx-auto">
                <div className="bg-white/10 p-3 rounded-lg">
                  <Lock className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xs text-white/80">100% Secure</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <Shield className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xs text-white/80">Escrow Protected</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <Globe className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xs text-white/80">Multi-Currency</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Accepted Payment Methods
              </h2>
              <p className="text-gray-600">
                Choose the payment option that works best for your business
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`${
                    method.color
                  } border-2 p-5 rounded-lg hover:shadow-lg transition-all cursor-pointer relative ${
                    selectedMethod === method.id ? "ring-2 ring-navyblue" : ""
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  {method.popular && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-navyblue px-3 py-1 rounded-full text-xs font-bold">
                      Popular
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white p-2.5 rounded-lg">
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {method.title}
                      </h3>
                      <p className="text-xs text-gray-600">{method.subtitle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/50 p-2 rounded">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-semibold text-gray-700">
                          Processing
                        </span>
                      </div>
                      <p className="text-xs text-gray-900 font-medium">
                        {method.processing}
                      </p>
                    </div>
                    <div className="bg-white/50 p-2 rounded">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-semibold text-gray-700">
                          Fees
                        </span>
                      </div>
                      <p className="text-xs text-gray-900 font-medium">
                        {method.fees}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {method.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Process Steps */}
        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Payment Process: Step by Step
              </h2>
              <p className="text-gray-600">
                How your payment is processed and protected
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {paymentSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gray-50 border-2 border-gray-200 p-5 rounded-lg hover:border-navyblue transition-all h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-navyblue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                        {step.step}
                      </div>
                      <step.icon className="w-6 h-6 text-navyblue" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < paymentSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2.5 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-5 h-5 text-navyblue" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Breakdown Example */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Transparent Price Breakdown
              </h2>
              <p className="text-gray-600">
                See exactly what you're paying for - no hidden fees
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-navyblue text-white p-5">
                <h3 className="font-bold text-lg mb-1">
                  Order #ERV-2024-12345
                </h3>
                <p className="text-sm text-white/80">
                  Carrara White Marble - Custom Cut
                </p>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  {priceBreakdown.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-navyblue">
                      €15,540.00
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Currency: EUR • Payment secured by escrow
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border-t-2 border-green-200 p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Payment Protection:</strong> This amount will be
                      held in escrow until you confirm delivery. If there's any
                      issue, your payment is protected until resolution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Payment Security & Protection
              </h2>
              <p className="text-gray-600">
                Your payments are protected by multiple layers of security
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-center"
                >
                  <div className="bg-navyblue/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-navyblue" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Escrow Visual Explanation */}
        <div className="py-12 md:py-16 bg-navyblue text-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                How Escrow Protects Your Payment
              </h2>
              <p className="text-lg text-white/90">
                Your money is safe until you confirm delivery
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {[
                {
                  icon: CreditCard,
                  title: "You Pay",
                  desc: "Payment via your chosen method",
                },
                {
                  icon: Lock,
                  title: "Escrow Holds",
                  desc: "Licensed provider secures funds",
                },
                {
                  icon: Truck,
                  title: "Seller Ships",
                  desc: "Product is manufactured & shipped",
                },
                {
                  icon: CheckCircle,
                  title: "You Confirm",
                  desc: "Inspect and approve delivery",
                },
                {
                  icon: DollarSign,
                  title: "Released",
                  desc: "Seller receives payment",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-white/10 p-4 rounded-lg text-center"
                >
                  <step.icon className="w-8 h-8 mx-auto mb-3" />
                  <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-white/80">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white/10 border border-white/20 p-5 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-2">Complete Protection</h4>
                  <p className="text-sm text-white/90 leading-relaxed">
                    If you don't receive your order, or if it doesn't match the
                    specifications in the smart contract, the payment stays in
                    escrow. Our mediation team and ICC arbitration ensure fair
                    resolution. Erovians never touches your money - it's held by
                    a PSD2-licensed financial institution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Payment FAQs
              </h2>
              <p className="text-gray-600">
                Common questions about payments on Erovians
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
                >
                  <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2 text-sm">
                    <AlertCircle className="w-5 h-5 text-navyblue shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-navyblue text-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Place Your Order?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Browse products or post an RFQ to get started with secure,
              escrow-protected payments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-navyblue px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Browse Products
              </button>
              <button className="bg-yellow-500 text-navyblue px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Post RFQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowToPay;
