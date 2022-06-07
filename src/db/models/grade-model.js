import { model } from "mongoose";
import { GradeSchema } from "../schemas/grade-schema";

const Grade = model("grades", GradeSchema);

export class GradeModel {
  //평점 남긴 유저 조회
  async findByUserId(userId) {
    const grade = await Grade.find({ userId });
    return grade;
  }

  // 상품의 평점 조회
  async findByProductId(productId) {
    const grade = await Grade.findOne({ productId });
    return grade;
  }

  // 유저가 별점 남긴 상품 조회
  async findByUserAndProduct(userId, productId) {
    const grade = await Grade.findOne({
      userId, productId
    });
    return grade;
  }

  //평점 db에 저장
  async create(gradeInfo) {
    const createdNewGrade = await Grade.create(gradeInfo);
    return createdNewGrade;
  }

  //평점 수정
  async updateGrade({ productId, reviewScore }) {
    const filter = { productId };
    const option = { returnOriginal: false };
    const update = { reviewScore };

    const updatedResult = await Grade.updateOne(filter, update, option);
    return updatedResult;
  }

  //상품 평점 가져오기
  async findByProduct(productId) {
    const grade = await Grade.find({ productId });
    return grade;
  }
}

const gradeModel = new GradeModel();

export { gradeModel };
