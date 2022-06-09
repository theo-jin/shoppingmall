const LocalStrategy = require("passport-local").Strategy;
import { userModel } from "../../db";

// 전략
const config = {
  usernameField: "email",
  passwordField: "password",
  session: false,
  //passReqCallback: false,
};

const verify = async function (email, password, done) {
  try {
    const user = await userModel.findByEmail(email);
    // 아이디 존재 확인
    if (!user)
      return done(null, false, { message: "존재하지 않는 아이디입니다." });

    const isMatch = await userModel.comparePassword(email, password);

    // 비밀번호 일치
    if (isMatch) {
      return done(null, {
        userId: user._id,
        role: user.role,
      });
    }
    // 비밀번호 불일치
    return done(null, false, { message: "비밀번호가 틀렸습니다." });
  } catch (error) {
    console.log(error);
    done(error);
  }
};
const local = new LocalStrategy(config, verify);

export { local };
