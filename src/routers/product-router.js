import { Router } from "express";
import is from "@sindresorhus/is";
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import dotenv from "dotenv";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminAuthorized } from "../middlewares";
import { productService } from "../services";

const productRouter = Router();

// AWS setting
AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.AWS_ACCESS_KEYID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    dirname: "/products",
    bucket: "my-kit",
    cacheControl: "max-age=31536000",
    // contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    limits: { fileSize: 5 * 1024 * 1024 },
    key: (req, file, cb) => {
      let extension = path.extname(file.originalname);
      cb(null, "profileimage/" + Date.now().toString() + extension);
    },
  }),
});

// 상품 전체 조회
productRouter.get("/list", loginRequired, adminAuthorized, async function (req, res, next) {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 상품 카테고리 별 조회
//?category={}
productRouter.get("", async function (req, res, next) {
  try {
    const category = req.query.category;
    // 페이지 번호
    let page = req.query.page;
    // 제품 개수
    let countPerPage = req.query.limit;

    // countPerPage가 비어서 온 경우
    if (!countPerPage || countPerPage == null) {
      countPerPage = 10;
    } else {
      countPerPage = Number(countPerPage);
    }

    // 페이지 번호가 없는 경우
    if (!page || page == null) {
      page = 0;
    } else {
      page = Number(page);
    }

    const total = await productService.countByCategory(category);
    const products = await productService.getProductsByCategory(category, page, countPerPage);

    res.status(200).json({ total, products });
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

// 신상품 조회
productRouter.get("/new", upload.single("productImage"), async function (req, res, next) {
  try {
    const now = new Date();
    // 한 달 전
    const date = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const newProducts = await productService.getNewProduct(date);
    res.status(200).json(newProducts);
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
        throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
      }

      //req.body 데이터 가져오기
      const { productName, productContent, productPrice, category } = req.body;
      const productImage = req.file.location;

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
        throw new Error("headers의 Content-Type을 application/json으로 설정해주세요");
      }

      // 현재 productName
      const productCurrentName = req.params.productName;
      const productInfoRequired = { productName: productCurrentName };

      // 수정할 data
      let { productName, productPrice, productContent, productImage, category } = req.body;

      // undefined 값으로 들어올 때
      productName = productName === "" ? undefined : productName;
      productPrice = productPrice === "" ? undefined : productPrice;
      productContent = productContent === "" ? undefined : productContent;
      productImage = productImage === "undefined" ? undefined : productImage;
      category = category === "" ? undefined : category;

      // 데이터가 undefined가 아닌 값만 업데이트용 객체에 삽입
      const toUpdate = {
        ...(productName && { productName }),
        ...(productPrice && { productPrice }),
        ...(productContent && { productContent }),
        ...(productImage && { productImage }),
        ...(category && { category }),
      };

      const updatedResult = await productService.setProduct({
        productInfoRequired,
        toUpdate,
      });

      if (updatedResult.modifiedCount !== 1) {
        throw new Error("카테고리 수정에 실패했습니다.");
      }

      // 업데이트 이후의 상품 데이터를 프론트에 보내 줌
      res.status(200).json({ message: "OK" });
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

      // 상품 삭제
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
