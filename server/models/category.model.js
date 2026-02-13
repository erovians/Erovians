import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    subcategories: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    description: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ========== INDEXES ==========
CategorySchema.index({ isActive: 1, order: 1 });

// ========== METHODS ==========
CategorySchema.methods.hasSubcategory = function (subcat) {
  return this.subcategories.includes(subcat);
};

// ========== STATICS ==========
CategorySchema.statics.getActiveCategories = function () {
  return this.find({ isActive: true }).sort({ order: 1 });
};

CategorySchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, isActive: true });
};

// ========== JSON TRANSFORM ==========
CategorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;
