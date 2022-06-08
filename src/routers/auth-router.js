import { Router } from "express";
import passport from "passport";
import { userService } from "../services";

const authRouter = Router();

// 구글 로그인
authRouter.get("/google", async (req, res, next) => {
  passport.authenticate("google", { scope: ["email", "profile"] })(req, res);
});

//google login success and failure
authRouter.get("/google/callback", async function (req, res, next) {
  try {
    passport.authenticate(
      "google",
      {
        successRedirect: "http://localhost:5000",
        failureRedirect: "http://localhost:5000/api/login",
        session: false,
      },
      async (err, user, info) => {
        if (err || !user) {
          throw new Error(info.message);
        }
        const { token, role } = await userService.getUserToken({
          userId: user.userId,
          role: user.role,
        });

        if (!token && !role) {
          throw new Error("로그인에 실패했습니다.");
        }

        // 일반 사용자일 경우 cookie를 설정하지 않음
        // 관리자일 경우 cookie 설정
        res.cookie("token", token, {
          // 현재시간으로부터 만료 시간(ms 단위) -> 7일
          maxAge: 60 * 60 * 24 * 7 * 1000,
          // FIXME
          // true인 경우 로컬호스트에서 쿠키값을 조회할 수 없어서 false로 변경
          // web server에서만 쿠키에 접근할 수 있도록 설정
          httpOnly: false,
          // https에서만 cookie를 사용할 수 있게 설정
          secure: false,
          // 암호화
          signed: true,
        });
        res.cookie("role", role, {
          // 현재시간으로부터 만료 시간(ms 단위) -> 7일
          maxAge: 60 * 60 * 24 * 7 * 1000,
          // FIXME
          // true인 경우 로컬호스트에서 쿠키값을 조회할 수 없어서 false로 변경
          // web server에서만 쿠키에 접근할 수 있도록 설정
          httpOnly: false,
          // https에서만 cookie를 사용할 수 있게 설정
          secure: false,
          // 암호화
          signed: true,
        });
        res.redirect("http://localhost:5000");
      }
    )(req, res);
  } catch (error) {
    next(error);
  }
});

// admin check api
authRouter.get("/role", async function (req, res, next) {
  try {
    const role = req.signedCookies.role;
    res.status(200).json({ role });
  } catch (error) {
    next(error);
  }
});

export { authRouter };
