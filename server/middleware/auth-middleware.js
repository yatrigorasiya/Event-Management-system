import { User } from "../model/user-model.js";
import jwt from "jsonwebtoken";

export const authmiddleware = async (req, res, next) => {
  //frontend token get
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorizes HTTP, Token not provided" });
    }

    const jwtToken = token.replace("Bearer ", "").trim();
    console.log("token from middleware", jwtToken);

    const isVerified = jwt.verify(jwtToken, process.env.SECRET_KEY);

    const userData = await User.findOne({ email: isVerified.email }).select({
      password: 0,
    });

    if (!userData) {
      console.error("User not found in database.");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("userData", userData);

    req.user = userData;
    req.token = token;
    req.userId = userData._id;
    req.userrole = userData.role;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Unaythorized.Invalid token" });
  }
};
