import passport from "passport";
import passportJWT from "passport-jwt";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },

    // parsing 한 값 = payload
    async function (jwtPayload, done) {
      try {
        console.log(jwtPayload);
        const user = await User.findOne({ email: jwtPayload.email });
        if (user) return done(null, user, { message: "OK" });
        else return done(null, false, { message: "잘못된 토큰입니다." });
      } catch (err) {
        return done(err, false, { message: "에러가 발생했습니다." });
      }
    }
  )
);
