import { orderModel, scoreModel } from "../db";

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  // 주문 목록을 받음.
  async getOrders() {
    const orders = await this.orderModel.findAll();
    return orders;
  }

  // orderId로 주문 정보 찾기
  async getOrder(orderId) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new Error("주문 정보가 없습니다.");
    }
    return order;
  }

  //사용자 주문 정보 조회하기
  async getOrdersByUserId(userId) {
    //phoneNumber가 있는지 조회
    const orders = await this.orderModel.findByUserId(userId);
    //phoneNumber가 존재하지 않을 때
    if (!orders) {
      return `주문 정보가 없습니다.`;
    }

    return orders;
  }

  //주문 정보 db에 저장하기
  async addOrder(orderInfo) {
    // db에 저장
    const createdNewOrder = await this.orderModel.create(orderInfo);
    orderInfo.products.foreach(async (el) => {
      const createdNewReview = await scoreModel.create({
        userId: orderInfo.userId,
        product: {
          productId: el.productId,
          productName: el.productName,
        },
        reviewScore: 0,
        orderedAt: orderInfo.createdAt,
      });
    });

    return createdNewOrder;
  }

  // 주문 정보 삭제
  async deleteOrderId(orderId) {
    // 주문 정보 유무 확인
    const userOrder = await this.orderModel.findById(orderId);
    if (!userOrder) {
      throw new Error("해당 주문은 존재하지 않습니다.");
    }

    // 주문 정보 유무를 확인 했으니 주문 정보 삭제를 진행함
    // db에 반영
    const deletedResult = await this.orderModel.deleteOrder(orderId);

    return deletedResult;
  }

  //주문 상태 수정
  async setOrder(orderId, status) {
    // 우선 해당 주문 정보가 db에 있는지 확인
    const order = await this.orderModel.findById(orderId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new Error("주문 정보가 없습니다. 다시 한 번 확인해 주세요.");
    }

    // 주문 정보 수정 시작
    // 업데이트 진행
    const updatedResult = await this.orderModel.update({
      orderId,
      status,
    });

    return updatedResult;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
