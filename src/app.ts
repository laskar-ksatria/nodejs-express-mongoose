import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import http from "http";
import toobusy from "toobusy-js";
import helmet from "helmet";
import { securityMiddleware } from "./middlewares/security";
import indexRoute from "./routes";
import { ErrorHandling } from "./middlewares/error-handling";
import dbConnect from "./config/mongodb";

// Set max latency on 120ms
toobusy.maxLag(120);

// Define app
const app: Express = express();

// Define Server
const server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
> = http.createServer(app);

app.use(helmet());

// Cors
app.use(
  cors({
    origin: ["http://localhost:3005", "http://localhost:3000"], // Domain that will hit this API
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Default Limit
app.use(express.json({ limit: "100kb" }));

// parse URL-encoded
app.use(express.urlencoded({ extended: false }));

// Security middleware
app.use(securityMiddleware);

// Detect overload
app.use((req, res, next) => {
  if (toobusy()) return res.status(529).json({ message: "High Traffic" });
  else next();
});

// Cache Setup
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Main Router API
app.use("/api", indexRoute);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Our Backend Running Correctly");
});

// Error Handling
app.use(ErrorHandling);

export { app, server };
