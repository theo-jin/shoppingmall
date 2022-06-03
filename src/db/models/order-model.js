import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("orders", OrderSchema);

export class OrderModel {
  // Id로 주문 조회
  async findById(orderId) {
    const order = await Order.findOne({ _id: orderId }).populate("products");
    return order;
  }

  //userId 로 주문 정보 조회
  async findByUserId(userId) {
    const orders = await Order.find({ userId }).populate("products");
    return orders;
  }

  //order db 에 저장
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  //주문 정보 삭제
  async deleteOrder(orderId) {
    const deletedOrder = await Order.deleteOne({ _id: orderId });
    return deletedOrder;
  }
}

const orderModel = new OrderModel();

export { orderModel };
