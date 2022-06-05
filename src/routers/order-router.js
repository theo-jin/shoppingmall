import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminAuthorized, } from "../middlewares";
import { orderService } from "../services";

const orderRouter = Router();

// 전체 주문 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
orderRouter.get("/list", loginRequired, adminAuthorized, async function (req, res, next) {
  try {
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
    const { fullName, phoneNumber, address, products, status, totalPrice } =
      req.body;

    // 위 데이터를 주문 정보 db에 추가하기
    const newOrder = await orderService.addOrder({
      userId,
      fullName,
      phoneNumber,
      address,
      products,
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
orderRouter.delete("/:orderId", loginRequired, async (req, res, next) => {
  try {
    // req (request)의 params 에서 데이터 가져오기
    const { orderId } = req.params;

    // 로그인한 유저 정보 가져오기
    const userId = req.currentUserId;
    const userRole = req.currentUserRole;

    // 주문한 사용자와 일치하지 않을 경우
    const order = await orderService.getOrder(orderId);
    const orderUserId = order.userId;

    if (userRole !== "admin" && orderUserId !== userId) {
      throw new Error("주문하신 사용자와 일치하지 않습니다.");
    }

    // 관리자 권한이거나 사용자 정보가 일치할 때 삭제
    let deletedResult;
    if (userRole === "admin" || orderUserId === userId) {
      deletedResult = await orderService.deleteOrderId(orderId);
    }

    //삭제 성공
    if (deletedResult.deletedCount !== 1) {
      throw new Error(`${deletedOrder}을 삭제 실패했습니다.`);
    }
    res.status(201).json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

//관리자가 주문 상태 수정
orderRouter.patch("/:orderId", loginRequired, adminAuthorized, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // params로부터 orderId 가져옴
    const orderId = req.params.orderId;

    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // body data 로부터 업데이트할 카테고리 정보를 추출함.
    const status = req.body.status;

    // 주문 상태 정보를 업데이트함.
    const updatedOrderInfo = await orderService.setOrder(orderId, { status });

    // 업데이트 이후의 카테고리 데이터를 프론트에 보내 줌
    res.status(200).json(updatedOrderInfo);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
