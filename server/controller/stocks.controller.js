// import ExcelJS from "exceljs";
// import Stock from "../models/stocks.model.js";

// export const exportStocks = async (req, res) => {
//   try {
//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet("Stocks");

//     // Excel column setup
//     sheet.columns = [
//       { header: "Lot", key: "lot", width: 20 },
//       { header: "Material", key: "material", width: 25 },
//       { header: "Thickness", key: "thickness", width: 15 },
//       { header: "Dimensions", key: "dimensions", width: 20 },
//       { header: "Location", key: "location", width: 20 },
//       { header: "Quality", key: "quality", width: 10 },
//       { header: "Qty", key: "qty", width: 10 },
//     ];

//     // 🔥 Fetching dynamic data from DB
//     const stocks = await Stock.find().lean();

//     // Add rows dynamically
//     stocks.forEach((item) => {
//       sheet.addRow({
//         lot: item.lot,
//         material: item.material,
//         thickness: item.thickness,
//         dimensions: item.dimensions,
//         location: item.location,
//         quality: item.quality,
//         qty: item.qty,
//       });
//     });

//     // Excel download response headers
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=stocks.xlsx");

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error("EXPORT ERROR:", error);
//     res.status(500).json({ message: "Failed to export" });
//   }
// };

// export const createStock = async (req, res) => {
//   try {
//     const stock = await Stock.create(req.body);
//     res.json({ success: true, stock });
//   } catch (err) {
//     res.status(500).json({ message: "Create stock failed" });
//   }
// };

// export const getStocks = async (req, res) => {
//   const stocks = await Stock.find().sort({ createdAt: -1 });
//   res.json(stocks);
// };

// export const importStocks = async (req, res) => {
//   try {
//     const filePath = req.file.path;

//     const workbook = new ExcelJS.Workbook();

//     // Detect CSV vs Excel
//     if (filePath.endsWith(".csv")) {
//       await workbook.csv.readFile(filePath);
//     } else {
//       await workbook.xlsx.readFile(filePath);
//     }

//     const sheet = workbook.getWorksheet(1) || workbook.worksheets[0];

//     const stocks = [];

//     sheet.eachRow((row, rowNumber) => {
//       if (rowNumber === 1) return; // skip header

//       const getVal = (cell) =>
//         typeof cell.value === "object" ? cell.value.text : cell.value;

//       stocks.push({
//         lot: getVal(row.getCell(1)),
//         material: getVal(row.getCell(2)),
//         thickness: getVal(row.getCell(3)),
//         dimensions: getVal(row.getCell(4)),
//         location: getVal(row.getCell(5)),
//         quality: getVal(row.getCell(6)),
//         qty: getVal(row.getCell(7)),
//       });
//     });

//     await Stock.insertMany(stocks);

//     res.json({ success: true, message: "Import complete" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Import failed" });
//   }
// };
import ExcelJS from "exceljs";
import fs from "fs";
import sanitize from "mongo-sanitize";
import Stock from "../models/stocks.model.js";
import { success } from "zod";
import CompanyDetails from "../models/company.model.js";
import Product from "../models/product.model.js";

