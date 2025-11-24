import Contract from "../models/contracts.model.js";
import Order from "../models/Order.model.js";

export const addContract = async (req, res) => {
  try {
    const { order, client, status } = req.body;

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
    });

    // Update order status
    await Order.findByIdAndUpdate(order, { status: "contract_created" });

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
    const contracts = await Contract.find().sort({ createdAt: -1 });
    res.status(200).json(contracts);
  } catch (error) {
    console.error("Fetch Contract Error:", error);
    res.status(500).json({ message: "Server error while fetching contracts" });
  }
};
