// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import "dotenv/config";
import jwt from "jsonwebtoken";

// I M P O R T  &  D E C L A R E   B C R Y P T   K E Y
import { JWT_KEY } from "../config/config.js";

//========================

// AUTHORIZE A USER
export function auth(req, res, next) {
  try {
    // If the token is not verified successfully, an error is thrown IMMEDIATELY and it goes into Catch!

    // BEGIN COOKIE CODE //
    const token = req.cookies.loginCookie;
    const decodedToken = jwt.verify(token, JWT_KEY);
    // END COOKIE CODE //
    req.token = decodedToken;
    next();
  } catch (err) {
    const errObj = new Error("Not authorized! AUTH", { cause: err });
    errObj.statusCode = 401;
    next(errObj);
  }
}
