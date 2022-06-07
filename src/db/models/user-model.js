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

    const updatedResult = await User.updateOne(filter, update, option);
    return updatedResult;
  }

  async deleteUser(userId) {
    const deleteResult = await User.deleteOne({ _id: userId });
    return deleteResult;
  }

  async comparePassword(email, password) {
    const user = await User.findOne({ email });
    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    // (프로트가 보내온 비밀번호, db에 있던 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }
    return isPasswordCorrect;
  }
}

const userModel = new UserModel();

export { userModel };
