import { model } from "mongoose";
import { NoticeSchema } from "../schemas/notice-schema";

const Notice = model("notices", NoticeSchema);

export class NoticeModel {
  // 공지사항 전체 조회
  async findAll() {
    const notices = await Notice.find({});
    return notices;
  }

  //공지사항 db 에 저장
  async create(notice) {
    const createdNewNotice = await Notice.create(notice);
    return createdNewNotice;
  }

  // 공지사항 하나 조회
  async findByNoticeId(noticeId) {
    const notice = await Notice.findOne({ _id: noticeId });
    return notice;
  }

  //공지사항 수정
  async update({ noticeId, update }) {
    const filter = { _id: noticeId };
    const option = { returnOriginal: false };

    const updatedResult = await Notice.updateOne(filter, update, option);
    return updatedResult;
  }

  //공지사항 삭제
  async deleteNotice(noticeId) {
    const deletedNotice = await Notice.deleteOne({ _id: noticeId });
    return deletedNotice;
  }
}

const noticeModel = new NoticeModel();

export { noticeModel };
