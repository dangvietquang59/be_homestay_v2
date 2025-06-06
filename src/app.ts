import express, { Application, ErrorRequestHandler } from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "@/middlewares/error.middleware";
import userRouter from "./routes/user.route";
import testRoutes from "./routes/test.route";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Homestay Management API!");
});

app.use("/api/users", userRouter);
app.use("/api/test", testRoutes);

// Global error handler
app.use(errorHandler as ErrorRequestHandler);

export default app;
