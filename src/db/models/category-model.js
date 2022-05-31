import { model } from "mongoose";
import { CategorySchema } from "../schemas/category-schema";

const Category = model("categorys", CategorySchema);

export class CategoryModel {
  async findByFoodType(foodType) {
    const category = await Category.findOne({ foodType });
    return category;
  }

  /*async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }*/

  async create(categoryInfo) {
    const createdNewCategory = await Category.create(categoryInfo);
    return createdNewCategory;
  }

  /*async findAll() {
    const users = await User.find({});
    return users;
  }*/

  /*async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }*/
}

const categoryModel = new CategoryModel();

export { categoryModel };
