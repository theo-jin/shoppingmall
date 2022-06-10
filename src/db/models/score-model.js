import { model } from "mongoose";
import { ScoreSchema } from "../schemas/score-schema";

const Score = model("scores", ScoreSchema);

export class ScoreModel {
  // 유저의 별점 목록 조회
  async findByUserId(userId) {
    const scores = await Score.find({ userId });
    return scores;
  }

  async findByUserAndId(userId, scoreId) {
    const score = await Score.findOne({ userId, scoreId });
    return score;
  }

  //평점 db에 저장
  async create(scoreInfo) {
    const createdNewScore = await Score.create(scoreInfo);
    return createdNewScore;
  }

  //평점 수정
  async updateScore({ scoreId, reviewScore }) {
    const filter = { _id: scoreId };
    const option = { returnOriginal: false };
    const update = { reviewScore };

    const updatedResult = await Score.updateOne(filter, update, option);
    return updatedResult;
  }

  //상품 평점 가져오기
  async findByProduct(productId) {
    const score = await Score.find({
      product: {
        $elemMatch: { productId },
      },
    });
    return score;
  }

  async deleteScore(orderId) {
    const result = await Score.deleteOne({ orderId });
    return result
  }
}

const scoreModel = new ScoreModel();

export { scoreModel };
