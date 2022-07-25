import { noticeModel } from "../db";

class NoticeService {
  constructor(noticeModel) {
    this.noticeModel = noticeModel;
  }

  // 공지사항 전체를 찾음.
  async getNoticeList() {
    const notices = await this.noticeModel.findAll();
    return notices;
  }

  // 공지사항 조회
  async getNotice(noticeId) {
    const notice = await this.noticeModel.findByNoticeId(noticeId);
    if (!notice) {
      throw new Error(`${notice}은(는) 존재하지 않는 상품입니다.`);
    }

    return notice;
  }

  //공지사항 db에 저장하기
  async addNotice(notice) {
    // db에 저장
    const createdNewNotice = await this.noticeModel.create(notice);

    return createdNewNotice;
  }

  //공지사항 수정
  async setNotice(noticeId, toUpdate) {
    // 우선 해당 공지사항이 db에 있는지 확인
    const notice = await this.noticeModel.findByNoticeId(noticeId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!notice) {
      throw new Error("공지사항 정보가 없습니다. 다시 한 번 확인해 주세요.");
    }

    // 공지사항 수정 시작
    // 업데이트 진행
    const updatedResult = await this.noticeModel.update({
      noticeId,
      update: toUpdate,
    });

    return updatedResult;
  }

  // 공지사항 삭제
  async deleteNoticeId(noticeId) {
    // 공지사항 유무 확인
    const notice = await this.noticeModel.findByNoticeId(noticeId);
    if (!notice) {
      throw new Error("해당 공지사항은 존재하지 않습니다.");
    }

    // 공지사항 유무를 확인 했으니 공지사항 삭제를 진행함
    // db에 반영
    const deletedResult = await this.noticeModel.deleteNotice(noticeId);

    return deletedResult;
  }

}

const noticeService = new NoticeService(noticeModel);

export { noticeService };
