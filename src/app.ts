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
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const uploadRoutes = require("./routes/upload");
const eventRoutes = require("./routes/events");
const messageRoutes = require("./routes/messages");
require("dotenv").config();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !", err));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/events", eventRoutes);
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(5000);
