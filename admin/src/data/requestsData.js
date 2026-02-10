export const requestsData = [
  {
    id: 1,
    company: "ABC Marbles Pvt Ltd",
    industry: "Construction Materials",
    rating: 4.7,
    gstin: "07AABCU9603R1ZX",
    seller: "Rahul Sharma",
    location: "Delhi, India",
    submittedDate: "2024-01-15",

    status: "pending",
    documents: 5,
    email: "rahul@abcmarbles.com",
    phone: "+91 9876543210",
    website: "www.abcmarbles.com",
    address: "123, Marble Market, Delhi - 110001"
  },
  {
    id: 2,
    company: "Stone World Imports",
    industry: "Natural Stones",
    rating: 4.9,
    gstin: "08BBCP54567M2ZY",
    seller: "Amit Patel & Co",
    location: "Jaipur, Rajasthan",
    submittedDate: "2024-01-14",
   
    status: "pending",
    documents: 7,
    email: "amit@stoneworld.com",
    phone: "+91 9876543211",
    website: "www.stoneworldimports.com",
    address: "456, Stone Street, Jaipur - 302001"
  },
  {
    id: 3,
    company: "Global Granite Exports",
    industry: "Granite Export",
    rating: 4.8,
    gstin: "33CCGGE8899N32A",
    seller: "Global Trading Inc",
    location: "Chennai, Tamil Nadu",
    submittedDate: "2024-01-10",
   
    status: "reviewed",
    documents: 8,
    email: "info@globalgranite.com",
    phone: "+91 9876543212",
    website: "www.globalgraniteexports.com",
    address: "789, Granite Road, Chennai - 600001"
  },
  {
    id: 4,
    company: "Premium Ceramics Ltd",
    industry: "Ceramic Tiles",
    rating: 4.6,
    gstin: "24DDPCL1122P42B",
    seller: "Ceramic Solutions",
    location: "Morbi, Gujarat",
    submittedDate: "2024-01-05",
    
    status: "approved",
    documents: 10,
    email: "sales@premiumceramics.com",
    phone: "+91 9876543213",
    website: "www.premiumceramics.com",
    address: "101, Ceramic Zone, Morbi - 363641"
  },
  {
    id: 5,
    company: "Marble Palace Traders",
    industry: "Marble Trading",
    rating: 3.9,
    gstin: "08EEMPT33440SZC",
    seller: "Marble Enterprises",
    location: "Kishangarh, Rajasthan",
    submittedDate: "2024-01-03",
    
    status: "rejected",
    documents: 4,
    email: "info@marblepalace.com",
    phone: "+91 9876543214",
    website: "www.marblepalacetraders.com",
    address: "222, Marble Palace, Kishangarh - 305801"
  }
];

export const getIndustries = () => {
  return [...new Set(requestsData.map(req => req.industry))];
};

export const getStatusCounts = (data = requestsData) => {
  const counts = {
    total: data.length,
    pending: data.filter(req => req.status === 'pending').length,
    reviewed: data.filter(req => req.status === 'reviewed').length,
    approved: data.filter(req => req.status === 'approved').length,
    rejected: data.filter(req => req.status === 'rejected').length
  };
  return counts;
};

export const getRequestById = (id) => {
  return requestsData.find(req => req.id === id);
};