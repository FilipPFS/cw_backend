import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthRequest extends Request {
  auth?: {
    userId: string;
  };
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decodedToken = jwt.verify(
      token,
      "RANDOM_TOKEN_SECRET"
    ) as jwt.JwtPayload;
    const userId = decodedToken.userId as string;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Utilisateur n'a pas été trouvé.");
    }

    req.auth = {
      userId: user._id.toString(),
    };

    next();
  } catch (error: unknown) {
    res.status(401).json({ error });
  }
};

export default authMiddleware;
