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
scoreRouter.patch("/:scoreId", loginRequired, async function (req, res, next) {
  try {
    // req.body가 비어있는 경우 error
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const userId = req.currentUserId;
    const scoreId = req.params.scoreId;

    const score = await scoreService.checkScore(userId, scoreId);
    if (!score) {
      throw new Error("별점을 남길 수 없습니다.");
    }

    // body에서 정보 받아오기
    const { productId, reviewScore } = req.body;

    const updatedResult = await scoreService.setScore(scoreId, productId, reviewScore);

    if (updatedResult.modifiedCount !== 1) {
      throw new Error("평점 반영에 실패했습니다.");
    }

    // 업데이트 이후의 상품 데이터를 프론트에 보내 줌
    res.status(200).json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

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
