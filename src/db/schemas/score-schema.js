import { Schema } from "mongoose";

const ScoreSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    product: {
      productId: String,
      productName: String,
    },
    reviewScore: {
      type: Number,
      required: true,
    },
    orderedAt: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "scores",
    timestamps: true,
  }
);

export { ScoreSchema };
