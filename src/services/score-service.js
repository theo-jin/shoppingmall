import { scoreModel } from "../db";

class ScoreService {
  // 본 파일의 맨 아래에서, new ScoreService(scoreModel) 하면, 이 함수의 인자로 전달됨
  constructor(scoreModel) {
    this.scoreModel = scoreModel;
  }

  async getScores(userId) {
    const scores = await this.scoreModel.findByUserId(userId);

    return scores;
  }

  async checkScore(userId, scoreId) {
    const score = await this.scoreModel.findByUserAndId(userId, scoreId);

    return score;
  }

  //평점 수정하기
  async setScore(scoreId, reviewScore) {
    // 평점 수정
    const updatedResult = await this.scoreModel.updateScore({
      scoreId,
      reviewScore,
    });

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
}

const scoreService = new ScoreService(scoreModel);

export { scoreService };
