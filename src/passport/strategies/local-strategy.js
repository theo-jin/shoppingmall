import passport from "passport";
import LocalStrategy from "passport-local";
import { UserModel } from "../db";

  // Strategy 성공 시 호출
  passport.serializeUser((UserModel, done) => {
    done(null, UserModel);
  });

  // Strategy 실패 시 호출
  passport.deserializeUser((UserModel, done) => {
    done(null, UserModel);
  });

  // 전략
  passport.use(
    new LocalStrategy(
      {
        usernameField: "id",
        passwordField: "pw",
        session: false,
        passReqCallback: false,
      },
      async (id, password, done) => {
        await UserModel.findOne({ email: id }, (findError, user) => {
          // 서버 에러 처리
          if (findError) return done(findError);
          // 아이디 존재 확인
          if (!user)
            return done(null, false, {
              message: "존재하지 않는 아이디 입니다.",
            });
          return user.comparePassword(email, password, (passError, isMatch) => {
            // 비밀번호 일치
            if (isMatch) {
              return done(null, user);
            }
            // 비밀번호 불일치
            return done(null, false, { message: "비밀번호가 틀렸습니다." });
          });
        });
      }
    )
  );

export { passport };
