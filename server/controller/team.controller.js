import mongoose from "mongoose";
import TeamMember from "../models/team.model.js";
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.utils.js";
import bcrypt from "bcryptjs";
import { cache } from "../services/cache.service.js";
import { resolvePermissions } from "../utils/permission.utils.js";

export const addTeamMember = async (req, res) => {
  const session = await mongoose.startSession();
  let uploaded = null;
  try {
    session.startTransaction();

    // const { name, email, mobile, role, site } = req.body;
    const { name, email, mobile, role, site, permission } = req.body;

    if (!name || !email || !mobile) {
      throw new Error("name email mobile Required");
    }

    // Check email exists
    const emailExists = await User.findOne({ email }).session(session);
    if (emailExists) {
      throw new Error("Email already exists");
    }

    // Check mobile exists
    const mobileExists = await User.findOne({ mobile }).session(session);
    if (mobileExists) {
      throw new Error("Mobile number already exists");
    }

    const finalPermissions = resolvePermissions(role, permission);

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
          permission: finalPermissions,
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
    await cache.del(`team:seller:${sellerId}`);
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

// export const getTeamMembers = async (req, res) => {
//   try {
//     const members = await TeamMember.find({ sellerId: req.user.userId }).sort({
//       createdAt: -1,
//     });
//     res.json({ success: true, members });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
export const getTeamMembers = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const cacheKey = `team:seller:${sellerId}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      console.log("🔥 Redis HIT getTeamMembers:", cacheKey);
      return res.json({
        success: true,
        members: cached,
        fromCache: true,
      });
    }

    const members = await TeamMember.find({ sellerId })
      .sort({ createdAt: -1 })
      .lean();

    await cache.set(cacheKey, members, 300);

    res.json({
      success: true,
      members,
      fromCache: false,
    });
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
    const { name, email, mobile, role, site, permission } = req.body;

    const sellerId = req.user.userId;

    const existing = await TeamMember.findOne({ _id: id, sellerId }).session(
      session
    );
    if (!existing) throw new Error("Team member not found");

    if (req.file) {
      uploaded = await uploadOnCloudinary(req.file.path, "team_members");
      if (!uploaded?.secure_url) throw new Error("Photo upload failed");
    }

    const finalPermissions = resolvePermissions(role, permission);

    const updated = await TeamMember.findOneAndUpdate(
      { _id: id, sellerId },
      {
        name,
        email,
        mobile,
        role,
        site,
        permission: finalPermissions,
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

    await cache.del(`team:seller:${sellerId}`);

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
    await cache.del(`team:seller:${sellerId}`);
    res.json({ success: true });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete failed", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
