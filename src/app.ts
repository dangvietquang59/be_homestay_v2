import express, { Application, ErrorRequestHandler } from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "@/middlewares/error.middleware";
import userRouter from "./routes/user.route";
import chainRouter from "./routes/chain.route";
import branchesRouter from "./routes/branches.route";
import roomRouter from "./routes/room.route";
import reviewRouter from "./routes/review.route";
import bookingRouter from "./routes/booking.routes";
import uploadRouter from "./routes/upload.routes";

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
app.use("/api/chains", chainRouter);
app.use("/api/branches", branchesRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/upload", uploadRouter);

// Global error handler
app.use(errorHandler as ErrorRequestHandler);

export default app;
