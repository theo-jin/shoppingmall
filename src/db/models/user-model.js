import { model } from "mongoose";
import { UserSchema } from "../schemas/user-schema";

const User = model("users", UserSchema);

export class UserModel {
  async findByEmail(email) {
    const { userEmail, fullName, password, phoneNumber, address, createdAt } =
      await User.findOne({ email });
    const user = {
      userEmail,
      fullName,
      password,
      phoneNumber,
      address,
      createdAt,
    };
    return user;
  }

  async findById(userId) {
    const { userEmail, fullName, password, phoneNumber, address, createdAt } =
      await User.findOne({ _id: userId });
    const user = {
      userEmail,
      fullName,
      password,
      phoneNumber,
      address,
      createdAt,
    };
    return user;
  }

  async create(userInfo) {
    const { userEmail, fullName, password, phoneNumber, address, createdAt } =
      await User.create(userInfo);
    const createdNewUser = {
      userEmail,
      fullName,
      password,
      phoneNumber,
      address,
      createdAt,
    };
    return createdNewUser;
  }

  async findAll() {
    const users = await User.find({});
    return users;
  }

  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const { userEmail, fullName, password, phoneNumber, address, createdAt } =
      await User.findOneAndUpdate(filter, update, option);
    const updatedUser = {
      userEmail,
      fullName,
      password,
      phoneNumber,
      address,
      createdAt,
    };
    return updatedUser;
  }

  async deleteUser(userId) {
    const deleteResult = await User.deleteOne({ _id: userId });
    return deleteResult;
  }
}

const userModel = new UserModel();

export { userModel };
