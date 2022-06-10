// 관리자 권한을 확인하는 미들웨어
function adminAuthorized(req, res, next) {
  try {
    const userRole = req.signedCookies.role;

    if (userRole !== "admin") {
      console.log("권한이 없는 사용자가 접근하였습니다.");
      throw new Error("권한이 없습니다.");
    }

    next();
  } catch (error) {
    // 401: Unauthorized
    res.status(401).json({
      result: "not-authorized",
      reason: error.message,
    });
  }
}

export { adminAuthorized };
