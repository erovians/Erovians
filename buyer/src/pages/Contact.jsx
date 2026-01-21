import React, { useState } from "react";
import Layout from "../components/common/Layout";
import { assets } from "../assets/assets";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  User,
  Building2,
  FileText,
  HelpCircle,
  Shield,
  Package,
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    category: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      info: "Available Mon-Fri, 9AM-6PM CET",
      action: "Start Chat",
      color: "bg-blue-50 text-blue-600 border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      info: "support@erovians.com",
      action: "Send Email",
      color: "bg-green-50 text-green-600 border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      info: "+352 XX XX XX XX (Luxembourg)",
      action: "Call Now",
      color: "bg-purple-50 text-purple-600 border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const departments = [
    {
      icon: Package,
      title: "Order Support",
      email: "orders@erovians.com",
      description: "Questions about orders, RFQs, tracking",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      icon: CreditCard,
      title: "Payment & Billing",
      email: "billing@erovians.com",
      description: "Payment issues, invoices, refunds",
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
    {
      icon: Shield,
      title: "Legal & Compliance",
      email: "legal@erovians.com",
      description: "Smart contracts, KYC, legal matters",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      icon: Building2,
      title: "Seller Support",
      email: "sellers@erovians.com",
      description: "Become a seller, seller verification",
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
    {
      icon: Truck,
      title: "Logistics",
      email: "logistics@erovians.com",
      description: "Shipping, customs, delivery issues",
      color: "bg-teal-50 text-teal-600 border-teal-200",
    },
    {
      icon: HelpCircle,
      title: "General Inquiries",
      email: "info@erovians.com",
      description: "Partnership, media, other questions",
      color: "bg-gray-50 text-gray-600 border-gray-200",
    },
  ];

  const offices = [
    {
      country: "Luxembourg (HQ)",
      address: "123 Business Avenue, L-1234 Luxembourg",
      phone: "+352 XX XX XX XX",
      email: "luxembourg@erovians.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM CET",
    },
    {
      country: "Belgium",
      address: "456 Commerce Street, 1000 Brussels, Belgium",
      phone: "+32 XX XX XX XX",
      email: "belgium@erovians.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM CET",
    },
  ];

  const categories = [
    { value: "", label: "Select Category" },
    { value: "order", label: "Order & RFQ Support" },
    { value: "payment", label: "Payment & Billing" },
    { value: "shipping", label: "Shipping & Delivery" },
    { value: "technical", label: "Technical Support" },
    { value: "seller", label: "Seller Inquiries" },
    { value: "legal", label: "Legal & Compliance" },
    { value: "partnership", label: "Partnership & Business" },
    { value: "other", label: "Other" },
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
                Get in Touch
              </h1>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Have questions? We're here to help. Contact our support team or
                send us a message.
              </p>

              {/* Quick Contact Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 max-w-xl mx-auto">
                <div className="bg-white/10 p-3 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xs text-white/80">24h Response</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <MessageCircle className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xs text-white/80">Live Support</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <Globe className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xs text-white/80">Global Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Choose Your Preferred Contact Method
              </h2>
              <p className="text-gray-600">
                We're available through multiple channels to assist you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className={`${method.color} border-2 p-6 rounded-lg hover:shadow-lg transition-all`}
                >
                  <div className="bg-white p-3 rounded-lg w-fit mb-4">
                    <method.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {method.description}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mb-4">
                    {method.info}
                  </p>
                  <button
                    className={`w-full ${method.buttonColor} text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors`}
                  >
                    {method.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Contact Form */}
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form and we'll get back to you within 24 hours
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyblue text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyblue text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+352 XX XX XX XX"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyblue text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyblue text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyblue text-sm appearance-none bg-white"
                      >
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief description of your inquiry"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyblue text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please provide details about your inquiry..."
                      required
                      rows="5"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyblue text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-navyblue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Office Locations
                  </h3>
                  <div className="space-y-4">
                    {offices.map((office, index) => (
                      <div
                        key={index}
                        className="pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <MapPin className="w-5 h-5 text-navyblue shrink-0 mt-1" />
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">
                              {office.country}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {office.address}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 ml-8">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {office.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {office.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {office.hours}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-navyblue p-6 rounded-lg text-white">
                  <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                  <p className="text-sm text-white/90 mb-4">
                    Stay updated with the latest news and updates from Erovians
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Quick Response Info */}
                <div className="bg-green-50 border-2 border-green-200 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        Fast Response Guarantee
                      </h4>
                      <p className="text-sm text-gray-700">
                        We aim to respond to all inquiries within 24 hours
                        during business days. For urgent matters, please use our
                        live chat or phone support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Contact */}
        <div className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Contact by Department
              </h2>
              <p className="text-gray-600">
                Reach out to the right team for faster assistance
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept, index) => (
                <div
                  key={index}
                  className={`${dept.color} border-2 p-5 rounded-lg hover:shadow-md transition-all`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white p-2 rounded-lg">
                      <dept.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {dept.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    {dept.description}
                  </p>
                  <a
                    href={`mailto:${dept.email}`}
                    className="text-xs font-semibold text-navyblue hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    {dept.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Contact Banner */}
        <div className="bg-navyblue text-white py-10">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center">
              <AlertCircle className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-bold mb-2">
                Urgent Payment or Order Issue?
              </h3>
              <p className="text-sm text-white/90 mb-4">
                For immediate assistance with active orders or payment disputes,
                contact our priority support line
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:+352XXXXXXXX"
                  className="bg-white text-navyblue px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call Priority Line
                </a>
                <button className="bg-yellow-500 text-navyblue px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-sm inline-flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Start Urgent Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
