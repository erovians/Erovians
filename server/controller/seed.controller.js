import User from "../models/user.model.js";
import Seller from "../models/sellerSingnup.model.js";
import CompanyDetails from "../models/company.model.js";
import Product from "../models/product.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Function to fix thickness measurement from mm to cm
const fixThicknessMeasurement = (productData) => {
  if (productData.size && productData.size.thicknessMeasurement === "mm") {
    // Convert mm to cm
    productData.size.thickness = productData.size.thickness / 10;
    productData.size.thicknessMeasurement = "cm";
    console.log(
      `    🔧 Fixed thickness: ${productData.size.thickness * 10}mm → ${
        productData.size.thickness
      }cm for ${productData.productName}`
    );
  }
  return productData;
};

export const seedDatabase = async () => {
  try {
    // Read JSON files
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/user.json"), "utf-8")
    );
    console.log("user data json path", usersData);
    const sellersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/seller.json"), "utf-8")
    );
    console.log("sellers data json path", sellersData);
    const companiesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/compnay.json"), "utf-8")
    );
    console.log("companie data json path", companiesData);
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/product.json"), "utf-8")
    );

    console.log("products data json path", productsData);

    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Seller.deleteMany({});
    await CompanyDetails.deleteMany({});
    await Product.deleteMany({});
    console.log("✅ Cleared existing data");

    // Maps to store old ID -> new ID mappings
    const userIdMap = new Map();
    const sellerIdMap = new Map();
    const companyIdMap = new Map();

    // 1. Insert Users
    console.log("📝 Inserting users...");
    for (const userData of usersData) {
      const oldUserId = userData._id.$oid;
      delete userData._id;

      if (userData.createdAt?.$date) {
        userData.createdAt = new Date(userData.createdAt.$date);
      }
      if (userData.updatedAt?.$date) {
        userData.updatedAt = new Date(userData.updatedAt.$date);
      }
      if (userData.passwordChangedAt?.$date) {
        userData.passwordChangedAt = new Date(userData.passwordChangedAt.$date);
      }

      const newUser = await User.create(userData);
      userIdMap.set(oldUserId, newUser._id);
      console.log(`  ✓ Created user: ${newUser.name}`);
    }

    // 2. Insert Sellers
    console.log("📝 Inserting sellers...");
    for (const sellerData of sellersData) {
      const oldSellerId = sellerData._id.$oid;
      const oldUserId = sellerData.userId.$oid;

      delete sellerData._id;
      sellerData.userId = userIdMap.get(oldUserId);

      if (sellerData.createdAt?.$date) {
        sellerData.createdAt = new Date(sellerData.createdAt.$date);
      }
      if (sellerData.updatedAt?.$date) {
        sellerData.updatedAt = new Date(sellerData.updatedAt.$date);
      }

      const newSeller = await Seller.create(sellerData);
      sellerIdMap.set(oldSellerId, newSeller._id);
      console.log(`  ✓ Created seller: ${newSeller.businessName}`);
    }

    // 3. Insert Companies
    console.log("📝 Inserting companies...");
    for (const companyData of companiesData) {
      const oldCompanyId = companyData._id.$oid;
      const oldSellerId = companyData.sellerId.$oid;

      delete companyData._id;
      companyData.sellerId = sellerIdMap.get(oldSellerId);

      if (companyData.createdAt?.$date) {
        companyData.createdAt = new Date(companyData.createdAt.$date);
      }
      if (companyData.updatedAt?.$date) {
        companyData.updatedAt = new Date(companyData.updatedAt.$date);
      }

      const newCompany = await CompanyDetails.create(companyData);
      companyIdMap.set(oldCompanyId, newCompany._id);
      console.log(
        `  ✓ Created company: ${newCompany.companyBasicInfo.companyName}`
      );
    }

    // 4. Insert Products
    console.log("📝 Inserting products...");
    let productCount = 0;
    for (const productData of productsData) {
      const oldCompanyId = productData.companyId.$oid;
      const oldSellerId = productData.sellerId.$oid;

      delete productData._id;
      productData.companyId = companyIdMap.get(oldCompanyId);
      productData.sellerId = sellerIdMap.get(oldSellerId);

      if (productData.createdAt?.$date) {
        productData.createdAt = new Date(productData.createdAt.$date);
      }
      if (productData.updatedAt?.$date) {
        productData.updatedAt = new Date(productData.updatedAt.$date);
      }

      // ✅ Fix thickness measurement before saving
      const fixedProductData = fixThicknessMeasurement(productData);

      await Product.create(fixedProductData);
      productCount++;
    }
    console.log(`  ✓ Created ${productCount} products`);

    console.log("✅ Database seeding completed successfully!");
    console.log(`
📊 Summary:
  - Users: ${usersData.length}
  - Sellers: ${sellersData.length}
  - Companies: ${companiesData.length}
  - Products: ${productsData.length}
    `);

    return {
      success: true,
      message: "Database seeded successfully",
      data: {
        users: usersData.length,
        sellers: sellersData.length,
        companies: companiesData.length,
        products: productsData.length,
      },
    };
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};
