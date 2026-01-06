const companiesData = [
  {
    _id: "707f1f77bcf86cd799439031",
    sellerId: "607f1f77bcf86cd799439021",
    companyBasicInfo: {
      companyName: "Raj Mahal Marbles & Granites",
      address: {
        street: "Plot 45, Marble Industrial Area",
        city: "Kishangarh",
        stateOrProvince: "Rajasthan",
        countryOrRegion: "India",
        postalCode: "305801",
      },
      legalowner: "Vikram Rajput",
      locationOfRegistration: "Rajasthan",
      companyRegistrationYear: "2015",
      mainCategory: ["natural stones"],
      subCategory: ["marble", "granite", "sandstone"],
      acceptedCurrency: ["INR", "USD", "EUR"],
      acceptedPaymentType: [
        "Bank Transfer",
        "Letter of Credit",
        "Cash on Delivery",
      ],
      languageSpoken: ["Hindi", "English", "Rajasthani"],
    },
    companyIntro: {
      logo: "https://i.pinimg.com/1200x/6d/ec/1f/6dec1f5c24f3f77a86ed106b879d4ed8.jpg",
      companyDescription:
        "Raj Mahal Marbles & Granites is a premier supplier of high-quality natural stones with over 8 years of experience in the industry. We specialize in Indian marble, granite, and sandstone, sourced directly from the finest quarries in Rajasthan. Our commitment to quality and customer satisfaction has made us a trusted name in the marble industry across India and internationally.",
      companyPhotos: [
        "https://tileswale.com/uploads/blog/163939592016_8799_33748.jpg",
        "https://example.com/photos/rajmahal-showroom.jpg",
        "https://example.com/photos/rajmahal-products.jpg",
      ],
      companyVideos: ["https://example.com/videos/rajmahal-tour.mp4"],
    },
    createdAt: new Date("2023-11-10"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    _id: "707f1f77bcf86cd799439032",
    sellerId: "607f1f77bcf86cd799439022",
    companyBasicInfo: {
      companyName: "Imperial Stones International",
      address: {
        street: "B-12, GIDC Industrial Estate",
        city: "Veraval",
        stateOrProvince: "Gujarat",
        countryOrRegion: "India",
        postalCode: "362266",
      },
      legalowner: "Suresh Patel",
      locationOfRegistration: "Gujarat",
      companyRegistrationYear: "2012",
      mainCategory: ["natural stones"],
      subCategory: ["granite", "marble", "quartzite"],
      acceptedCurrency: ["INR", "USD"],
      acceptedPaymentType: ["Bank Transfer", "Letter of Credit"],
      languageSpoken: ["Gujarati", "Hindi", "English"],
    },
    companyIntro: {
      logo: "https://i.pinimg.com/736x/1c/9b/85/1c9b85b09a4ddd14d9d4004a3100365e.jpg",
      companyDescription:
        "Imperial Stones International is a leading exporter of premium Indian granites with more than a decade of experience. We operate our own quarries and processing facilities, ensuring complete control over quality from extraction to final polish. Our extensive range includes Black Galaxy, Tan Brown, Kashmir White, and many other exotic granite varieties that are shipped to over 30 countries worldwide.",
      companyPhotos: [
        "https://tileswale.com/uploads/blog/163939529157_4852_512855.png",
        "https://example.com/photos/imperial-quarry.jpg",
        "https://example.com/photos/imperial-warehouse.jpg",
        "https://example.com/photos/imperial-products.jpg",
      ],
      companyVideos: [
        "https://example.com/videos/imperial-processing.mp4",
        "https://example.com/videos/imperial-showroom.mp4",
      ],
    },
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-12-20"),
  },
  {
    _id: "707f1f77bcf86cd799439033",
    sellerId: "607f1f77bcf86cd799439023",
    companyBasicInfo: {
      companyName: "South India Granites & Exports",
      address: {
        street: "No. 23, Granite Colony, Hosur Road",
        city: "Bangalore",
        stateOrProvince: "Karnataka",
        countryOrRegion: "India",
        postalCode: "560068",
      },
      legalowner: "Ramesh Kumar",
      locationOfRegistration: "Tamil Nadu",
      companyRegistrationYear: "2010",
      mainCategory: ["natural stones", "alternatives & finishes"],
      subCategory: ["granite", "marble", "engineered stone", "quartz"],
      acceptedCurrency: ["INR", "USD", "GBP", "AUD"],
      acceptedPaymentType: [
        "Bank Transfer",
        "Letter of Credit",
        "PayPal",
        "Wire Transfer",
      ],
      languageSpoken: ["Tamil", "Kannada", "Telugu", "Hindi", "English"],
    },
    companyIntro: {
      logo: "https://i.pinimg.com/736x/9e/60/0a/9e600a08d863fefc65d4c869244ed4fa.jpg",
      companyDescription:
        "South India Granites & Exports has been a pioneer in the natural stone industry since 2010, specializing in both natural and engineered stones. With state-of-the-art processing facilities in Bangalore and strong relationships with quarry owners across South India, we offer an unmatched variety of granite, marble, and quartz surfaces. Our commitment to sustainability and ethical sourcing sets us apart in the industry.",
      companyPhotos: [
        "https://tileswale.com/uploads/blog/163939624962_7930_690524.jpg",
        "https://example.com/photos/southindia-showroom.jpg",
        "https://example.com/photos/southindia-products1.jpg",
      ],
      companyVideos: [],
    },
    createdAt: new Date("2023-09-20"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    _id: "707f1f77bcf86cd799439034",
    sellerId: "607f1f77bcf86cd799439024",
    companyBasicInfo: {
      companyName: "Luxury Tiles & Ceramics",
      address: {
        street: "Shop 102, Morbi Ceramic Hub",
        city: "Morbi",
        stateOrProvince: "Gujarat",
        countryOrRegion: "India",
        postalCode: "363641",
      },
      legalowner: "Anil Mehta",
      locationOfRegistration: "Maharashtra",
      companyRegistrationYear: "2020",
      mainCategory: ["ceramic & tiles", "alternatives & finishes"],
      subCategory: [
        "porcelain tiles",
        "vitrified tiles",
        "ceramic tiles",
        "wall tiles",
      ],
      acceptedCurrency: ["INR"],
      acceptedPaymentType: ["Cash", "Bank Transfer", "UPI", "Credit Card"],
      languageSpoken: ["Hindi", "Gujarati", "English"],
    },
    companyIntro: {
      logo: "https://i.pinimg.com/736x/24/3f/0c/243f0cd079160bc73622d9eb4519e78b.jpg",
      companyDescription:
        "Luxury Tiles & Ceramics brings you the finest collection of premium tiles and ceramic products from Morbi, the ceramic capital of India. Established in 2020, we have quickly built a reputation for offering contemporary designs, superior quality, and competitive pricing. Our product range includes Italian marble look tiles, wooden finish tiles, and designer wall tiles perfect for modern homes and commercial spaces.",
      companyPhotos: [
        "https://tileswale.com/uploads/blog/163939432268_8018_264838.png",
        "https://example.com/photos/luxury-products.jpg",
        "https://example.com/photos/luxury-display.jpg",
      ],
      companyVideos: ["https://example.com/videos/luxury-collection.mp4"],
    },
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
];

export default companiesData;
