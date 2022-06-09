import { scoreModel, productModel } from "../db";

class ScoreService {
  // 본 파일의 맨 아래에서, new GradeService(gradeModel) 하면, 이 함수의 인자로 전달됨
  constructor(scoreModel) {
    this.scoreModel = scoreModel;
  }

  async getScores(userId) {
    const scores = await this.scoreModel.findByUserId(userId);

    return scores;
  }

  //평점 남기기
/*   async addScore(scoreInfo) {
    const { userId, productId, reviewScore } = scoreInfo;

    // 평점 중복 확인
    // const score = await this.scoreModel.findByUserAndProduct(userId, productId);
    // if (score) {
    //   throw new Error("이미 별점을 남긴 리뷰입니다.");
    // }

    // 상품 이름 조회
    const product = await productModel.findById(productId);

    // 저장할 정보
    const toCreate = {
      userId,
      product: {
        productId,
        productName: product.productName,
      },
      reviewScore,
    };

    // 평점 중복은 이제 아니므로, 평점 남기기를 진행함
    // db에 저장
    const createdNewGrade = await this.scoreModel.create(toCreate);

    // 상품 정보에 평균 점수 넣기
    const productScore = await this.getScoresProduct(productId);
    const toUpdate = { reviewScore: productScore };
    const updatedScore = await productModel.updateScore({
      productId,
      toUpdate,
    });

    console.log(updatedScore)

    if (updatedScore.modifiedCount !== 1) {
      throw new Error("리뷰 평점을 수정에 실패했습니다.");
    }

    return createdNewGrade;
  } */

  //평점 수정하기
  async setScore(userId, productId, reviewScore) {
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
