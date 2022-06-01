import { categoryModel } from "../db";

class CategoryService {
  // 본 파일의 맨 아래에서, new CategoryService(categoryModel) 하면, 이 함수의 인자로 전달됨
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  // 카테고리 추가
  async addCategory(categoryInfo) {
    // 객체 destructuring
    const { foodType, description } = categoryInfo;

    // 카테고리 중복 확인
    const category = await this.categoryModel.findByFoodType(foodType);
    if (category) {
      throw new Error(
        "이 카테고리는 현재 사용중입니다. 다른 카테고리를 입력해 주세요."
      );
    }

    // 카테고리 중복은 이제 아니므로, 카테고리 추가를 진행함
    // db에 저장
    const createdNewCategory = await this.categoryModel.create(categoryInfo);

    return createdNewCategory;
  }

  // 카테고리 삭제
  async deleteCategory(categoryType) {
    // 카테고리 유무 확인
    const category = await this.categoryModel.findByCategoryType(categoryType);
    if (!category) {
      throw new Error(
        "이 카테고리는 db에 없습니다. 다른 카테고리를 입력해 주세요."
      );
    }

    // 카테고리 유무를 확인 했으니 카테고리 삭제를 진행함
    // db에 반영
    const deleteCategory = await this.categoryModel.delete(categoryType);

    return deleteCategory;
  }

  // 카테고리 정보 수정
  async setCategory(categoryInfoRequired, toUpdate) {
    // 객체 destructuring

    const { categoryType } = categoryInfoRequired;

    // 우선 해당 카테고리가 db에 있는지 확인
    const category = await this.categoryModel.findByCategoryType(categoryType);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new Error("카테고리가 없습니다. 다시 한 번 확인해 주세요.");
    }

    // 카테고리 수정 시작
    // 업데이트 진행
    category = await this.categoryModel.update({
      foodType: categoryType,
      update: toUpdate,
    });

    return category;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
