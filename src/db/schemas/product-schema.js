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
  },
  {
    collection: "products",
    timestamps: true,
  }
);

export { ProductSchema };
