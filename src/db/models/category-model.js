import { model } from "mongoose";
import { CategorySchema } from "../schemas/category-schema";

const Category = model("categorys", CategorySchema);

export class CategoryModel {
  async findByFoodType(foodType) {
    const category = await User.findOne({ email });
    return user;
  }

  /*async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }*/

  /*async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }*/

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
