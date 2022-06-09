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

        // role을 session에 저장
        sessionStorage.setItem("role", role);
        // token을 header에 저장
        sessionStorage.setItem("Authorization", auth)

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
