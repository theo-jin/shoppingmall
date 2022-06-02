import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { orderService } from "../services";

const orderRouter = Router();

//사용자 주문 정보 조회
orderRouter.get(
  "/:phoneNumber",
  loginRequired,
  async function (req, res, next) {
    try {
      const { phoneNumber } = req.params;

      const orders = await orderService.getOrdersByPhoneNumber(phoneNumber);

      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
);

//사용자 주문 정보 db 에 저장
orderRouter.post("/", loginRequired, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const fullName = req.body.fullName;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const status = req.body.status;
    const totalPrice = req.body.totalPrice;

    // 위 데이터를 주문 정보 db에 추가하기
    const newOrder = await orderService.addOrder({
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
orderRouter.delete("/:phoneNumber/:fullName", loginRequired, async (req, res, next) => {
  try {
    // req (request)의 params 에서 데이터 가져오기
    const { phoneNumber, fullName } = req.params;

    // 위 데이터를 주문 정보 db에서 삭제하기
    const deletedOrder = await orderService.deleteOrder(phoneNumber, fullName);

    //삭제 성공
    if (deletedOrder.deletedCount === 1) {
      res.status(201).json({ message: "OK" });
    }
    //삭제 실패
    else {
      throw new Error(`${deletedOrder}을 삭제 실패했습니다.`);
    }
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
