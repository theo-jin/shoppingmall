import passport from "passport";
import { local } from "./strategies/local-strategy";
import { jwt } from "./strategies/jwt-strategy";
// import google from "./strategies/google";

module.exports = () => {
  passport.use(local)
  passport.use(jwt);
  // passport.use(google);
};
