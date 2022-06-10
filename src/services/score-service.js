import { productModel, scoreModel } from "../db";

class ScoreService {
  // 본 파일의 맨 아래에서, new ScoreService(scoreModel) 하면, 이 함수의 인자로 전달됨
  constructor(scoreModel) {
    this.scoreModel = scoreModel;
  }

  // 모든 별점 가져오기
  async getScores(userId) {
    const scores = await this.scoreModel.findByUserId(userId);

    return scores;
  }

  // 별점 있는지 확인하기
  async checkScore(userId, scoreId) {
    const score = await this.scoreModel.findByUserAndId(userId, scoreId);

    return score;
  }

  //평점 수정하기
  async setScore(scoreId, productId, reviewScore) {
    // 평점 수정
    const updatedResult = await this.scoreModel.updateScore({
      scoreId,
      reviewScore,
    });

    // 평균 별점
    const score = await this.getScoresProduct(productId);

    const filter = { _id: productId };
    const toUpdate = { reviewScore: score };

    // 상품에 평균 별점 업데이트
    const updatedProduct = await productModel.update({ filter, toUpdate });
    if (updatedProduct.modifiedCount !== 1) {
      throw new Error("평점을 반영하기 실패했습니다.");
    }

    return updatedResult;
  }

  //상품 평점 가져오기
  async getScoresProduct(productId) {
    const scores = await this.scoreModel.findByProduct(productId);
    // 평균 가져오기
    const averageScore =
      scores.reduce((result, score) => {
        return result + score.reviewScore;
      }, 0) / scores.length;

    if (scores.length < 1) {
      return 0.0;
    }
    return averageScore;
  }

  async deleteOrderId(orderId) {
    const result = await this.scoreModel.deleteScore(orderId);
    return result;
  }
}

const scoreService = new ScoreService(scoreModel);

export { scoreService };
