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
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Stocks");

    sheet.columns = [
      { header: "Lot", key: "lot", width: 20 },
      { header: "Material", key: "material", width: 25 },
      { header: "Thickness", key: "thickness", width: 15 },
      { header: "Dimensions", key: "dimensions", width: 20 },
      { header: "Location", key: "location", width: 20 },
      { header: "Quality", key: "quality", width: 10 },
      { header: "Qty", key: "qty", width: 10 },
    ];

    const stocks = await Stock.find().lean();

    stocks.forEach((item) => {
      sheet.addRow({
        lot: item.lot,
        material: item.material,
        thickness: item.thickness,
        dimensions: item.dimensions,
        location: item.location,
        quality: item.quality,
        qty: item.qty,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=stocks.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("EXPORT ERROR:", error);
    res.status(500).json({ message: "Failed to export" });
  }
};

// ✅ Import Stocks (CSV + Excel + Validation + Dedupe + File Cleanup)
export const importStocks = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    // get the companyId for this seller
    const company = await CompanyDetails.findOne({ sellerId }).select("_id");
    if (!company) {
      return res.status(400).json({ message: "Company not found for seller" });
    }
    const companyId = company._id;

    const filePath = req.file.path;
    const workbook = new ExcelJS.Workbook();

    // Detect CSV vs XLSX
    if (filePath.endsWith(".csv")) {
      await workbook.csv.readFile(filePath);
    } else {
      await workbook.xlsx.readFile(filePath);
    }

    const sheet = workbook.getWorksheet(1) || workbook.worksheets[0];
    const stocks = [];

    // Parse rows
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const val = (cell) =>
        typeof cell.value === "object" ? cell.value?.text : cell.value;

      const item = {
        lot: val(row.getCell(1)),
        material: val(row.getCell(2)),
        thickness: val(row.getCell(3)),
        dimensions: val(row.getCell(4)),
        location: val(row.getCell(5)),
        quality: val(row.getCell(6)),
        qty: val(row.getCell(7)),
      };

      if (!item.lot || !item.material) return;

      stocks.push(item);
    });

    // Avoid duplicates
    const existing = await Stock.find({
      lot: { $in: stocks.map((s) => s.lot) },
    }).select("lot");

    const existingSet = new Set(existing.map((x) => x.lot));
    const finalList = stocks.filter((s) => !existingSet.has(s.lot));

    // ⭐ ADD sellerId & companyId TO EACH ITEM
    finalList.forEach((item) => {
      item.sellerId = sellerId;
      item.companyId = companyId;
    });

    // Save items
    if (finalList.length > 0) {
      await Stock.insertMany(finalList);
    }

    // Delete uploaded file
    fs.unlink(filePath, () => {});

    res.json({
      success: true,
      imported: finalList.length,
      skipped: stocks.length - finalList.length,
      message: "Import complete",
    });
  } catch (error) {
    console.error("IMPORT ERROR:", error);
    res.status(500).json({ message: "Import failed" });
  }
};
