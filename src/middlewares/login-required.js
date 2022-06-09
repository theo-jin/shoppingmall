import passport from "passport";

function loginRequired(req, res, next) {
  console.log(req.headers)
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    next();
    return;
  }
  return passport.authenticate("jwt", { session: false }, (err, user, info) => {
    try {
      if (err) {
        throw new Error(info.message);
      }
      if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      req.currentUserId = user._id;
      next();
    } catch (err) {
      next(err);
    }
  })(req, res, next);
}

export { loginRequired };
