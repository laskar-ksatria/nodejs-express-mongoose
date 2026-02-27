import UserController from "../controllers/user.controller";
import { Router } from "express";
import { RateLimit } from "../services/rate-limit";
import Authentication from "../middlewares/auth";

const router = Router();

router.post(
  "/register",
  RateLimit({ max: 10, ms: 60000 }),
  UserController.createUser,
);
router.post(
  "/login",
  RateLimit({ max: 10, ms: 60000 }),
  UserController.loginUser,
);
router.get(
  "/",
  RateLimit({ max: 3, ms: 1000 }),
  Authentication,
  UserController.getUser,
);

export default router;
