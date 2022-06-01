import { productModel } from "../db";

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  //상품 추가
  async addProduct(productInfo) {
    const productName = productInfo.productName;

    //productName 중복 확인
    const product = await this.productModel.findByProductName(productName);
    if (product) {
      throw new Error(
        `${productName}은 이미 존재하는 이름입니다. 다른 이름을 입력하세요.`
      );
    }

    // db에 저장
    const createdNewProduct = await this.productModel.create(productInfo);
    return createdNewProduct;
  }

  async getProductsByCategory(category) {
    //TODO: category가 존재하는지 확인
    //const category = await this.categoryModel.findByCategoryType(category)
    //if(!category){return `${category}는 존재하지 않는 카테고리입니다.`}

    // category로 검색
    const products = await this.productModel.findByCategory(category);
    //category 안에 존재하지 않을 때
    if (products.length < 1) {
      return `${category}은(는) 상품 준비중입니다😥`;
    }

    return products;
  }
}

const productService = new ProductService(productModel);

export { productService };
