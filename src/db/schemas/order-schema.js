import { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: new Schema(
        {
          postalCode: String,
          address1: String,
          address2: String,
        },
        { _id: false, }
      ),
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Information Received",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

export { OrderSchema };
