import { model } from "mongoose";
import { GradeSchema } from "../schemas/grade-schema";

const Grade = model("grades", GradeSchema);

export class GradeModel {
  //평점 남긴 유저 조회
  async findByUserId(userId) {
    const grade = await Grade.find({ userId });
    return grade;
  }

  //유저가 평점 남긴 품목 조회
  async findByProjectId(projectId) {
    const grade = await Grade.findOne({ projectId });
    return grade;
  }

  //평점 db에 저장
  async create(gradeInfo) {
    const createdNewGrade = await Grade.create(gradeInfo);
    return createdNewGrade;
  }

  //평점 수정
  async updateGrade({ projectId, reviewScore }) {
    const filter = { projectId };
    const option = { returnOriginal: false };
    const update = { reviewScore };

    const updatedResult = await Grade.updateOne(filter, update, option);
    return updatedResult;
  }

  //상품 평점 가져오기
  async findByProduct(product) {
    const grade = await Grade.find({ projectId: product });
    return grade;
  }
}

const gradeModel = new GradeModel();

export { gradeModel };
