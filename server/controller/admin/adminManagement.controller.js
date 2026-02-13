import User from "../../models/user.model.js";
import asyncHandler from "../../middleware/buyer/asyncHandler.js";
import AppError from "../../utils/buyer/AppError.js";
import sendMail from "../../utils/buyer/sendEmailByBrevo.js";
import logger from "../../config/winston.js";
import crypto from "crypto";

// ==========================================
// HELPER: Generate Strong Random Password
// ==========================================
const generatePassword = () => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "@#$%&*!";
  const all = upper + lower + digits + special;

  let password =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    digits[Math.floor(Math.random() * digits.length)] +
    special[Math.floor(Math.random() * special.length)];

  for (let i = 4; i < 10; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

// ==========================================
// 1. CREATE ADMIN (Only Super Admin)
// ==========================================
export const createAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, mobile, assignedPermissions } = req.body;

  // Sirf super_admin hi admin bana sakta hai
  if (!req.user.role.includes("super_admin")) {
    return next(
      new AppError("Only Super Admin can create admin accounts", 403)
    );
  }

  if (!email && !mobile) {
    return next(new AppError("Email or mobile is required", 400));
  }

  // Check existing user
  const existingUser = await User.findByEmailOrMobile(email || mobile);
  if (existingUser) {
    return next(
      new AppError("User with this email or mobile already exists", 409)
    );
  }

  // Auto-generate password
  const rawPassword = generatePassword();

  // Create admin user
  const newAdmin = await User.create({
    name,
    email: email || undefined,
    mobile: mobile || undefined,
    password: rawPassword,
    role: ["admin"],
    status: "active",
    isEmailVerified: email ? true : false,
    isMobileVerified: mobile ? true : false,
    // Store which permissions this admin has
    adminPermissions: assignedPermissions || [],
    createdBy: req.user.id,
  });

  // Send credentials via email
  if (email) {
    try {
      await sendMail({
        email,
        subject: "Your Admin Account Credentials",
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4f46e5;">Admin Account Created</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your admin account has been created. Here are your login credentials:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Login Email/Mobile:</strong> ${email || mobile}</p>
              <p><strong>Temporary Password:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 18px;">${rawPassword}</code></p>
            </div>
            <p style="color: #ef4444;">Please change your password after first login.</p>
            <p>Login URL: <a href="${process.env.ADMIN_FRONTEND_URL}/login">${
          process.env.ADMIN_FRONTEND_URL
        }/login</a></p>
          </div>
        `,
      });
    } catch (err) {
      logger.error("Failed to send admin credentials email", {
        error: err.message,
      });
    }
  }

  logger.info("New admin created", {
    createdBy: req.user.id,
    newAdminId: newAdmin._id,
    email,
  });

  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: {
      id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      mobile: newAdmin.mobile,
      role: newAdmin.role,
      status: newAdmin.status,
      generatedPassword: rawPassword, // Frontend pe dikhane ke liye (ek baar)
    },
  });
});

// ==========================================
// 2. GET ALL ADMINS (Only Super Admin)
// ==========================================
export const getAllAdmins = asyncHandler(async (req, res, next) => {
  if (!req.user.role.includes("super_admin")) {
    return next(new AppError("Access denied", 403));
  }

  const admins = await User.find({
    role: { $in: ["admin", "sub_admin"] },
  }).select(
    "name email mobile role status lastLogin createdAt adminPermissions"
  );

  res.status(200).json({
    success: true,
    count: admins.length,
    data: admins,
  });
});

// ==========================================
// 3. UPDATE ADMIN PERMISSIONS (Only Super Admin)
// ==========================================
export const updateAdminPermissions = asyncHandler(async (req, res, next) => {
  if (!req.user.role.includes("super_admin")) {
    return next(new AppError("Only Super Admin can update permissions", 403));
  }

  const { adminId } = req.params;
  const { permissions, status } = req.body;

  const admin = await User.findById(adminId);
  if (!admin) {
    return next(new AppError("Admin not found", 404));
  }

  // Super admin ko modify nahi kar sakte
  if (admin.role.includes("super_admin")) {
    return next(new AppError("Cannot modify Super Admin account", 403));
  }

  const updateData = {};
  if (permissions !== undefined) updateData.adminPermissions = permissions;
  if (status !== undefined) updateData.status = status;

  const updated = await User.findByIdAndUpdate(adminId, updateData, {
    new: true,
    runValidators: true,
  }).select("name email mobile role status adminPermissions");

  res.status(200).json({
    success: true,
    message: "Admin updated successfully",
    data: updated,
  });
});

// ==========================================
// 4. DELETE / SUSPEND ADMIN (Only Super Admin)
// ==========================================
export const suspendAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user.role.includes("super_admin")) {
    return next(new AppError("Only Super Admin can suspend admins", 403));
  }

  const { adminId } = req.params;

  const admin = await User.findById(adminId);
  if (!admin) return next(new AppError("Admin not found", 404));

  if (admin.role.includes("super_admin")) {
    return next(new AppError("Cannot suspend Super Admin", 403));
  }

  await User.findByIdAndUpdate(adminId, { status: "suspended" });

  res.status(200).json({
    success: true,
    message: "Admin suspended successfully",
  });
});

// ==========================================
// 5. GET PERMISSIONS FOR LOGGED-IN ADMIN
// ==========================================
export const getMyPermissions = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("role adminPermissions");

  if (!user) return next(new AppError("User not found", 404));

  // Super admin ke paas saari permissions hain
  const isSuperAdmin = user.role.includes("super_admin");

  const ALL_PERMISSIONS = [
    "dashboard",
    "sellers",
    "buyers",
    "company",
    "orders",
    "payments",
    "inquiries",
    "requests",
    "settings",
  ];

  res.status(200).json({
    success: true,
    data: {
      role: user.role,
      isSuperAdmin,
      permissions: isSuperAdmin ? ALL_PERMISSIONS : user.adminPermissions || [],
    },
  });
});
