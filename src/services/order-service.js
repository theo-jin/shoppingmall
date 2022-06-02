import { orderModel } from "../db";

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  //사용자 주문 정보 조회하기
  async getOrdersByPhoneNumber(phoneNumber) {
    //phoneNumber가 있는지 조회
    const orders = await this.orderModel.findByPhoneNumber(phoneNumber);
    //phoneNumber가 존재하지 않을 때
    if (orders.length < 1) {
      return `주문 정보가 없습니다.`;
    }

    return orders;
  }

  //주문 정보 db에 저장하기
  async addOrder(orderInfo) {
    // 객체 destructuring
    const { fullName, phoneNumber, address, status, totalPrice } = orderInfo;

    const newOrderInfo = {
      fullName,
      phoneNumber,
      address,
      status,
      totalPrice,
    };

    // db에 저장
    const createdNewOrder = await this.orderModel.create(newOrderInfo);

    return createdNewOrder;
  }

  //주문 정보 삭제
  async deleteOrder(phoneNumber, fullName) {
    // 주문 정보 유무 확인
    const orders = await this.orderModel.findByPhoneNumber(phoneNumber);
    if (orders) {
      const order = await this.orderModel.findByFullName(fullName);
      if (!order) {
        throw new Error(
          "이 주문 정보는 db에 없습니다."
        );
      }

      // 주문 정보 유무를 확인 했으니 주문 정보 삭제를 진행함
      // db에 반영
      const deleteOrder = await this.orderModel.delete(fullName);

      return deleteOrder;
    }
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
