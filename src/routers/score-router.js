import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { scoreService } from "../services";

const scoreRouter = Router();

// 별점 목록 조회
scoreRouter.get("/list", loginRequired, async function (req, res, next) {
  try {
    const userId = req.currentUserId;
    const products = await scoreService.getScores(userId);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 평점 남기기
/* scoreRouter.post("/", loginRequired, async function (req, res, next) {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const userId = req.currentUserId;
    // const productId = req.params.productId;

    // req (request)의 body 에서 데이터 가져오기
    const { productId, reviewScore } = req.body;

    // 위 데이터를 평점 db에 추가하기
    const newScore = await scoreService.addScore({
      userId,
      productId,
      reviewScore,
    });

    // 추가된 평점의 db 데이터를 프론트에 다시 보내줌
    res.status(201).json(newScore);
  } catch (error) {
    next(error);
  }
}); */

// 평점 남기기
scoreRouter.patch(
  "/:scoreId",
  loginRequired,
  async function (req, res, next) {
    try {
      // req.body가 비어있는 경우 error
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const userId = req.currentUserId;
      const scoreId = req.params.productId;

      const score = await scoreService.getScores(scoreId)

      // body에서 정보 받아오기
      const { reviewScore } = req.body;

      const updatedResult = await scoreService.setScore(
        userId,
        productId,
        reviewScore
      );

      if (updatedResult.modifiedCount !== 1) {
        throw new Error("평점 반영에 실패했습니다.");
      }

      // 업데이트 이후의 상품 데이터를 프론트에 보내 줌
      res.status(200).json({ message: "OK" });
    } catch (error) {
      next(error);
    }
  }
);

//상품 평점 가져오기
scoreRouter.get("/:productId", async function (req, res, next) {
  try {
    const { productId } = req.params;
    // 배열 형태
    const scores = await scoreService.getScoresProduct(productId);

    res.status(200).json(scores);
  } catch (error) {
    next(error);
  }
});

export { scoreRouter };
