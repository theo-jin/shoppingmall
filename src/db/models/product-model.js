import { model } from "mongoose";
import { ProductSchema } from "../schemas/product-schema";

const Product = model("products", ProductSchema);

export class ProductModel {
  async findByProductName(productName) {
    const product = await Product.findOne({ productName });
    return product;
  }

  async findById(productId) {
    const product = await Product.findOne({ _id: productId });
    return product;
  }

  async countBycategory(category) {
    const total = await Product.countDocuments({ category });
    return total;
  }

  async findByCategory(category, page, countPerPage) {
    const products = await Product.find({ category })
      .skip(countPerPage * (page - 1))
      .limit(countPerPage);
    return products;
  }

  async findByDate(date) {
    const products = await Product.aggregate([
      {
        $match: {
          createdAt: { $gte: date, $lte: new Date() },
        },
      },
    ]);
    return products;
  }

  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }

  async findAll() {
    const products = await Product.find({});
    return products;
  }

  async update({ productInfoRequired, toUpdate }) {
    const filter = { productName: productInfoRequired.productName };
    const option = { returnOriginal: false };

    const updatedResult = await Product.updateOne(filter, toUpdate, option);
    return updatedResult;
  }

  async deleteProduct(productName) {
    const deletedProduct = await Product.deleteOne({ productName });
    return deletedProduct;
  }

  async updateScore({ productId, toUpdate }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };

    const updatedResult = await Product.updateOne(filter, toUpdate, option);
    return updatedResult;
  }
}

const productModel = new ProductModel();

export { productModel };
