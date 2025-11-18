import TeamMember from "../models/team.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import CompanyDetails from "../models/company.model.js";
import bcrypt from "bcryptjs";
/* --------------------- CREATE MEMBER --------------------- */
// export const addTeamMember = async (req, res) => {
//   try {
//     const { name, role, site } = req.body;

//     const member = await TeamMember.create({
//       name,
//       role,
//       site,
//       sellerId: req.user.userId,
//     });

//     res.status(201).json({ success: true, member });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

export const addTeamMember = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { name, email, mobile, role, site } = req.body;
    const sellerId = req.user.userId;

    // 1️⃣ Fetch company properly
    const company = await CompanyDetails.findOne({ sellerId }).session(session);
    if (!company) throw new Error("Company not found");

    // 2️⃣ Create user first
    const newUser = await User.create(
      [
        {
          email,
          mobile,
          password: "123456", // or generate random
          role: "user",
          status: "active",
        },
      ],
      { session }
    );

    // 3️⃣ Create team member
    const teamMember = await TeamMember.create(
      [
        {
          name,
          email,
          mobile,
          role,
          site,
          sellerId,
          companyId: company._id, // ✔ MUST be ObjectId
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Team member + user created successfully",
      member: teamMember[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating team member + user:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* --------------------- GET MEMBERS --------------------- */
export const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({
      sellerId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* --------------------- UPDATE MEMBER --------------------- */
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, site, lastActive } = req.body;

    const updated = await TeamMember.findOneAndUpdate(
      { _id: id, sellerId: req.user.userId },
      { name, role, site, lastActive },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Team member not found" });
    }

    res.status(200).json({ success: true, member: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* --------------------- DELETE MEMBER --------------------- */
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TeamMember.findOneAndDelete({
      _id: id,
      sellerId: req.user.userId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Team member not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
