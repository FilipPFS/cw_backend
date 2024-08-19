import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import mongoose from "mongoose";
import cors from "cors";
import path from "path";

const app = express();
const authRoutes = require("./routes/auth");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !", err));

app.use("/api/auth", authRoutes);
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(5000);
