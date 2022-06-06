import { model } from "mongoose";
import { UserSchema } from "../schemas/user-schema";

const User = model("users", UserSchema);

export class UserModel {
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }

  async create(userInfo) {
    const { userEmail, fullName, password, phoneNumber, address, createdAt } =
      await User.create(userInfo);
    const createdNewUser = {
      email: userEmail,
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
      email: userEmail,
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
