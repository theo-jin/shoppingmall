import { gradeModel } from "../db";

class GradeService {
  // 본 파일의 맨 아래에서, new GradeService(gradeModel) 하면, 이 함수의 인자로 전달됨
  constructor(gradeModel) {
    this.gradeModel = gradeModel;
  }

  //평점 남기기
  async addGrade(gradeInfo) {
    // 객체 destructuring
    const userId = gradeInfo.userId;
    const productId = gradeInfo.productId;

    // 평점 중복 확인
    const grade = await this.gradeModel.findByUserAndProduct(userId, productId);
    if (grade) {
      throw new Error("이미 별점을 남긴 리뷰입니다.");
    }
    // 평점 중복은 이제 아니므로, 평점 남기기를 진행함
    // db에 저장
    const createdNewGrade = await this.gradeModel.create(gradeInfo);

    return createdNewGrade;
  }

  //평점 수정하기
  async setGrade(userId, productId, reviewScore) {
    // 평점 남긴게 존재하는지 확인
    let grade = await this.gradeModel.findByUserAndProduct(userId, productId);
    if (!grade) {
      throw new Error("별점을 남긴 상품이 아닙니다.");
    }

    // 평점 수정
    const updatedResult = await this.gradeModel.updateGrade({
      productId,
      reviewScore,
    });

    return updatedResult;
  }

  //상품 평점 가져오기
  async getGradesProduct(productId) {
    const grades = await this.gradeModel.findByProduct(productId);
    // 평균 가져오기
    const averageGrade =
      grades.reduce((result, grade) => {
        return result + grade.reviewScore;
      }, 0) / grades.length;
      
    if (grades.length < 1) {
      throw new Error("해당 상품의 평점이 없습니다.");
    }
    return averageGrade;
  }
}

const gradeService = new GradeService(gradeModel);

export { gradeService };
