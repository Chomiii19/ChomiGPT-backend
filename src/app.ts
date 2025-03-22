import cookieParser from "cookie-parser";
import express from "express";
import globalErrorHandler from "./controllers/globalErrorHandler";
import AppError from "./utils/appError";
import authRoutes from "./routes/authRoutes";
import appRoutes from "./routes/appRoutes";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRoutes);
app.use("/api/v1/app", appRoutes);
app.use("*", (req, res, next) =>
  next(new AppError(`Cannot find ${req.originalUrl} from the server`, 404))
);
app.use(globalErrorHandler);

export default app;
