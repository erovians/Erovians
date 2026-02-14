import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      validate: {
        validator: function (v) {
          return !v || /^[a-zA-Z\s]+$/.test(v);
        },
        message: "Name can only contain letters and spaces",
      },
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || validator.isEmail(v);
        },
        message: "Please provide a valid email address",
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    pendingEmail: {
      type: String,
      trim: true,
      lowercase: true,
      select: false, // ✅ Hidden by default
      validate: {
        validator: function (v) {
          return !v || validator.isEmail(v);
        },
        message: "Please provide a valid email address",
      },
    },
    mobile: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || validator.isMobilePhone(v, "any");
        },
        message: "Please provide a valid phone number",
      },
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: [String],
      enum: {
        values: [
          "admin",
          "seller",
          "member",
          "user",
          "buyer",
          "sub_admin",
          "admin",
          "super_admin",
        ],
        message: "{VALUE} is not a valid role",
      },
      default: ["user"],
    },
    password: {
      type: String,
      required: false,
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [128, "Password is too long"],
      select: false,
      validate: {
        validator: function (v) {
          return !v || /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(v);
        },
        message: "Password must contain at least one letter and one number",
      },
    },
    profileURL: {
      url: {
        type: String,
        default: null,
        validate: {
          validator: function (v) {
            return !v || validator.isURL(v);
          },
          message: "Please provide a valid URL",
        },
      },
      publicId: {
        type: String,
        default: null,
      },
    },

    buyer_data: {
      buyer_status: {
        type: String,
        enum: ["individual", "business", "professional end-client"],
      },
      buyer_country: {
        type: String,
        trim: true,
        maxlength: [50, "Country name cannot exceed 50 characters"],
      },
      buyer_vat_eori: {
        type: String,
      },
      buyer_kyc_hash: {
        type: Map,
        of: String,
        default: new Map(),
      },
      buyer_signature: {
        url: {
          type: String,
          default: null,
        },
        publicId: {
          type: String,
          default: null,
        },
      },
      billing_address: [
        {
          name: {
            type: String,
            trim: true,
            maxlength: [100, "Address name cannot exceed 100 characters"],
          },
          mobile: {
            type: String,
            validate: {
              validator: function (v) {
                return !v || validator.isMobilePhone(v.toString(), "any");
              },
              message: "Please provide a valid mobile number in address",
            },
          },
          city: {
            type: String,
            trim: true,
            maxlength: [50, "City name cannot exceed 50 characters"],
          },
          state: {
            type: String,
            trim: true,
            maxlength: [50, "State name cannot exceed 50 characters"],
          },
          country: {
            type: String,
            trim: true,
            maxlength: [50, "Country name cannot exceed 50 characters"],
          },
          alternateMobile: {
            type: String,
            validate: {
              validator: function (v) {
                return !v || validator.isMobilePhone(v.toString(), "any");
              },
              message: "Please provide a valid alternate mobile number",
            },
          },
          landmark: {
            type: String,
            trim: true,
            maxlength: [200, "Landmark cannot exceed 200 characters"],
          },
          pincode: {
            type: String,
            trim: true,
            validate: {
              validator: function (v) {
                return !v || /^\d{6}$/.test(v);
              },
              message: "Please provide a valid 6-digit pincode",
            },
          },
        },
      ],
      shipping_address: [
        {
          name: {
            type: String,
            trim: true,
            maxlength: [100, "Address name cannot exceed 100 characters"],
          },
          mobile: {
            type: String,
            validate: {
              validator: function (v) {
                return !v || validator.isMobilePhone(v.toString(), "any");
              },
              message: "Please provide a valid mobile number in address",
            },
          },
          city: {
            type: String,
            trim: true,
            maxlength: [50, "City name cannot exceed 50 characters"],
          },
          state: {
            type: String,
            trim: true,
            maxlength: [50, "State name cannot exceed 50 characters"],
          },
          country: {
            type: String,
            trim: true,
            maxlength: [50, "Country name cannot exceed 50 characters"],
          },
          alternateMobile: {
            type: String,
            validate: {
              validator: function (v) {
                return !v || validator.isMobilePhone(v.toString(), "any");
              },
              message: "Please provide a valid alternate mobile number",
            },
          },
          landmark: {
            type: String,
            trim: true,
            maxlength: [200, "Landmark cannot exceed 200 characters"],
          },
          pincode: {
            type: String,
            trim: true,
            validate: {
              validator: function (v) {
                return !v || /^\d{6}$/.test(v);
              },
              message: "Please provide a valid 6-digit pincode",
            },
          },
        },
      ],
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not a valid gender",
      },
    },
    hasPassword: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "suspended", "pending"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
    },
    otp: {
      type: String,
      default: null,
      select: false,
      validate: {
        validator: function (v) {
          return !v || /^\d{6}$/.test(v);
        },
        message: "OTP must be a 6-digit number",
      },
    },
    otpExpires: {
      type: Date,
      default: null,
      select: false,
    },
    resetPasswordOtp: {
      type: String,
      default: null,
      select: false,
      validate: {
        validator: function (v) {
          return !v || /^\d{6}$/.test(v);
        },
        message: "Reset OTP must be a 6-digit number",
      },
    },
    resetPasswordOtpExpires: {
      type: Date,
      default: null,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// ======================== INDEXES ========================
userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ email: 1, status: 1 });
userSchema.index({ mobile: 1, status: 1 });
userSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0, sparse: true });
userSchema.index(
  { resetPasswordOtpExpires: 1 },
  { expireAfterSeconds: 0, sparse: true }
);
userSchema.index({ lockUntil: 1 }, { expireAfterSeconds: 0, sparse: true });

