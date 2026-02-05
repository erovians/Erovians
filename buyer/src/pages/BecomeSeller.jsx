import React, { useState } from "react";
import Layout from "../components/common/Layout";
import { assets } from "../assets/assets";
import {
  Store,
  Building2,
  User,
  CheckCircle,
  ArrowRight,
  Shield,
  DollarSign,
  Globe,
  TrendingUp,
  Users,
  Package,
  FileCheck,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Upload,
  Hash,
  Calendar,
  Briefcase,
  Target,
  Zap,
  Award,
  BarChart3,
  Lock,
  Clock,
  AlertCircle,
  Info,
  ChevronRight,
  CheckSquare,
  FileText,
  Image,
  Smartphone,
} from "lucide-react";

const BecomeSeller = () => {
  const [selectedType, setSelectedType] = useState(null);

  const sellerTypes = [
    {
      type: "professional",
      icon: Building2,
      title: "Professional Seller",
      subtitle: "For Companies & Businesses",
      description:
        "Register your company and start selling marble, granite, and natural stones professionally",
      features: [
        "Company verification (KYB)",
        "VAT/Tax registration required",
        "Multiple user accounts",
        "Higher selling limits",
        "Priority support",
        "Custom branding",
      ],
      requirements: [
        "Company registration number",
        "VAT/SIRET/BCE/RC number",
        "Legal business address",
        "Company documents",
        "Business license",
      ],
      color: "bg-blue-50 border-blue-200 text-blue-600",
      badge: "Most Popular",
      badgeColor: "bg-blue-600",
    },
    {
      type: "individual",
      icon: User,
      title: "Individual Seller",
      subtitle: "For Solo Entrepreneurs",
      description:
        "Sell as an individual without company registration. Perfect for small-scale sellers",
      features: [
        "Personal verification (KYC)",
        "Quick registration",
        "Single user account",
        "Standard selling limits",
        "Email support",
        "Basic profile",
      ],
      requirements: [
        "Valid ID proof",
        "Personal address",
        "Phone verification",
        "Bank account details",
      ],
      color: "bg-purple-50 border-purple-200 text-purple-600",
      badge: "Quick Start",
      badgeColor: "bg-purple-600",
    },
  ];

  const registrationSteps = [
    {
      step: "1",
      icon: Smartphone,
      title: "Mobile Verification",
      description: "Enter your phone number and verify with OTP code",
      duration: "2 min",
      fields: [
        { icon: Phone, label: "Mobile Number", type: "tel" },
        { icon: Hash, label: "6-Digit OTP", type: "text" },
      ],
    },
    {
      step: "2",
      icon: User,
      title: "Basic Information",
      description: "Provide your name, email, and address",
      duration: "3 min",
      fields: [
        { icon: User, label: "Full Name / Company Name", type: "text" },
        { icon: Mail, label: "Email Address", type: "email" },
        { icon: MapPin, label: "Street Address", type: "text" },
        { icon: Building, label: "City", type: "text" },
        { icon: Globe, label: "Country/Region", type: "select" },
        { icon: Hash, label: "Postal Code", type: "text" },
      ],
    },
    {
      step: "3",
      icon: Building2,
      title: "Business Details",
      description: "Company registration and legal information",
      duration: "5 min",
      professional: true,
      fields: [
        {
          icon: Building2,
          label: "Company Registration Number",
          type: "text",
          required: true,
        },
        {
          icon: Hash,
          label: "VAT/SIRET/BCE/RC Number",
          type: "text",
          required: true,
        },
        {
          icon: User,
          label: "Legal Owner Name",
          type: "text",
          required: false,
        },
        {
          icon: MapPin,
          label: "Location of Registration",
          type: "text",
          required: true,
        },
        {
          icon: Calendar,
          label: "Company Registration Year",
          type: "text",
          required: false,
        },
      ],
    },
    {
      step: "4",
      icon: Upload,
      title: "Document Upload",
      description: "Upload company documents and ID verification",
      duration: "4 min",
      documents: [
        {
          icon: FileText,
          label: "Company Registration Certificate",
          required: true,
          professional: true,
        },
        {
          icon: FileCheck,
          label: "VAT Registration Document",
          required: true,
          professional: true,
        },
        { icon: Image, label: "Company Logo", required: false },
        {
          icon: User,
          label: "Owner ID Proof (Passport/Driver License)",
          required: true,
        },
      ],
    },
    {
      step: "5",
      icon: CreditCard,
      title: "Payment Details",
      description: "Add bank account for receiving payments",
      duration: "3 min",
      fields: [
        { icon: Building, label: "Bank Name", type: "text" },
        { icon: Hash, label: "Account Number", type: "text" },
        { icon: Hash, label: "IBAN", type: "text" },
        { icon: Hash, label: "SWIFT/BIC Code", type: "text" },
      ],
    },
    {
      step: "6",
      icon: CheckCircle,
      title: "Review & Submit",
      description: "Review all information and submit for verification",
      duration: "2 min",
      final: true,
    },
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access buyers from 150+ countries",
      stat: "150+",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Escrow-protected transactions",
      stat: "100%",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Increase sales by average 3x",
      stat: "3x",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Lock,
      title: "Legal Protection",
      description: "Smart contracts & KYC verified",
      stat: "Legal",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const features = [
    {
      icon: Package,
      title: "Product Management",
      description:
        "Easy-to-use dashboard for managing products, inventory, and custom orders",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description:
        "Track sales, view insights, and optimize your selling strategy",
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Handle RFQs, quotations, and customer communications",
    },
    {
      icon: Zap,
      title: "Fast Onboarding",
      description:
        "Get verified and start selling within 24-48 hours of submission",
    },
    {
      icon: Award,
      title: "Seller Verification Badge",
      description: "Build trust with KYC/KYB verified seller badge",
    },
    {
      icon: DollarSign,
      title: "Competitive Fees",
      description: "Low commission rates (3-5%) with transparent pricing",
    },
  ];

  const requirements = [
    {
      icon: CheckSquare,
      title: "Eligibility",
      points: [
        "Must be 18+ years old (individual)",
        "Valid business registration (professional)",
        "Ability to fulfill orders and ship internationally",
        "Compliance with EU/international trade laws",
      ],
    },
    {
      icon: FileCheck,
      title: "Required Documents",
      points: [
        "Government-issued ID (passport/driver license)",
        "Company registration certificate (professional)",
        "VAT/tax registration number (professional)",
        "Bank account proof (statement or void check)",
        "Business license (if applicable)",
      ],
    },
    {
      icon: Clock,
      title: "Timeline",
      points: [
        "Registration: 15-20 minutes",
        "Document review: 24-48 hours",
        "KYC/KYB verification: 2-5 business days",
        "Account activation: Immediate after approval",
      ],
    },
  ];

  const faqs = [
    {
      q: "How long does verification take?",
      a: "Typically 24-48 hours for document review, and 2-5 business days for full KYC/KYB verification.",
    },
    {
      q: "What are the selling fees?",
      a: "We charge a 3-5% commission on each sale. No listing fees, no monthly subscriptions.",
    },
    {
      q: "Can I sell custom/made-to-order products?",
      a: "Yes! You can offer CNC cutting, stone fabrication, and custom orders with technical drawing uploads.",
    },
    {
      q: "How do I receive payments?",
      a: "Payments are held in escrow and released to your bank account after buyer confirms delivery.",
    },
    {
      q: "Do I need a company to sell?",
      a: "No. You can register as an individual seller. However, professional (company) sellers get higher limits and priority support.",
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-navyblue text-white">
          <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Join 5,000+ Verified Sellers</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Start Selling on Erovians
                </h1>
                <p className="text-lg text-white/90 mb-8">
                  Reach global buyers, grow your marble & stone business with
                  our secure, transparent platform
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-navyblue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Register Now
                  </button>
                  <button className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur p-6 rounded-lg border border-white/20"
                  >
                    <div
                      className={`${benefit.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
                    >
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold mb-1">
                      {benefit.stat}
                    </div>
                    <div className="text-sm font-semibold mb-1">
                      {benefit.title}
                    </div>
                    <div className="text-xs text-white/70">
                      {benefit.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Choose Seller Type */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Choose Your Seller Type
              </h2>
              <p className="text-gray-600">
                Select the option that best fits your business
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {sellerTypes.map((seller, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedType(seller.type)}
                  className={`${
                    seller.color
                  } border-2 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all ${
                    selectedType === seller.type
                      ? "ring-4 ring-offset-2 ring-navyblue scale-105"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-white p-3 rounded-lg">
                      <seller.icon className="w-8 h-8" />
                    </div>
                    <span
                      className={`${seller.badgeColor} text-white text-xs px-3 py-1 rounded-full font-semibold`}
                    >
                      {seller.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {seller.title}
                  </h3>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {seller.subtitle}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {seller.description}
                  </p>

                  <div className="border-t border-gray-300 pt-4 mb-4">
                    <h4 className="font-bold text-sm text-gray-900 mb-2">
                      Features:
                    </h4>
                    <ul className="space-y-2">
                      {seller.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-gray-700"
                        >
                          <CheckCircle className="w-4 h-4 shrink-0 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/60 rounded-lg p-3">
                    <h4 className="font-bold text-xs text-gray-900 mb-2">
                      Requirements:
                    </h4>
                    <ul className="space-y-1">
                      {seller.requirements.map((req, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs text-gray-700"
                        >
                          <ChevronRight className="w-3 h-3 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className={`w-full mt-4 ${
                      selectedType === seller.type
                        ? "bg-navyblue text-white"
                        : "bg-white text-gray-700"
                    } px-4 py-3 rounded-lg font-semibold hover:bg-navyblue hover:text-white transition-colors flex items-center justify-center gap-2`}
                  >
                    {selectedType === seller.type ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Selected
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        Choose This
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registration Process */}
        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Registration Process
              </h2>
              <p className="text-gray-600">
                Complete these simple steps to become a verified seller
              </p>
            </div>

            <div className="space-y-6">
              {registrationSteps.map((step, index) => (
                <div
                  key={index}
                  className={`bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:border-navyblue transition-all ${
                    step.professional && selectedType !== "professional"
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="bg-navyblue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-3">
                        {step.step}
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-200 mx-auto w-12">
                        <step.icon className="w-8 h-8 text-navyblue" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {step.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {step.duration}
                        </div>
                      </div>

                      {step.professional && selectedType !== "professional" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-yellow-800">
                            <Info className="w-4 h-4" />
                            <span className="font-semibold">
                              Professional Sellers Only
                            </span>
                          </div>
                        </div>
                      )}

                      {step.fields && (
                        <div className="grid md:grid-cols-2 gap-3 mt-4">
                          {step.fields.map((field, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3"
                            >
                              <div className="bg-gray-100 p-2 rounded">
                                <field.icon className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-gray-500">
                                  {field.label}
                                </div>
                              </div>
                              {field.required && (
                                <span className="text-xs text-red-600 font-semibold">
                                  *
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {step.documents && (
                        <div className="grid md:grid-cols-2 gap-3 mt-4">
                          {step.documents
                            .filter(
                              (doc) =>
                                !doc.professional ||
                                selectedType === "professional"
                            )
                            .map((doc, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3"
                              >
                                <div className="bg-blue-50 p-2 rounded">
                                  <doc.icon className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs text-gray-700 font-medium">
                                    {doc.label}
                                  </div>
                                </div>
                                {doc.required && (
                                  <span className="text-xs text-red-600 font-semibold">
                                    Required
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {step.final && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                            <div>
                              <h4 className="font-bold text-sm text-green-900 mb-1">
                                Almost Done!
                              </h4>
                              <p className="text-xs text-green-800">
                                Review all your information carefully. Once
                                submitted, our team will verify your documents
                                within 24-48 hours.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Why Sell on Erovians?
              </h2>
              <p className="text-gray-600">
                Everything you need to grow your stone business
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-navyblue hover:shadow-md transition-all"
                >
                  <div className="bg-navyblue/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-navyblue" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Seller Requirements
              </h2>
              <p className="text-gray-600">
                What you need to know before registering
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6"
                >
                  <div className="bg-white p-3 rounded-lg w-fit mb-4">
                    <req.icon className="w-7 h-7 text-navyblue" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-4">{req.title}</h3>
                  <ul className="space-y-2">
                    {req.points.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <ChevronRight className="w-4 h-4 shrink-0 text-navyblue mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-5"
                >
                  <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-navyblue shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-sm text-gray-600 ml-7">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-12 md:py-16 bg-navyblue text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of verified sellers and grow your business on
              Erovians
            </p>
            <button className="bg-white text-navyblue px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-3">
              <Store className="w-6 h-6" />
              Register as Seller
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-white/70 mt-4">
              No setup fees • No monthly charges • Only pay commission on sales
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BecomeSeller;
