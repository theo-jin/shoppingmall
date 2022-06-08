import { scoreModel } from "../db";

class ScoreService {
  // 본 파일의 맨 아래에서, new GradeService(gradeModel) 하면, 이 함수의 인자로 전달됨
  constructor(scoreModel) {
    this.scoreModel = scoreModel;
  }

  //평점 남기기
  async addGrade(scoreInfo) {
    // 객체 destructuring
    const userId = scoreInfo.userId;
    const productId = scoreInfo.productId;

    // 평점 중복 확인
    const score = await this.scoreModel.findByUserAndProduct(userId, productId);
    if (score) {
      throw new Error("이미 별점을 남긴 리뷰입니다.");
    }
    // 평점 중복은 이제 아니므로, 평점 남기기를 진행함
    // db에 저장
    const createdNewGrade = await this.gradeModel.create(scoreInfo);

    return createdNewGrade;
  }

  //평점 수정하기
  async setGrade(userId, productId, reviewScore) {
    // 평점 남긴게 존재하는지 확인
    let score = await this.scoreModel.findByUserAndProduct(userId, productId);
    if (!score) {
      throw new Error("별점을 남긴 상품이 아닙니다.");
    }

    // 평점 수정
    const updatedResult = await this.scoreModel.updateScore({
      productId,
      reviewScore,
    });

    return updatedResult;
  }

  //상품 평점 가져오기
  async getGradesProduct(productId) {
    const grades = await this.scoreModel.findByProduct(productId);
    // 평균 가져오기
    const averageScore =
      grades.reduce((result, score) => {
        return result + score.reviewScore;
      }, 0) / scores.length;

    if (scores.length < 1) {
      throw new Error("해당 상품의 평점이 없습니다.");
    }
    return averageScore;
  }
}

const scoreService = new ScoreService(scoreModel);

export { scoreService };
