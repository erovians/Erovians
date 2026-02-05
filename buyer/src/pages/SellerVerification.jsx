import React, { useState } from "react";
import Layout from "../components/common/Layout";
import { assets } from "../assets/assets";
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  FileCheck,
  AlertTriangle,
  User,
  Building2,
  Upload,
  Search,
  Mail,
  Phone,
  Smartphone,
  Hash,
  Lock,
  Award,
  Eye,
  ThumbsUp,
  XCircle,
  RefreshCw,
  ArrowRight,
  Info,
  FileText,
  Image,
  CreditCard,
  Globe,
  Calendar,
  Target,
  Zap,
  CheckSquare,
  AlertCircle,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

const SellerVerification = () => {
  const [activeTab, setActiveTab] = useState("process");

  const verificationSteps = [
    {
      step: "1",
      icon: Smartphone,
      title: "Register & OTP Verification",
      description:
        "Create account on seller subdomain with mobile verification",
      duration: "2-3 minutes",
      status: "Instant",
      details: [
        "Visit seller.erovians.com or seller portal",
        "Choose seller type (Professional/Individual)",
        "Enter mobile number",
        "Verify 6-digit OTP code",
        "Set password and create account",
      ],
      color: "bg-blue-50 border-blue-200",
    },
    {
      step: "2",
      icon: FileText,
      title: "Submit Company Details",
      description: "Provide complete business information and documentation",
      duration: "15-20 minutes",
      status: "User Action Required",
      details: [
        "Fill company basic information form",
        "Enter company registration number",
        "Provide VAT/SIRET/BCE/RC number",
        "Add legal owner details",
        "Enter business address and contact info",
      ],
      color: "bg-purple-50 border-purple-200",
    },
    {
      step: "3",
      icon: Upload,
      title: "Upload Verification Documents",
      description: "Submit required legal and identity documents",
      duration: "10-15 minutes",
      status: "User Action Required",
      details: [
        "Company Registration Certificate (PDF)",
        "VAT Registration Document",
        "Owner ID Proof (Passport/Driver License)",
        "Business License (if applicable)",
        "Bank Account Proof",
        "Company Logo (optional)",
      ],
      color: "bg-green-50 border-green-200",
    },
    {
      step: "4",
      icon: Search,
      title: "Erovians Team Review",
      description:
        "Our compliance team verifies your documents and information",
      duration: "24-48 hours",
      status: "Erovians Processing",
      details: [
        "Document authenticity verification",
        "Company registration validation",
        "Cross-check with government databases",
        "KYC/KYB compliance check",
        "Background verification",
        "Anti-money laundering (AML) screening",
      ],
      color: "bg-orange-50 border-orange-200",
    },
    {
      step: "5",
      icon: Mail,
      title: "Verification Response",
      description: "Receive approval or feedback via email",
      duration: "Immediate after review",
      status: "Erovians Response",
      details: [
        "Email notification sent to registered email",
        "SMS notification to registered mobile",
        "Status visible in seller dashboard",
        "If approved: Account activated instantly",
        "If rejected: Detailed feedback provided",
        "If info needed: Specific requirements listed",
      ],
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      step: "6",
      icon: CheckCircle,
      title: "Account Activation",
      description: "Start selling with verified seller badge",
      duration: "Instant",
      status: "Complete",
      details: [
        "Verified seller badge on profile",
        "Access to full seller dashboard",
        "Ability to list products",
        "Receive and respond to RFQs",
        "Manage orders and quotations",
        "Start building your reputation",
      ],
      color: "bg-green-50 border-green-200",
    },
  ];

  const requiredDocuments = [
    {
      icon: Building2,
      title: "Company Registration Certificate",
      description: "Official certificate from government registry",
      format: "PDF, JPG, PNG",
      required: true,
      professional: true,
      note: "Must be valid and not expired",
    },
    {
      icon: FileCheck,
      title: "VAT/Tax Registration",
      description: "VAT, SIRET, BCE, or RC number document",
      format: "PDF, JPG, PNG",
      required: true,
      professional: true,
      note: "Required for professional sellers",
    },
    {
      icon: User,
      title: "Owner ID Proof",
      description: "Passport, National ID, or Driver License",
      format: "PDF, JPG, PNG",
      required: true,
      professional: false,
      note: "Government-issued photo ID required",
    },
    {
      icon: FileText,
      title: "Business License",
      description: "Trade license or business permit",
      format: "PDF, JPG, PNG",
      required: false,
      professional: true,
      note: "If applicable in your country/region",
    },
    {
      icon: CreditCard,
      title: "Bank Account Proof",
      description: "Bank statement or void check",
      format: "PDF",
      required: true,
      professional: false,
      note: "Must show company/owner name and account number",
    },
    {
      icon: Image,
      title: "Company Logo",
      description: "High-resolution company logo",
      format: "PNG, JPG, SVG",
      required: false,
      professional: true,
      note: "Recommended for better brand presence",
    },
  ];

  const verificationStatuses = [
    {
      status: "Approved",
      icon: CheckCircle,
      color: "bg-green-50 border-green-500 text-green-700",
      iconColor: "text-green-600",
      description:
        "Congratulations! Your seller account is verified and active.",
      action: "Start Selling",
      timeline: "Instant",
    },
    {
      status: "Under Review",
      icon: Clock,
      color: "bg-blue-50 border-blue-500 text-blue-700",
      iconColor: "text-blue-600",
      description: "Our team is reviewing your documents. Please wait.",
      action: "Track Status",
      timeline: "24-48 hours",
    },
    {
      status: "More Info Needed",
      icon: AlertCircle,
      color: "bg-yellow-50 border-yellow-500 text-yellow-700",
      iconColor: "text-yellow-600",
      description:
        "Additional documents or information required. Check your email.",
      action: "Submit Info",
      timeline: "Action Required",
    },
    {
      status: "Rejected",
      icon: XCircle,
      color: "bg-red-50 border-red-500 text-red-700",
      iconColor: "text-red-600",
      description:
        "Verification unsuccessful. Review feedback and resubmit if eligible.",
      action: "View Feedback",
      timeline: "Resubmit Available",
    },
  ];

  const whyVerification = [
    {
      icon: ShieldCheck,
      title: "Trust & Safety",
      description:
        "Verification ensures all sellers are legitimate businesses, protecting buyers from fraud.",
    },
    {
      icon: Lock,
      title: "Legal Compliance",
      description:
        "Required under EU KYC/KYB and Anti-Money-Laundering regulations.",
    },
    {
      icon: Award,
      title: "Verified Badge",
      description:
        "Display a trusted seller badge, increasing buyer confidence and sales.",
    },
    {
      icon: Globe,
      title: "International Trade",
      description:
        "Compliance with CISG and international trade laws for cross-border transactions.",
    },
  ];

  const timeline = [
    { phase: "Registration", time: "2-3 min", type: "instant" },
    { phase: "Document Upload", time: "15-20 min", type: "user" },
    { phase: "Initial Review", time: "24-48 hrs", type: "erovians" },
    { phase: "KYC/KYB Check", time: "2-5 days", type: "erovians" },
    { phase: "Activation", time: "Instant", type: "instant" },
  ];

  const faqs = [
    {
      q: "How long does verification take?",
      a: "Typically 24-48 hours for document review, and 2-5 business days for complete KYC/KYB verification. You'll receive email updates at each stage.",
    },
    {
      q: "What if my documents are rejected?",
      a: "You'll receive detailed feedback via email explaining the reason. You can correct the issues and resubmit your documents through your seller dashboard.",
    },
    {
      q: "Can I start listing products before verification?",
      a: "No. You must complete verification before listing products or responding to RFQs. This ensures platform integrity and buyer protection.",
    },
    {
      q: "Is verification free?",
      a: "Yes, seller verification is completely free. There are no setup fees or monthly charges. We only charge commission on successful sales.",
    },
    {
      q: "What happens after verification expires?",
      a: "Professional sellers must renew KYB annually. You'll receive reminders 30 days before expiry. Individual sellers verify once unless details change.",
    },
    {
      q: "Can I sell as an individual without a company?",
      a: "Yes! Individual sellers can register with personal ID proof. However, professional (company) sellers get higher selling limits and priority support.",
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
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Seller Verification Process
              </h1>
              <p className="text-lg text-white/90 max-w-3xl mx-auto mb-6">
                Get verified in 3-7 business days and start selling with a
                trusted seller badge on Erovians
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>24-48 hrs Review</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Lock className="w-4 h-4" />
                  <span>KYC/KYB Compliant</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Award className="w-4 h-4" />
                  <span>Verified Badge</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              {[
                { id: "process", label: "Verification Process", icon: Target },
                {
                  id: "documents",
                  label: "Required Documents",
                  icon: FileCheck,
                },
                { id: "status", label: "Status Types", icon: CheckCircle },
                { id: "faq", label: "FAQ", icon: HelpCircle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-navyblue text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Why Verification */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Why is Verification Required?
              </h2>
              <p className="text-gray-600">
                Ensuring trust, safety, and compliance for all platform users
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyVerification.map((reason, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-navyblue hover:shadow-md transition-all text-center"
                >
                  <div className="bg-navyblue/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <reason.icon className="w-7 h-7 text-navyblue" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-gray-600">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Based on Active Tab */}
        {activeTab === "process" && (
          <div className="py-12 md:py-16 bg-white">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Step-by-Step Verification Process
                </h2>
                <p className="text-gray-600">
                  Complete these steps to become a verified seller on Erovians
                </p>
              </div>

              {/* Timeline Overview */}
              <div className="mb-12">
                <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                  Estimated Timeline
                </h3>
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  {timeline.map((phase, index) => (
                    <React.Fragment key={index}>
                      <div className="text-center">
                        <div
                          className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                            phase.type === "instant"
                              ? "bg-green-100 text-green-700"
                              : phase.type === "user"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {phase.phase}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {phase.time}
                        </div>
                      </div>
                      {index < timeline.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="text-center mt-4 text-sm text-gray-600">
                  <strong>Total Time:</strong> 3-7 business days (average)
                </div>
              </div>

              {/* Verification Steps */}
              <div className="space-y-6">
                {verificationSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`${step.color} border-2 rounded-lg p-6 hover:shadow-md transition-all`}
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
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 text-xs bg-white border border-gray-300 px-3 py-1 rounded-full">
                              <Clock className="w-3 h-3" />
                              {step.duration}
                            </div>
                            <span className="text-xs font-semibold text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-300">
                              {step.status}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white/60 rounded-lg p-4">
                          <h4 className="font-semibold text-sm text-gray-900 mb-2">
                            What happens in this step:
                          </h4>
                          <ul className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-gray-700"
                              >
                                <CheckSquare className="w-4 h-4 shrink-0 text-navyblue mt-0.5" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="py-12 md:py-16 bg-white">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Required Documents
                </h2>
                <p className="text-gray-600">
                  Prepare these documents before starting verification
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {requiredDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:border-navyblue transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-300">
                        <doc.icon className="w-7 h-7 text-navyblue" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900">
                            {doc.title}
                          </h3>
                          <div className="flex gap-2">
                            {doc.required && (
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-semibold">
                                Required
                              </span>
                            )}
                            {doc.professional && (
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-semibold">
                                Pro
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {doc.description}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            <strong>Format:</strong> {doc.format}
                          </span>
                        </div>
                        <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-800">{doc.note}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-yellow-900 mb-2">
                      Document Guidelines
                    </h3>
                    <ul className="space-y-1 text-sm text-yellow-800">
                      <li>• All documents must be clear and readable</li>
                      <li>• File size limit: 5MB per document</li>
                      <li>• Accepted formats: PDF, JPG, PNG, SVG</li>
                      <li>• Documents must be valid and not expired</li>
                      <li>• Scanned copies or photos both acceptable</li>
                      <li>• Company name must match across all documents</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "status" && (
          <div className="py-12 md:py-16 bg-white">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Verification Status Types
                </h2>
                <p className="text-gray-600">
                  Understand what each status means and required actions
                </p>
              </div>

              <div className="space-y-6">
                {verificationStatuses.map((status, index) => (
                  <div
                    key={index}
                    className={`${status.color} border-2 rounded-lg p-6`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <status.icon
                          className={`w-8 h-8 ${status.iconColor}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold mb-1">
                              {status.status}
                            </h3>
                            <p className="text-sm">{status.description}</p>
                          </div>
                          <span className="text-xs font-semibold bg-white px-3 py-1 rounded-full">
                            {status.timeline}
                          </span>
                        </div>
                        <button className="mt-3 bg-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 border border-gray-300">
                          {status.action}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Eye className="w-6 h-6 text-blue-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">
                      Track Your Status
                    </h3>
                    <p className="text-sm text-blue-800 mb-3">
                      You can track your verification status anytime by logging
                      into your seller dashboard. We'll also send email and SMS
                      notifications at each stage.
                    </p>
                    <button className="bg-navyblue text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors">
                      Check Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="py-12 md:py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600">
                  Common questions about seller verification
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-navyblue transition-all"
                  >
                    <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                      <HelpCircle className="w-5 h-5 text-navyblue shrink-0 mt-0.5" />
                      {faq.q}
                    </h3>
                    <p className="text-sm text-gray-600 ml-7 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Support Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
              <div className="bg-navyblue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-navyblue" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Need Help with Verification?
              </h2>
              <p className="text-gray-600 mb-6">
                Our support team is here to assist you through the verification
                process
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-navyblue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Support
                </button>
                <button className="bg-white text-navyblue px-6 py-3 rounded-lg font-semibold border-2 border-navyblue hover:bg-navyblue hover:text-white transition-colors flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Us
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Response time: Within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-12 md:py-16 bg-navyblue text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Verified?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Start your verification process today and join thousands of
              trusted sellers on Erovians
            </p>
            <button className="bg-white text-navyblue px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-3">
              <Zap className="w-6 h-6" />
              Start Verification
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-white/70 mt-4">
              Free verification • No hidden fees • Complete in 3-7 days
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerVerification;
