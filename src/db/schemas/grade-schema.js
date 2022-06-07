import { Schema } from "mongoose";

const GradeSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    reviewScore: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "grades",
    timestamps: true,
  }
);

export { GradeSchema };
