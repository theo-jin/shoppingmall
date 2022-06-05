import { Router } from "express";
import is from "@sindresorhus/is";
import multer from "multer";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminAuthorized } from "../middlewares";
import { productService } from "../services";

const productRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 상품 전체 조회
productRouter.get(
  "/list",
  loginRequired,
  adminAuthorized,
  async function (req, res, next) {
    try {
      const products = await productService.getProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
);

// 상품 카테고리 별 조회
//?category={}
productRouter.get("", async function (req, res, next) {
  try {
    const category = req.query.category;

    const products = await productService.getProductsByCategory(category);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 상품 상세 정보
// ?id={}
productRouter.get("/detail", async function (req, res, next) {
  try {
    const productId = req.query.id;

    const product = await productService.getProduct(productId);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// 상품 추가 api (관리자만 접근 가능)
productRouter.post(
  "/",
  loginRequired,
  adminAuthorized,
  upload.single("productImage"),
  async function (req, res, next) {
    try {
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
      const productImage = req.file.filename;
      // TODO: 선택하기
      // const productImage = req.file.path;
      const category = req.body.category;

      //생성된 데이터 product DB에 추가하기
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
  }
);

// 상품 수정
productRouter.patch(
  "/:productName",
  loginRequired,
  adminAuthorized,
  upload.single("productImage"),
  async function (req, res, next) {
    try {
      // req.body가 비어있는 경우 error
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // 현재 productName
      const productCurrentName = req.params.productName;
      const productInfoRequired = { productName: productCurrentName };

      // 수정할 data
      const {
        productName,
        productPrice,
        productContent,
        productImage,
        category,
      } = req.body;

      // 데이터가 undefined가 아닌 값만 업데이트용 객체에 삽입
      const toUpdate = {
        ...(productName && { productName }),
        ...(productPrice && { productPrice }),
        ...(productContent && { productContent }),
        ...(productImage && { productImage }),
        ...(category && { category }),
      };

      const updatedProductInfo = await productService.setProduct({
        productInfoRequired,
        toUpdate,
      });

      if (!updatedProductInfo) {
        throw new Error(`${productName} 수정 실패했습니다.`);
      }

      res.status(200).json(updatedProductInfo);
    } catch (error) {
      next(error);
    }
  }
);

// 상품 삭제
productRouter.delete(
  "/:productName",
  loginRequired,
  adminAuthorized,
  async function (req, res, next) {
    try {
      const productName = req.params.productName;

      const result = await productService.deleteProduct(productName);
      if (result.deletedCount !== 1) {
        throw new Error(`${productName} 삭제 실패했습니다.`);
      }

      res.status(200).json({ message: "OK" });
    } catch (error) {
      next(error);
    }
  }
);

export { productRouter };
