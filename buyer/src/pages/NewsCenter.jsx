import React, { useState } from "react";
import Layout from "../components/common/Layout";
import { assets } from "../assets/assets";
import {
  Newspaper,
  Calendar,
  User,
  Clock,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  BookOpen,
  Tag,
  Eye,
  Share2,
  Mail,
  ArrowRight,
  Globe,
  Zap,
  Award,
  FileText,
  Package,
  Sparkles,
  Target,
  ExternalLink,
} from "lucide-react";

const NewsCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All News", icon: Newspaper },
    { id: "natural-stones", name: "Natural Stones", icon: Package },
    { id: "ceramic-tiles", name: "Ceramic & Tiles", icon: Target },
    {
      id: "alternatives-finishes",
      name: "Alternatives & Finishes",
      icon: Sparkles,
    },
  ];

  const featuredNews = {
    title: "Revolutionary Marble Extraction Technology Unveiled in Carrara",
    category: "Natural Stones",
    date: "February 2, 2026",
    author: "Marco Rossi",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    excerpt:
      "Italian quarries adopt AI-powered cutting systems that reduce waste by 40% and improve safety standards across the marble industry.",
    views: "12.5K",
  };

  const newsArticles = [
    {
      id: 1,
      title: "Granite Exports from India Reach Record High in Q4 2025",
      category: "Natural Stones",
      subcategory: "Granite",
      date: "January 28, 2026",
      author: "Rajesh Kumar",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
      excerpt:
        "Indian granite exports surpass $2.5 billion driven by demand from US and European markets.",
      views: "8.2K",
      trending: true,
    },
    {
      id: 2,
      title: "Sustainable Quarrying: EU Sets New Environmental Standards",
      category: "Natural Stones",
      subcategory: "Industry News",
      date: "January 25, 2026",
      author: "Elena Martinez",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400",
      excerpt:
        "European Union introduces stricter regulations for stone extraction focusing on environmental protection.",
      views: "6.7K",
    },
    {
      id: 3,
      title:
        "Porcelain Tiles: Digital Printing Technology Revolutionizes Design",
      category: "Ceramic & Tiles",
      subcategory: "Porcelain Tiles",
      date: "January 22, 2026",
      author: "Sofia Chen",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400",
      excerpt:
        "New HD printing techniques allow for unprecedented realism in wood and marble-look porcelain tiles.",
      views: "9.1K",
      trending: true,
    },
    {
      id: 4,
      title: "Engineered Quartz Market Expected to Grow 15% Annually",
      category: "Alternatives & Finishes",
      subcategory: "Quartz",
      date: "January 20, 2026",
      author: "David Park",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400",
      excerpt:
        "Global demand for engineered quartz surfaces continues to rise as architects favor sustainable options.",
      views: "5.4K",
    },
    {
      id: 5,
      title: "Turkish Travertine Gains Popularity in Luxury Construction",
      category: "Natural Stones",
      subcategory: "Travertine",
      date: "January 18, 2026",
      author: "Ahmet Yılmaz",
      readTime: "3 min read",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
      excerpt:
        "Premium Turkish travertine becomes the material of choice for high-end residential projects worldwide.",
      views: "7.3K",
    },
    {
      id: 6,
      title: "Terrazzo Makes Comeback with Modern Manufacturing Techniques",
      category: "Alternatives & Finishes",
      subcategory: "Terrazzo",
      date: "January 15, 2026",
      author: "Isabella Romano",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1600566753051-c19af0a8b8b6?w=400",
      excerpt:
        "Classic terrazzo flooring returns to trend with eco-friendly resin-based production methods.",
      views: "6.9K",
      trending: true,
    },
    {
      id: 7,
      title: "China's Slate Industry Adopts Green Mining Practices",
      category: "Natural Stones",
      subcategory: "Slate",
      date: "January 12, 2026",
      author: "Li Wei",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400",
      excerpt:
        "Chinese slate producers implement sustainable extraction methods reducing carbon footprint by 30%.",
      views: "4.8K",
    },
    {
      id: 8,
      title: "Vitrified Tiles Market in India Reaches $5 Billion",
      category: "Ceramic & Tiles",
      subcategory: "Vitrified Tiles",
      date: "January 10, 2026",
      author: "Priya Sharma",
      readTime: "3 min read",
      image:
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400",
      excerpt:
        "Indian vitrified tile manufacturers expand production capacity to meet domestic and export demand.",
      views: "5.6K",
    },
  ];

  const trendingTopics = [
    { name: "Sustainable Quarrying", count: "245 articles" },
    { name: "Digital Tile Printing", count: "189 articles" },
    { name: "Marble Market Trends", count: "167 articles" },
    { name: "Eco-Friendly Materials", count: "134 articles" },
    { name: "Export Regulations", count: "98 articles" },
  ];

  const latestBlogs = [
    {
      title: "How to Choose the Right Marble for Your Project",
      date: "Feb 1, 2026",
      author: "Design Team",
      category: "Guide",
    },
    {
      title: "Top 10 Granite Colors for 2026",
      date: "Jan 30, 2026",
      author: "Erovians Editorial",
      category: "Trends",
    },
    {
      title: "Understanding Stone Finishes: Polished vs Honed",
      date: "Jan 28, 2026",
      author: "Technical Team",
      category: "Education",
    },
    {
      title: "The Rise of Engineered Stone in Commercial Projects",
      date: "Jan 25, 2026",
      author: "Market Insights",
      category: "Analysis",
    },
  ];

  const industryUpdates = [
    {
      icon: TrendingUp,
      title: "Market Growth",
      update: "Global stone market up 12% in 2025",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Globe,
      title: "Trade Shows",
      update: "Marmomacc 2026 dates announced",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Award,
      title: "Industry Awards",
      update: "Stone Excellence Awards nominations open",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const filteredNews =
    selectedCategory === "all"
      ? newsArticles
      : newsArticles.filter((article) => {
          if (selectedCategory === "natural-stones")
            return article.category === "Natural Stones";
          if (selectedCategory === "ceramic-tiles")
            return article.category === "Ceramic & Tiles";
          if (selectedCategory === "alternatives-finishes")
            return article.category === "Alternatives & Finishes";
          return true;
        });

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-navyblue text-white">
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
            <div className="text-center mb-8">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                News Center
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Latest updates, trends, and insights from the natural stone,
                ceramic, and alternative materials industry
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news articles, trends, market updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pr-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-navyblue text-white p-2 rounded-md hover:bg-blue-800 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-navyblue text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content - Main News */}
            <div className="lg:col-span-2">
              {/* Featured Article */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  <Zap className="w-3 h-3" />
                  Featured Story
                </div>
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                  <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-navyblue text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {featuredNews.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-navyblue transition-colors cursor-pointer">
                      {featuredNews.title}
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {featuredNews.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {featuredNews.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {featuredNews.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredNews.readTime}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-navyblue">
                        <Eye className="w-4 h-4" />
                        {featuredNews.views}
                      </div>
                    </div>
                    <button className="bg-navyblue text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
                      Read Full Article
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* News Grid */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-navyblue" />
                  Latest News
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredNews.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg hover:border-navyblue transition-all"
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-white/90 backdrop-blur text-navyblue px-2 py-1 rounded text-xs font-semibold">
                          {article.subcategory}
                        </span>
                        {article.trending && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 hover:text-navyblue transition-colors cursor-pointer line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          {article.author}
                        </div>
                        <button className="text-navyblue text-xs font-semibold hover:underline flex items-center gap-1">
                          Read More
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="mt-8 text-center">
                <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Load More Articles
                </button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Industry Updates */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-navyblue" />
                    Industry Updates
                  </h3>
                  <div className="space-y-3">
                    {industryUpdates.map((update, index) => (
                      <div
                        key={index}
                        className={`${update.color} p-3 rounded-lg`}
                      >
                        <div className="flex items-start gap-2">
                          <update.icon className="w-5 h-5 shrink-0" />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">
                              {update.title}
                            </h4>
                            <p className="text-xs opacity-90">
                              {update.update}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-navyblue" />
                    Trending Topics
                  </h3>
                  <div className="space-y-2">
                    {trendingTopics.map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 font-medium">
                            {topic.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {topic.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Blogs */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-navyblue" />
                    Latest Blogs
                  </h3>
                  <div className="space-y-4">
                    {latestBlogs.map((blog, index) => (
                      <div
                        key={index}
                        className="pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className="bg-navyblue/10 text-navyblue px-2 py-0.5 rounded text-xs font-semibold">
                            {blog.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 hover:text-navyblue cursor-pointer line-clamp-2">
                          {blog.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{blog.date}</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {blog.author}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-navyblue text-sm font-semibold hover:underline flex items-center justify-center gap-1">
                    View All Blogs
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-navyblue text-white rounded-lg p-5">
                  <div className="text-center mb-4">
                    <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Stay Updated</h3>
                    <p className="text-xs text-white/80">
                      Get the latest news delivered to your inbox
                    </p>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="w-full bg-white text-navyblue py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                  <p className="text-xs text-white/60 mt-2 text-center">
                    No spam, unsubscribe anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsCenter;
