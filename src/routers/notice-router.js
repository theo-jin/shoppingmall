import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminAuthorized } from "../middlewares";
import { noticeService } from "../services";

const noticeRouter = Router();

// 공지사항 전체를 가져옴 (배열 형태임)
noticeRouter.get("/list", async function (req, res, next) {
  try {
    // 공지사항 전체를 얻음
    const notices = await noticeService.getNotices();

    // 공지사항 전체를 JSON 형태로 프론트에 보냄
    res.status(200).json(notices);
  } catch (error) {
    next(error);
  }
});

//관리자가 작성한 공지사항을 db 에 저장
noticeRouter.post(
  "/",
  loginRequired,
  adminAuthorized,
  async (req, res, next) => {
    try {
      // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // req (request)의 body 에서 데이터 가져오기
      const { title, content, author } = req.body;

      // 위 데이터를 공지사항 db에 추가하기
      const newNotice = await noticeService.addNotice({
        author,
        title,
        content,
      });

      // 공지사항 db 데이터를 프론트에 다시 보내줌
      // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
      res.status(201).json(newNotice);
    } catch (error) {
      next(error);
    }
  }
);

//관리자가 공지사항 수정
noticeRouter.patch(
  "/:noticeId",
  loginRequired,
  adminAuthorized,
  async function (req, res, next) {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // params로부터 noticeId 가져옴
      const { noticeId } = req.params;

      // body data 로부터 업데이트할 공지사항 정보를 추출함.
      const { title, content, author } = req.body;

      const toUpdate = {
        //if fullName = undefined, result = undefined
        //if fullName = "String", result = { fullName: "String"}
        ...(title && { title }),
        ...(content && { content }),
        ...(author && { author }),
      };

      // 주문 상태 정보를 업데이트함.
      const updatedResult = await noticeService.setNotice(noticeId, toUpdate);

      if (updatedResult.modifiedCount !== 1) {
        throw new Error("공지사항 수정에 실패했습니다.");
      }

      res.status(200).json({ message: "OK" });
    } catch (error) {
      next(error);
    }
  }
);

// 관리자가 공지사항 삭제
noticeRouter.delete(
  "/:noticeId",
  loginRequired,
  adminAuthorized,
  async (req, res, next) => {
    try {
      // req (request)의 params 에서 데이터 가져오기
      const { noticeId } = req.params;

      // 관리자 권한이거나 사용자 정보가 일치할 때 삭제
      const deletedResult = await noticeService.deleteNoticeId(noticeId);

      if (deletedResult.deletedCount !== 1) {
        throw new Error(`${deletedOrder}을 삭제 실패했습니다.`);
      }
      res.status(201).json({ message: "OK" });
    } catch (error) {
      next(error);
    }
  }
);

export { noticeRouter };
