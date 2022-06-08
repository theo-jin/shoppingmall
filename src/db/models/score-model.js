import { model } from "mongoose";
import { ScoreSchema } from "../schemas/grade-schema";

const Score = model("scores", ScoreSchema);

export class ScoreModel {
  //평점 남긴 유저 조회
  async findByUserId(userId) {
    const score = await Score.find({ userId });
    return score;
  }

  // 상품의 평점 조회
  async findByProductId(productId) {
    const score = await Score.findOne({ productId });
    return score;
  }

  // 유저가 별점 남긴 상품 조회
  async findByUserAndProduct(userId, productId) {
    const score = await Score.findOne({
      userId,
      productId,
    });
    return score;
  }

  //평점 db에 저장
  async create(scoreInfo) {
    const createdNewScore = await Score.create(scoreInfo);
    return createdNewScore;
  }

  //평점 수정
  async updateGrade({ productId, reviewScore }) {
    const filter = { productId };
    const option = { returnOriginal: false };
    const update = { reviewScore };

    const updatedResult = await Score.updateOne(filter, update, option);
    return updatedResult;
  }

  //상품 평점 가져오기
  async findByProduct(productId) {
    const score = await Score.find({ productId });
    return score;
  }
}

const scoreModel = new ScoreModel();

export { scoreModel };
