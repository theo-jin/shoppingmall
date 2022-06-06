import { model } from "mongoose";
import { CategorySchema } from "../schemas/category-schema";

const Category = model("category", CategorySchema);

export class CategoryModel {
  async findAll() {
    const categories = await Category.find({});
    return categories;
  }

  async findByFoodType(foodType) {
    const category = await Category.findOne({ foodType });
    return category;
  }

  async create(categoryInfo) {
    const createdNewCategory = await Category.create(categoryInfo);
    return createdNewCategory;
  }

  async delete(categoryType) {
    const deleteCategory = await Category.deleteOne({ foodType: categoryType });
    return deleteCategory;
  }

  async update({ foodType, update }) {
    const filter = { foodType };
    const option = { returnOriginal: false };

    const updatedResult = await Category.updateOne(
      filter,
      update,
      option
    );
    return updatedResult;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
