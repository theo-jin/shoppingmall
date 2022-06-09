import passport from "passport";

function loginRequired(req, res, next) {
  const token = req.headers.Authorization?.split(" ")[1];
  if (!token) {
    next();
    return;
  }
  return passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      throw new Error(info.message);
    }
    req.currentUserId = user._id;
    next();
  })(req, res, next);
}

export { loginRequired };
