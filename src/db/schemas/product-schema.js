import { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productContent: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    reviewScore: {
      type: Number,
      required: false,
      default: 0.0,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

export { ProductSchema };
