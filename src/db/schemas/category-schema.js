import { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    foodType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    collection: "category",
    timestamps: true,
  }
);

export { CategorySchema };