// ✅ Get Stocks (Optimized, Lean)
export const getStocks = async (req, res) => {
  const sellerId = req.user.userId;

  try {
    const stocks = await Stock.find({ sellerId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(stocks);

    if (!stocks) {
      res
        .status(404)
        .json({ success: false, message: "stocks not found for this seller" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stocks" });
  }
};

// ✅ Create Stock (Sanitized + Validated)
export const createStock = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    // Get companyId for seller
    const company = await CompanyDetails.findOne({ sellerId }).select("_id");
    if (!company) {
      return res.status(400).json({ message: "Company not found for seller" });
    }
    const companyId = company._id;

    const cleanData = sanitize(req.body);

    if (!cleanData.qty) {
      throw new Error("Quantity (qty) is required");
    }

    if (!cleanData.lot || !cleanData.material) {
      return res.status(400).json({ message: "Lot & Material are required" });
    }

    // 🔥 CHECK FOR DUPLICATE LOT (same seller)
    const existing = await Stock.findOne({
      lot: cleanData.lot,
      sellerId: sellerId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Lot "${cleanData.lot}" already exists`,
      });
    }

    // CREATE STOCK
    const stock = await Stock.create({
      ...cleanData,
      sellerId,
      companyId,
    });

    res.json({ success: true, stock });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ message: "Create stock failed" });
  }
};

// ✅ Export Stocks to Excel (Dynamic + Fast)
export const exportStocks = async (req, res) => {
  try {
    const sellerId = req.user?.userId;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Stocks");

    const stocks = await Stock.find({ sellerId }).lean();

    // Add rows
    stocks.forEach((item) => {
      csv += `${item.lot || ""},${item.material || ""},${
        item.thickness || ""
      },${item.dimensions || ""},${item.location || ""},${item.quality || ""},${
        item.qty || ""
      }\n`;
    });

    // CSV file name
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=stocks.csv");

    return res.send(csv);
  } catch (error) {
    console.error("EXPORT ERROR:", error);
    res.status(500).json({ message: "Failed to export" });
  }
};

// ✅ Import Stocks (CSV + Excel + Validation + Dedupe + File Cleanup)
// export const importStocks = async (req, res) => {
//   try {
//     const sellerId = req.user?.userId;

//     // get the companyId for this seller
//     const company = await CompanyDetails.findOne({ sellerId }).select("_id");
//     if (!company) {
//       return res.status(400).json({ message: "Company not found for seller" });
//     }
//     const companyId = company._id;

//     const filePath = req.file.path;
//     const workbook = new ExcelJS.Workbook();

//     // Detect CSV vs XLSX
//     if (filePath.endsWith(".csv")) {
//       await workbook.csv.readFile(filePath);
//     } else {
//       await workbook.xlsx.readFile(filePath);
//     }

//     const sheet = workbook.getWorksheet(1) || workbook.worksheets[0];
//     const stocks = [];

//     // Parse rows
//     sheet.eachRow((row, rowNumber) => {
//       if (rowNumber === 1) return; // Skip header

//       const val = (cell) =>
//         typeof cell.value === "object" ? cell.value?.text : cell.value;

//       const item = {
//         lot: val(row.getCell(1)),
//         material: val(row.getCell(2)),
//         thickness: val(row.getCell(3)),
//         dimensions: val(row.getCell(4)),
//         location: val(row.getCell(5)),
//         quality: val(row.getCell(6)),
//         qty: val(row.getCell(7)),
//       };

//       if (!item.lot || !item.material) return;

//       stocks.push(item);
//     });

//     // Avoid duplicates
//     const existing = await Stock.find({
//       lot: { $in: stocks.map((s) => s.lot) },
//     }).select("lot");

//     const existingSet = new Set(existing.map((x) => x.lot));
//     const finalList = stocks.filter((s) => !existingSet.has(s.lot));

//     // ⭐ ADD sellerId & companyId TO EACH ITEM
//     finalList.forEach((item) => {
//       item.sellerId = sellerId;
//       item.companyId = companyId;
//     });

//     // Save items
//     if (finalList.length > 0) {
//       await Stock.insertMany(finalList);
//     }

//     // Delete uploaded file
//     fs.unlink(filePath, () => {});

//     res.json({
//       success: true,
//       imported: finalList.length,
//       skipped: stocks.length - finalList.length,
//       message: "Import complete",
//     });
//   } catch (error) {
//     console.error("IMPORT ERROR:", error);
//     res.status(500).json({ message: "Import failed" });
//   }
// };
// assumes you have: import fs from "fs"; import ExcelJS from "exceljs";
// and Product model imported: import Product from "@/models/Product";

export const importStocks = async (req, res) => {
  try {
    const sellerId = req.user?.userId;
    console.log(sellerId);
    console.log("uploaded file:", req.file);
    if (!sellerId) return res.status(401).json({ message: "Unauthorized" });

    // get the companyId for this seller
    const company = await CompanyDetails.findOne({ sellerId }).select("_id");
    if (!company) {
      return res.status(400).json({ message: "Company not found for seller" });
    }
    const companyId = company._id;
    console.log("company id", companyId);

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const filePath = req.file.path;
    const workbook = new ExcelJS.Workbook();

    // Detect CSV vs XLSX
    if (filePath.endsWith(".csv")) {
      await workbook.csv.readFile(filePath);
    } else {
      await workbook.xlsx.readFile(filePath);
    }

    const sheet = workbook.getWorksheet(1) || workbook.worksheets[0];
    if (!sheet) {
      fs.unlink(filePath, () => {});
      return res.status(400).json({ message: "Spreadsheet has no sheets" });
    }

    const rawRows = []; // keep raw rows for reporting if needed
    const stocks = [];

    // Parse rows (collect raw materials list)
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const val = (cell) =>
        cell == null || cell.value == null
          ? null
          : typeof cell.value === "object"
          ? cell.value?.text ?? String(cell.value)
          : String(cell.value);

      const item = {
        lot: val(row.getCell(1))?.trim(),
        material: val(row.getCell(2))?.trim(),
        thickness: val(row.getCell(3))?.trim(),
        dimensions: val(row.getCell(4))?.trim(),
        location: val(row.getCell(5))?.trim(),
        quality: val(row.getCell(6))?.trim(),
        qty:
          val(row.getCell(7)) != null
            ? Number(String(val(row.getCell(7))).replace(/,/g, ""))
            : null,
        _rowNumber: rowNumber, // keep row number for reporting
      };

      // keep raw row so we can tell user which row failed
      rawRows.push(item);

      // require minimal fields
      if (!item.lot || !item.material) return;

      stocks.push(item);
    });

    // If no valid rows
    if (stocks.length === 0) {
      fs.unlink(filePath, () => {});
      return res.status(400).json({
        message: "No valid stock rows found (lot & material required)",
      });
    }

    // --------------- Product matching ----------------
    // Normalize material names for matching
    const uniqueMaterials = [
      ...new Set(stocks.map((s) => (s.material || "").trim()).filter(Boolean)),
    ];

    // Query products for this seller, using collation for case-insensitive matching
    // IMPORTANT: For best perf, create index on { sellerId: 1, name: 1 } with same collation.
    const products = await Product.find({
      sellerId,
      name: { $in: uniqueMaterials },
    })
      .collation({ locale: "en", strength: 2 })
      .select("_id productName");

    // Build map: normalizedName -> productId
    const productMap = new Map();
    for (const p of products) {
      const key = (p.productName || "").trim().toLowerCase();
      if (!productMap.has(key)) productMap.set(key, p._id);
      // if multiple products have same name, first one wins — change if needed
    }

    // Attach productId or collect unknowns
    const unmatchedRows = [];
    const matchAttachedStocks = [];
    for (const s of stocks) {
      const key = (s.material || "").trim().toLowerCase();
      const productId = productMap.get(key) || null;
      if (!productId) {
        unmatchedRows.push({
          rowNumber: s._rowNumber,
          lot: s.lot,
          material: s.material,
          reason: "Product not found for seller",
        });
        continue; // skip for strict approach
      }
      s.productId = productId;
      s.sellerId = sellerId;
      s.companyId = companyId;
      matchAttachedStocks.push(s);
    }

    // --------------- Duplicate detection by lot ----------------
    const lots = matchAttachedStocks.map((s) => s.lot);
    const existing = await Stock.find({ lot: { $in: lots } }).select("lot");
    const existingSet = new Set(existing.map((x) => x.lot));
    const finalList = matchAttachedStocks.filter(
      (s) => !existingSet.has(s.lot)
    );
    const duplicateSkippedCount = matchAttachedStocks.length - finalList.length;

    // Save items
    let inserted = 0;
    if (finalList.length > 0) {
      await Stock.insertMany(finalList);
      inserted = finalList.length;
    }

    // Delete uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete uploaded file", filePath, err);
    });

    // Response with detailed report
    return res.json({
      success: true,
      imported: inserted,
      skippedDuplicates: duplicateSkippedCount,
      skippedUnknownProduct: unmatchedRows.length,
      skippedTotal: rawRows.length - inserted,
      unknownRowsSample: unmatchedRows.slice(0, 10), // include sample of unknown rows
      message: "Import complete.",
    });
  } catch (error) {
    console.error("IMPORT ERROR:", error);
    return res
      .status(500)
      .json({ message: "Import failed", error: error.message });
  }
};
