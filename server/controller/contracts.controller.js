import Contract from "../models/contracts.model.js";
import Order from "../models/Order.model.js";
import PDFDocument from "pdfkit";
import { cache } from "../services/cache.service.js";

export const addContract = async (req, res) => {
  try {
    const { order, client, status } = req.body;
    const user = req.user?.userId;

    if (!order || !client) {
      return res.status(400).json({ message: "Order & Client are required" });
    }

    const existing = await Contract.findOne({ order });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Contract already exists for this order" });
    }

    const contractId = "CT-" + Date.now().toString().slice(-5);

    const newContract = await Contract.create({
      contractId,
      order,
      client,
      status,
      sellerId: user,
    });

    res.status(201).json({
      message: "Contract created successfully",
      contract: newContract,
    });
  } catch (error) {
    console.error("Create Contract Error:", error);
    res.status(500).json({ message: "Server error while creating contract" });
  }
};

export const getContracts = async (req, res) => {
  try {
    const sellerId = req.user?.userId;
    const cacheKey = `contracts:${sellerId}`;

    const cachedContracts = await cache.get(cacheKey);

    if (cachedContracts) {
      console.log("🔥Contract Redis HIT:", cacheKey);
      return res.status(200).json(cachedContracts);
    }

    const contracts = await Contract.find({ sellerId }).sort({ createdAt: -1 });

    await cache.set(cacheKey, contracts);

    return res.status(200).json(contracts);
  } catch (error) {
    console.error("Fetch Contract Error:", error);
    res.status(500).json({ message: "Server error while fetching contracts" });
  }
};

export const updateContractStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updated = await Contract.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json({
      message: "Contract status updated successfully",
      contract: updated,
    });
  } catch (error) {
    console.error("Update Contract Status Error:", error);
    res.status(500).json({ message: "Server error while updating status" });
  }
};
export const downloadContractPDF = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contract_${contract.contractId}.pdf`
    );

    doc.pipe(res);

    const orderShort = contract.order.toString().slice(-8);
    const createdFormatted = new Date(contract.created).toLocaleDateString();

    doc.fontSize(18).text("Contract Details", { underline: true });
    doc.moveDown();

    doc.fontSize(12).text(`Contract ID: ${contract.contractId}`);
    doc.text(`Order: ${orderShort}`);
    doc.text(`Client: ${contract.client}`);
    doc.text(`Status: ${contract.status}`);
    doc.text(`Created: ${createdFormatted}`);

    doc.end();
  } catch (error) {
    console.error("PDF Download Error:", error);
    res.status(500).json({ message: "Error generating PDF" });
  }
};
