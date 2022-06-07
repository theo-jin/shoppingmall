import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { gradeService } from "../services";

const gradeRouter = Router();

// 평점 남기기
gradeRouter.post("/", loginRequired, async function (req, res, next) {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const { userId, projectId, reviewScore } = req.body;

    // 위 데이터를 평점 db에 추가하기
    const newGrade = await gradeService.addGrade({
      userId,
      projectId,
      reviewScore,
    });

    // 추가된 평점의 db 데이터를 프론트에 다시 보내줌
    res.status(201).json(newGrade);
  } catch (error) {
    next(error);
  }
});

// 평점 수정
gradeRouter.patch("/", loginRequired, async function (req, res, next) {
  try {
    // req.body가 비어있는 경우 error
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // body에서 정보 받아오기
    const { userId, projectId, reviewScore } = req.body;

    const updatedResult = await gradeService.setGrade(
      userId,
      projectId,
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
});

//상품 평점 가져오기
gradeRouter.get("/:product", async function (req, res, next) {
    try {
      const {product} = req.params;
      // 배열 형태
      const grades = await gradeService.getGradesProduct(product);
      res.status(200).json(grades);
    } catch (error) {
      next(error);
    }
});

export { gradeRouter };
