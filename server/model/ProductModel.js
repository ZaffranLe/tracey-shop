const mongoose = require("mongoose");
const URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);

const productPropertiesSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    slug: "name",
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  sale: {
    type: Number,
    required: true,
    default: 0,
  },
  thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ImageResource",
    default: null,
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manufacturer",
    default: null,
  },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "ImageResource" }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  properties: [{ type: productPropertiesSchema }],
  stock: {
    type: Number,
    required: true,
    default: 100,
  },
  warrantyDuration: {
    type: Number,
    required: true,
    default: 0,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
