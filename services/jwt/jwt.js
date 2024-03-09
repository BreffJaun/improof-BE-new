// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import "dotenv/config";
import jwt from "jsonwebtoken";

// I M P O R T:  E N V  O P T I O N S
import { JWT_KEY, JWT_EXPIRATION } from "../../config/config.js";

// ======================================================

// C R E A T E   J W T   V E R I F Y   T O K E N
export const createVerifyToken = (user) => {
  try {
    const jwtToken = jwt.sign(
      { email: user.profile.email, _id: user._id },
      JWT_KEY,
      {
        expiresIn: JWT_EXPIRATION,
      }
    );
    return jwtToken;
  } catch (error) {
    console.error("Error creating JWT token:", error);
    throw new Error("Failed to create JWT token");
  }
};
