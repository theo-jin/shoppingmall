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
    const projectId = gradeInfo.projectId;

    // 평점 중복 확인
    const grades = await this.gradeModel.findByUserId(userId);
    if (grades.length >= 1) {
      const grade = await this.gradeModel.findByProjectId(projectId);
      if (grade) {
        throw new Error("이 제품의 평점은 이미 등록 하셨습니다.");
      }
    }

    // 평점 중복은 이제 아니므로, 평점 남기기를 진행함
    // db에 저장
    const createdNewGrade = await this.gradeModel.create(gradeInfo);

    return createdNewGrade;
  }

  //평점 수정하기
  async setGrade(userId, projectId, reviewScore) {
    // 평점 남긴게 존재하는지 확인
    let grades = await this.gradeModel.findByUserId(userId);
    if (grades.length < 1) {
      throw new Error("평점을 남긴적이 없습니다.");
    }

    if (grades) {
      let grade = await this.gradeModel.findByProjectId(projectId);
      if (!grade) {
        throw new Error("해당 상품에 평점을 남긴적이 없습니다.");
      }
    }

    // 평점 수정
    const updatedResult = await this.gradeModel.updateGrade({
      projectId,
      reviewScore,
    });

    return updatedResult;
  }

  //상품 평점 가져오기
  async getGradesProduct(product) {
    const grades = await this.gradeModel.findByProduct(product);
    if (grades.length < 1) {
      throw new Error("해당 상품의 평점이 없습니다.");
    }
    return grades;
  }
}

const gradeService = new GradeService(gradeModel);

export { gradeService };
