// import TeamMember from "../models/team.model.js";
// import mongoose from "mongoose";
// import User from "../models/user.model.js";
// import CompanyDetails from "../models/company.model.js";
// import bcrypt from "bcryptjs";
// /* --------------------- CREATE MEMBER --------------------- */
// export const addTeamMember = async (req, res) => {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const { name, email, mobile, role, site } = req.body;
//     const sellerId = req.user.userId;

//     // 1️⃣ Fetch company properly
//     const company = await CompanyDetails.findOne({ sellerId }).session(session);
//     if (!company) throw new Error("Company not found");

//     // 2️⃣ Create user first
//     const newUser = await User.create(
//       [
//         {
//           email,
//           mobile,
//           password: "123456", // or generate random
//           role: "user",
//           status: "active",
//         },
//       ],
//       { session }
//     );

//     // 3️⃣ Create team member
//     const teamMember = await TeamMember.create(
//       [
//         {
//           name,
//           email,
//           mobile,
//           role,
//           site,
//           sellerId,
//           companyId: company._id, // ✔ MUST be ObjectId
//         },
//       ],
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       success: true,
//       message: "Team member + user created successfully",
//       member: teamMember[0],
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();

//     console.error("Error creating team member + user:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// /* --------------------- GET MEMBERS --------------------- */
// export const getTeamMembers = async (req, res) => {
//   try {
//     const members = await TeamMember.find({
//       sellerId: req.user.userId,
//     }).sort({ createdAt: -1 });

//     res.status(200).json({ success: true, members });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /* --------------------- UPDATE MEMBER --------------------- */
// export const updateTeamMember = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, role, site, lastActive } = req.body;

//     const updated = await TeamMember.findOneAndUpdate(
//       { _id: id, sellerId: req.user.userId },
//       { name, role, site, lastActive },
//       { new: true }
//     );

//     if (!updated) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Team member not found" });
//     }

//     res.status(200).json({ success: true, member: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /* --------------------- DELETE MEMBER --------------------- */
// export const deleteTeamMember = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await TeamMember.findOneAndDelete({
//       _id: id,
//       sellerId: req.user.userId,
//     });

//     if (!deleted) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Team member not found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Member deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// server/controllers/team.controller.js
import mongoose from "mongoose";
import TeamMember from "../models/team.model.js";
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.utils.js";
import bcrypt from "bcryptjs";

export const addTeamMember = async (req, res) => {
  const session = await mongoose.startSession();
  let uploaded = null;
  try {
    session.startTransaction();

    const { name, email, mobile, role, site } = req.body;
    const sellerId = req.user.userId;

    const company = await Company.findOne({ sellerId }).session(session);
    if (!company) {
      throw new Error("Company not found for this seller");
    }

    if (req.file) {
      uploaded = await uploadOnCloudinary(req.file.path, "team_members");
      if (!uploaded?.secure_url) throw new Error("Photo upload failed");
    }

    // create user account for team member
    const rawPassword = Math.random().toString(36).slice(-8) || "123456";
    const hashed = await bcrypt.hash(rawPassword, 10);

    const [newUser] = await User.create(
      [
        {
          email,
          mobile,
          password: hashed,
          role: "user",
          status: "active",
        },
      ],
      { session }
    );

    // create team member doc
    const [teamMember] = await TeamMember.create(
      [
        {
          name,
          email,
          mobile,
          role,
          site,
          sellerId,
          companyId: company._id,
          photo: uploaded?.secure_url || null,
          photoPublicId: uploaded?.public_id || null,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // TODO: optionally send invite email with credentials (rawPassword)

    res.status(201).json({ success: true, member: teamMember });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    // rollback cloudinary upload if any
    if (uploaded?.public_id) {
      try {
        await deleteFromCloudinary(uploaded.public_id);
      } catch (e) {
        console.error("Cloudinary rollback failed", e);
      }
    }

    console.error("Error creating team member + user:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ sellerId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, members });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTeamMember = async (req, res) => {
  const session = await mongoose.startSession();
  let uploaded = null;

  try {
    session.startTransaction();

    const { id } = req.params;
    const { name, email, mobile, role, site } = req.body;
    const sellerId = req.user.userId;

    const existing = await TeamMember.findOne({ _id: id, sellerId }).session(
      session
    );
    if (!existing) throw new Error("Team member not found");

    if (req.file) {
      uploaded = await uploadOnCloudinary(req.file.path, "team_members");
      if (!uploaded?.secure_url) throw new Error("Photo upload failed");
    }

    const updated = await TeamMember.findOneAndUpdate(
      { _id: id, sellerId },
      {
        name,
        email,
        mobile,
        role,
        site,
        photo: uploaded?.secure_url || existing.photo,
        photoPublicId: uploaded?.public_id || existing.photoPublicId,
      },
      { new: true, session }
    );

    // optional: update User record's email/mobile
    await User.findOneAndUpdate(
      { email: existing.email },
      { email, mobile },
      { session }
    ).catch(() => {});

    await session.commitTransaction();
    session.endSession();

    // remove old photo after commit (best-effort)
    if (req.file && existing.photoPublicId) {
      try {
        await deleteFromCloudinary(existing.photoPublicId);
      } catch (e) {
        console.error("Failed to delete old image from cloudinary", e);
      }
    }

    res.json({ success: true, member: updated });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    if (uploaded?.public_id) {
      try {
        await deleteFromCloudinary(uploaded.public_id);
      } catch (e) {
        console.error("Cloudinary rollback failed", e);
      }
    }

    console.error("Update failed", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteTeamMember = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;
    const sellerId = req.user.userId;

    const existing = await TeamMember.findOne({ _id: id, sellerId }).session(
      session
    );
    if (!existing) throw new Error("Member not found");

    // delete DB doc
    await TeamMember.deleteOne({ _id: id, sellerId }).session(session);

    // optionally delete the user record if you want:
    await User.deleteOne({ email: existing.email })
      .session(session)
      .catch(() => {});

    await session.commitTransaction();
    session.endSession();

    // delete photo if present
    if (existing.photoPublicId) {
      try {
        await deleteFromCloudinary(existing.photoPublicId);
      } catch (e) {
        console.error("Failed to delete photo from cloudinary", e);
      }
    }

    res.json({ success: true });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete failed", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
