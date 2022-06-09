import { Router } from "express";
//type check
import is from "@sindresorhus/is";
import passport from "passport";
import sessionStorage from "sessionstorage";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminAuthorized } from "../middlewares";
import { userService } from "../services";

const userRouter = Router();

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
userRouter.post("/register", async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const { fullName, email, password, phoneNumber, address } = req.body;

    // 위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser({
      fullName,
      email,
      password,
      phoneNumber,
      address,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// 로그인 api
userRouter.post("/login", async function (req, res, next) {
  try {
    passport.authenticate("local", async (passportError, user, info) => {
      // error
      if (passportError || !user) {
        throw new Error(info.message);
      }

      req.login(user, { session: false }, async (loginError) => {
        if (loginError) {
          throw new Error(loginError);
        }

        // token 할당하고 토큰과 role을 반환받음
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
        
        // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
        res.json({ message: "OK" });
      });
    })(req, res);
  } catch (error) {
    next(error);
  }
});

// 전체 유저 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
userRouter.get(
  "/list",
  loginRequired,
  adminAuthorized,
  async function (req, res, next) {
    try {
      // 전체 사용자 목록을 얻음
      const users = await userService.getUsers();

      // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

// 사용자 정보 조회
userRouter.get("/user", loginRequired, async function (req, res, next) {
  try {
    // loginRequired에서 decoded된 userId
    const userId = req.currentUserId;
    console.log(userId);

    // 선택 사용자 정보를 얻음
    const users = await userService.getUserInfo(userId);
    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 사용자 정보 수정
// 해당된 사용자만 정보 수정 가능, 관리자 수정 불가능
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.patch("/user", loginRequired, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // token에서 decoded userId
    const userId = req.currentUserId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const { fullName, password, phoneNumber, address } = req.body;

    // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
    const currentPassword = req.body.currentPassword;

    // currentPassword 없을 시, 진행 불가
    if (!currentPassword) {
      throw new Error("정보를 변경하려면, 현재의 비밀번호가 필요합니다.");
    }

    const userInfoRequired = { userId, currentPassword };

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      //if fullName = undefined, result = undefined
      //if fullName = "String", result = { fullName: "String"}
      ...(fullName && { fullName }),
      ...(password && { password }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
    };

    // 사용자 정보를 업데이트함.
    const updatedResult = await userService.setUser(userInfoRequired, toUpdate);

    if (updatedResult.modifiedCount !== 1) {
      throw new Error("회원 정보 수정을 실패했습니다.");
    }

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

//유저 정보 삭제
userRouter.delete("/", loginRequired, async function (req, res, next) {
  try {
    let userId = req.currentUserId;

    // 관리자 권한으로 user를 삭제하는 경우, 선택한 userId로 변경
    if (req.currentUserRole === "admin") {
      // req.body가 비어있는 경우
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }
      // 회원 id
      userId = req.body.userId;
    }

    const deleteResult = await userService.deleteUser(userId);

    // 삭제 실패
    if (deleteResult.deletedCount < 1) {
      throw new Error("사용자 정보 삭제 실패했습니다.");
    }

    res.status(200).json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/logout", async function (req, res, next) {
  try {
    req.session.destroy();

    res.status(200).json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

export { userRouter };
