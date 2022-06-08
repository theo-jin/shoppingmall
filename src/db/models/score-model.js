import { model } from "mongoose";
import { ScoreSchema } from "../schemas/score-schema";

const Score = model("scores", ScoreSchema);

export class ScoreModel {
  //평점 남긴 유저 조회
  async findByUserId(userId) {
    const score = await Score.find({ userId });
    return score;
  }

  // 유저가 별점 남긴 상품 조회
  async findByUserAndProduct(userId, productId) {
    const score = await Score.findOne({
      userId,
      product: {
        $elemMatch: { productId },
      },
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
    const option = { returnOriginal: false };
    const update = { reviewScore };

    const updatedResult = await Score.updateOne(
      {
        product: {
          $elemMatch: { productId },
        },
      },
      update,
      option
    );
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
}

const scoreModel = new ScoreModel();

export { scoreModel };
