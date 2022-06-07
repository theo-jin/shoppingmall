import { Schema } from "mongoose";

const NoticeSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
      default: "관리자",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    collection: "notices",
    timestamps: true,
  }
);

export { NoticeSchema };