// ======================== PRE-SAVE HOOKS ========================
userSchema.pre("save", function (next) {
  if (!this.email && !this.mobile) {
    return next(new Error("Either email or mobile number is required"));
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.hasPassword = true;

    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// ======================== METHODS ========================
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password || !this.hasPassword) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.canLoginWithPassword = function () {
  return this.hasPassword && this.password !== null;
};

userSchema.methods.verifyOtp = function (candidateOtp) {
  if (!this.otp || !this.otpExpires) {
    return { valid: false, message: "No OTP found" };
  }

  if (this.otpExpires < Date.now()) {
    return { valid: false, message: "OTP has expired" };
  }

  if (this.otp !== candidateOtp) {
    return { valid: false, message: "Invalid OTP" };
  }

  return { valid: true, message: "OTP verified successfully" };
};

userSchema.methods.clearOtp = function () {
  return this.updateOne({
    $unset: { otp: 1, otpExpires: 1 },
  });
};

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.updateLastLogin = function () {
  return this.updateOne({
    $set: { lastLogin: Date.now() },
  });
};

userSchema.methods.getAccessToken = function () {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    }
  );
};

userSchema.methods.getRefreshToken = function () {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    }
  );
};

userSchema.methods.toSafeObject = function () {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.otp;
  delete userObj.otpExpires;
  delete userObj.resetPasswordOtp;
  delete userObj.resetPasswordOtpExpires;
  delete userObj.loginAttempts;
  delete userObj.lockUntil;
  return userObj;
};

userSchema.methods.hasRole = function (roleName) {
  return this.role.includes(roleName);
};

userSchema.methods.addRole = function (roleName) {
  if (!this.role.includes(roleName)) {
    return this.updateOne({ $addToSet: { role: roleName } });
  }
};

userSchema.methods.removeRole = function (roleName) {
  return this.updateOne({ $pull: { role: roleName } });
};

// ======================== VIRTUAL ========================
userSchema.virtual("profile").get(function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    mobile: this.mobile,
    photoURL: this.profileURL?.url || null,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    isMobileVerified: this.isMobileVerified,
    status: this.status,
    hasPassword: this.hasPassword,
  };
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// ======================== STATICS ========================
userSchema.statics.findByEmail = function (email) {
  if (!email) return null;
  return this.findOne({ email: email.toLowerCase().trim() });
};

userSchema.statics.findByMobile = function (mobile) {
  if (!mobile) return null;
  return this.findOne({ mobile: mobile.trim() });
};

userSchema.statics.findByEmailOrMobile = function (identifier) {
  if (!identifier) return null;

  identifier = identifier.trim();
  const isEmail = validator.isEmail(identifier);

  if (isEmail) {
    return this.findOne({ email: identifier.toLowerCase() });
  } else {
    return this.findOne({ mobile: identifier });
  }
};

userSchema.statics.findByEmailWithAuth = function (email) {
  if (!email) return null;
  return this.findOne({ email: email.toLowerCase().trim() }).select(
    "+password +otp +otpExpires +resetPasswordOtp +resetPasswordOtpExpires +loginAttempts +lockUntil"
  );
};

userSchema.statics.findByMobileWithAuth = function (mobile) {
  if (!mobile) return null;
  return this.findOne({ mobile: mobile.trim() }).select(
    "+password +otp +otpExpires +resetPasswordOtp +resetPasswordOtpExpires +loginAttempts +lockUntil"
  );
};

userSchema.statics.findByIdentifierWithAuth = function (identifier) {
  if (!identifier) return null;

  identifier = identifier.trim();
  const isEmail = validator.isEmail(identifier);
  const query = isEmail
    ? { email: identifier.toLowerCase() }
    : { mobile: identifier };

  return this.findOne(query).select(
    "+password +otp +otpExpires +resetPasswordOtp +resetPasswordOtpExpires +loginAttempts +lockUntil"
  );
};

userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findByEmailWithAuth(email);
};

userSchema.statics.findByMobileWithPassword = function (mobile) {
  return this.findByMobileWithAuth(mobile);
};

userSchema.statics.findByIdentifierWithPassword = function (identifier) {
  return this.findByIdentifierWithAuth(identifier);
};

const User = mongoose.model("User", userSchema);

export default User;
