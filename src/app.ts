import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import globalErrorHandler from "./controllers/globalErrorHandler";
import AppError from "./utils/appError";
import authRoutes from "./routes/authRoutes";
import appRoutes from "./routes/appRoutes";
import protect from "./middlewares/protect";
import protectPage from "./middlewares/protectPage";

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: ["https://rbac-chomi.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRoutes);
app.use("/api/v1/app", appRoutes);
app.get("/api/v1/getUser", protect, protectPage);
app.use("*", (req, res, next) =>
  next(new AppError(`Cannot find ${req.originalUrl} from the server`, 404))
);
app.use(globalErrorHandler);

export default app;
