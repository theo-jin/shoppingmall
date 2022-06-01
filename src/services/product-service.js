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
}

const productService = new ProductService(productModel);

export { productService };
