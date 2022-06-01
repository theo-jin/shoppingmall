import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { productService } from "../services";

const productRouter = Router();

// 상품 추가 api
productRouter.post("/add", loginRequired, async function (req, res, next) {
  try {

    // 관리자 권한이 아니면 error
    if (req.currentUserRole !== "admin") {
      throw new Error("권한이 없습니다.");
    }

    // req.body가 비어있는 경우 error
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    //req.body 데이터 가져오기
    const productName = req.body.productName;
    const productContent = req.body.productContent;
    const productPrice = req.body.productPrice;
    const productImage = req.body.productImage;
    const category = req.body.category;

    // 생성된 데이터 product DB에 추가하기
    const newProduct = await productService.addProduct({
      productName,
      productContent,
      productPrice,
      productImage,
      category,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
