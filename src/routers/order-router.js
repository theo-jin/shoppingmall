import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { orderService } from "../services";

const orderRouter = Router();

// 전체 주문 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
orderRouter.get("/orderlist", loginRequired, async function (req, res, next) {
  try {
    const userRole = req.currentUserRole;
    if (userRole !== "admin") {
      throw new Error("권한이 없습니다.");
    }
    // 전체 사용자 목록을 얻음
    const orders = await orderService.getOrders();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

//사용자 주문 정보 조회
orderRouter.get("/user", loginRequired, async function (req, res, next) {
  try {
    const userId = req.currentUserId;

    const orders = await orderService.getOrdersByUserId(userId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

//사용자 주문 정보 db 에 저장
orderRouter.post("/complete", loginRequired, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const userId = req.currentUserId;

    // req (request)의 body 에서 데이터 가져오기
    const fullName = req.body.fullName;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const status = req.body.status;
    const totalPrice = req.body.totalPrice;

    // 위 데이터를 주문 정보 db에 추가하기
    const newOrder = await orderService.addOrder({
      userId,
      fullName,
      phoneNumber,
      address,
      status,
      totalPrice,
    });

    // 주문 정보 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

//사용자 주문 취소
orderRouter.delete("/:userId/:orderId", loginRequired, async (req, res, next) => {
  try {
    // req (request)의 params 에서 데이터 가져오기
    const { userId, orderId } = req.params;

    // 위 데이터를 주문 정보 db에서 삭제하기
    const deletedResult = await orderService.deleteOrder(userId,orderId);

    //삭제 성공
    if (deletedResult.deletedCount !== 1) {
      throw new Error(`${deletedOrder}을 삭제 실패했습니다.`);
    }
    res.status(201).json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

//관리자가 주문 취소
orderRouter.delete("/:orderId", loginRequired, async (req, res, next) => {
  try {

    const userRole = req.currentUserRole;
    if (userRole !== "admin") {
      throw new Error("권한이 없습니다.");
    }

    // req (request)의 params 에서 데이터 가져오기
    const { orderId } = req.params;

    // 위 데이터를 주문 정보 db에서 삭제하기
    const deletedResult = await orderService.deleteOrderId(orderId);

    //삭제 성공
    if (deletedResult.deletedCount !== 1) {
      throw new Error(`${deletedOrder}을 삭제 실패했습니다.`);
    }
    res.status(201).json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
