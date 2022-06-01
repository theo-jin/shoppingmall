import { Router } from "express";
//type check
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { categoryService } from "../services";

const categoryRouter = Router();

// 카테고리 추가 api (아래는 /add이지만, 실제로는 /api/category/add로 요청해야 함.)
categoryRouter.post("/add", loginRequired, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const foodType = req.body.foodType;
    const description = req.body.description;

    // 위 데이터를 카테고리 db에 추가하기
    const newCategory = await categoryService.addCategory({
      foodType,
      description,
    });

    // 추가된 카테고리의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

// 카테고리 삭제 api (아래는 /:categoryType이지만, 실제로는 /api/category/:categoryType로 요청해야 함.)
categoryRouter.delete(
  "/:categoryType",
  loginRequired,
  async (req, res, next) => {
    try {
      // req (request)의 params 에서 데이터 가져오기
      const categoryType = req.params.categoryType;

      console.log(`params가져오는거 ${categoryType}`);
      // 위 데이터를 카테고리 db에서 삭제하기
      await categoryService.deleteCategory(categoryType);

      // 삭제되었다고 그냥 success를 보내줌
      res.status(201).json({ result: "success" });
    } catch (error) {
      next(error);
    }
  }
);

// 카테고리 수정
// (예를 들어 /api/category/한식123 로 요청하면 req.params.categoryType는 '한식123' 문자열로 됨)
categoryRouter.patch(
  "/:categoryType",
  loginRequired,
  async function (req, res, next) {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // params로부터 categoryType를 가져옴
      const categoryType = req.params.categoryType;

      // body data 로부터 업데이트할 카테고리 정보를 추출함.
      const foodType = req.body.foodType;
      const description = req.body.description;

      const categoryInfoRequired = { categoryType };

      // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
      // 보내주었다면, 업데이트용 객체에 삽입함.
      const toUpdate = {
        //if fullName = undefined, result = undefined
        //if fullName = "String", result = { fullName: "String"}
        ...(foodType && { foodType }),
        ...(description && { description }),
      };

      // 카테고리 정보를 업데이트함.
      const updatedCategoryInfo = await categoryService.setCategory(
        categoryInfoRequired,
        toUpdate
      );

      // 업데이트 이후의 카테고리 데이터를 프론트에 보내 줌
      res.status(200).json(updatedCategoryInfo);
    } catch (error) {
      next(error);
    }
  }
);

export { categoryRouter };
