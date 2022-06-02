import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("orders", OrderSchema);

export class OrderModel {
  //phoneNumber 로 주문 정보 조회
  async findByPhoneNumber(phoneNumber) {
    const orders = await Order.find({ phoneNumber });
    return orders;
  }

  //order db 에 저장
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  //fullName 로 주문 정보 조회
  async findByFullName(fullName) {
    const order = await Order.findOne({ fullName });
    return order;
  }

  //주문 정보 삭제
  async delete(fullName) {
    const deleteOrder = await Order.deleteOne({ fullName });
    return deleteOrder;
  }
}

const orderModel = new OrderModel();

export { orderModel };
