import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction, Request, RequestHandler, Response } from "express";
import User from "../models/User";

interface SignUpSchema {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
}

interface LoginSchema {
  email: string;
  password: string;
}

export const signup: RequestHandler = async (
  req: Request<{}, {}, SignUpSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body;

    const existingMail = await User.findOne({ email: email });

    if (existingMail) {
      return res
        .status(401)
        .json(
          "Une erreur est survenue lors de la création. Ressayez ultérieurement."
        );
    }

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }
    const hashedPass = await bcrypt.hash(password, 10);

    const user = new User<SignUpSchema>({
      firstName,
      lastName,
      email,
      password: hashedPass,
      avatar,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (
  req: Request<{}, {}, LoginSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email });

    if (user === null) {
      res
        .status(401)
        .json({ message: "Paire identifiant/mot de passe est incorrect." });
    } else {
      const thePass = await bcrypt.compare(password, user.password);
      if (!thePass) {
        res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe est incorrect." });
      } else {
        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          }),
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
