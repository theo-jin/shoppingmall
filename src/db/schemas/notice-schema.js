import { Schema } from "mongoose";

const NoticeSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      default: "관리자",
    },
  },
  {
    collection: "notices",
    timestamps: true,
  }
);

export { NoticeSchema };
