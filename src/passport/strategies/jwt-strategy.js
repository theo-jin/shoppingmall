import passportJWT from "passport-jwt";
import { userModel } from "../../db";

const JWTStrategy = passportJWT.Strategy;

const cookieExtractor = function(req){
  let token = null;
  if(req && req.signedCookies) token = req.signedCookies.token
  return token
}

const jwt = new JWTStrategy(
  {
    secretOrKey: process.env.JWT_SECRET_KEY,
    jwtFromRequest: cookieExtractor,
    session: false,
  },
  // parsing 한 값 = payload
  async function (jwtPayload, done) {
    try {
      const user = await userModel.findById(jwtPayload.userId);
      if (user) return done(null, user, { message: "OK" });
      else return done(null, false, { message: "잘못된 토큰입니다." });
    } catch (err) {
      return done(err, false, { message: "에러가 발생했습니다." });
    }
  }
);

export { jwt };