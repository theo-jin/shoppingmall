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
    const { email, fullName, password, phoneNumber, address, createdAt } =
      await User.create(userInfo);
    const createdNewUser = {
      email,
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

    const { email, fullName, password, phoneNumber, address, createdAt } =
      await User.findOneAndUpdate(filter, update, option);
    const updatedUser = {
      email,
      fullName,
      password,
      phoneNumber,
      address,
      createdAt,
    };
    return updatedUser;
  }

  async deleteUser(email) {
    const deleteResult = await User.deleteOne({ email });
    return deleteResult;
  }
}

const userModel = new UserModel();

export { userModel };
