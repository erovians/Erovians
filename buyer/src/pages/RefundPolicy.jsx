import React from "react";
import Layout from "../components/common/Layout";
import { assets } from "../assets/assets";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  AlertTriangle,
  FileCheck,
  Package,
  CreditCard,
  ArrowRight,
  Info,
  DollarSign,
  Calendar,
  Truck,
  Settings,
  Users,
  Lock,
} from "lucide-react";

const RefundPolicy = () => {
  const refundTypes = [
    {
      icon: CheckCircle,
      title: "Standard Products",
      description: "Ready-to-go items eligible for 14-day withdrawal",
      eligible: true,
      color: "bg-green-50 border-green-200 text-green-600",
    },
    {
      icon: Settings,
      title: "Custom/Made-to-Order",
      description: "Personalized products (CNC, stone cutting)",
      eligible: false,
      color: "bg-red-50 border-red-200 text-red-600",
    },
    {
      icon: Package,
      title: "Damaged in Transit",
      description: "Products damaged during shipping",
      eligible: true,
      color: "bg-blue-50 border-blue-200 text-blue-600",
    },
    {
      icon: XCircle,
      title: "Non-Conforming Products",
      description: "Items not matching description or specifications",
      eligible: true,
      color: "bg-purple-50 border-purple-200 text-purple-600",
    },
  ];

  const refundProcess = [
    {
      step: "1",
      icon: FileCheck,
      title: "Submit Request",
      description:
        "Log into your account and go to 'My Orders'. Click on the order and select 'Request Refund'.",
      timeline: "Within 14 days of delivery",
    },
    {
      step: "2",
      icon: AlertTriangle,
      title: "Provide Evidence",
      description:
        "Upload photos, describe the issue, and attach any relevant documents (invoice, delivery note).",
      timeline: "Required documentation",
    },
    {
      step: "3",
      icon: Users,
      title: "Seller Review",
      description:
        "The seller has 5 business days to review your request and respond with acceptance or dispute.",
      timeline: "5 business days",
    },
    {
      step: "4",
      icon: Shield,
      title: "Platform Mediation",
      description:
        "If disputed, Erovians mediates between parties. Evidence is reviewed and a decision is made.",
      timeline: "7-14 days",
    },
    {
      step: "5",
      icon: Package,
      title: "Return Shipping",
      description:
        "For approved refunds, ship the product back using the provided return label or instructions.",
      timeline: "10 days after approval",
    },
    {
      step: "6",
      icon: CreditCard,
      title: "Refund Issued",
      description:
        "Once seller confirms receipt, escrow releases funds back to your original payment method.",
      timeline: "3-5 business days",
    },
  ];

  const legalBasis = [
    {
      icon: FileCheck,
      title: "EU Directive 2011/83/EU",
      description: "Consumer Rights Directive - 14-day withdrawal period",
    },
    {
      icon: Shield,
      title: "EU Directive 2019/771",
      description: "Legal guarantee of conformity (2 years B2C)",
    },
    {
      icon: Lock,
      title: "Smart Contract Protection",
      description: "Escrow system holds funds until delivery confirmation",
    },
  ];

  const importantNotes = [
    {
      icon: AlertTriangle,
      title: "Custom Products Exception",
      description:
        "Made-to-order, CNC-cut, or personalized products are excluded from withdrawal rights under EU law (Article 16c).",
      color: "border-red-200 bg-red-50",
    },
    {
      icon: Truck,
      title: "Return Shipping Costs",
      description:
        "For standard withdrawals, buyer pays return shipping. For defects/damage, seller covers costs.",
      color: "border-blue-200 bg-blue-50",
    },
    {
      icon: Clock,
      title: "Processing Time",
      description:
        "Refunds typically take 3-5 business days after seller confirms receipt. International transfers may take longer.",
      color: "border-yellow-200 bg-yellow-50",
    },
    {
      icon: Info,
      title: "Natural Stone Variations",
      description:
        "Color, veining, and texture variations in natural stone are not considered defects and are not refundable.",
      color: "border-purple-200 bg-purple-50",
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-navyblue text-white">
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
            <div className="text-center">
              <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-10 h-10" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Refund & Return Policy
              </h1>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                Transparent refund process based on EU consumer protection laws
                and our Smart Contract system
              </p>
              <div className="mt-6 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                <Calendar className="w-4 h-4" />
                <span>Last Updated: February 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Refund Eligibility
              </h2>
              <p className="text-gray-600">
                Different product types have different refund policies
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {refundTypes.map((type, index) => (
                <div
                  key={index}
                  className={`${type.color} border-2 p-5 rounded-lg hover:shadow-md transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-white p-2 rounded-lg">
                      <type.icon className="w-6 h-6" />
                    </div>
                    {type.eligible ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">
                    {type.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {type.description}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <span
                      className={`text-xs font-semibold ${
                        type.eligible ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {type.eligible ? "✓ Refundable" : "✗ Not Refundable"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refund Process */}
        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                How to Request a Refund
              </h2>
              <p className="text-gray-600">
                Step-by-step process for requesting and receiving refunds
              </p>
            </div>

            <div className="space-y-6">
              {refundProcess.map((process, index) => (
                <div
                  key={index}
                  className="flex gap-4 bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-navyblue transition-all group"
                >
                  <div className="shrink-0">
                    <div className="bg-navyblue text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      {process.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg border border-gray-200">
                          <process.icon className="w-5 h-5 text-navyblue" />
                        </div>
                        <h3 className="font-bold text-gray-900">
                          {process.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {process.timeline}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed ml-11">
                      {process.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Framework */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Legal Framework
              </h2>
              <p className="text-gray-600">
                Our refund policy is based on EU consumer protection laws
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {legalBasis.map((legal, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-navyblue hover:shadow-md transition-all text-center"
                >
                  <div className="bg-navyblue/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <legal.icon className="w-7 h-7 text-navyblue" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {legal.title}
                  </h3>
                  <p className="text-sm text-gray-600">{legal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Important Information
              </h2>
              <p className="text-gray-600">
                Key points to know before requesting a refund
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {importantNotes.map((note, index) => (
                <div
                  key={index}
                  className={`${note.color} border-2 p-6 rounded-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shrink-0">
                      <note.icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {note.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Escrow Protection Info */}
        <div className="py-12 bg-navyblue text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Your Payment is Protected
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              All payments are held in escrow by a PSD2-certified payment
              provider. Funds are only released to the seller after you confirm
              delivery or the dispute is resolved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Lock className="w-4 h-4" />
                <span>Secure Escrow</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <FileCheck className="w-4 h-4" />
                <span>Smart Contract</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <DollarSign className="w-4 h-4" />
                <span>Full Refund Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help with a Refund?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to guide you through the process
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-navyblue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Request a Refund
              </button>
              <button className="bg-white text-navyblue px-6 py-3 rounded-lg font-semibold border-2 border-navyblue hover:bg-navyblue hover:text-white transition-colors flex items-center gap-2">
                <Info className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RefundPolicy;
