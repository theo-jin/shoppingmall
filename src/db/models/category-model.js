import { model } from "mongoose";
import { CategorySchema } from "../schemas/category-schema";

const Category = model("categorys", CategorySchema);

export class CategoryModel {
  async findByFoodType(foodType) {
    const category = await Category.findOne({ foodType });
    return category;
  }

  async create(categoryInfo) {
    const createdNewCategory = await Category.create(categoryInfo);
    return createdNewCategory;
  }

  async findByCategoryType(categoryType) {
    const category = await Category.findOne({ foodType: categoryType });
    return category;
  }

  async delete(categoryType) {
    const deleteCategory = await Category.deleteOne({ foodType: categoryType });
    return deleteCategory;
  }

  async update({ foodType, update }) {
    const filter = { foodType: foodType };
    const option = { returnOriginal: false };

    const updatedCategory = await Category.findOneAndUpdate(
      filter,
      update,
      option
    );
    return updatedCategory;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
