import { Router } from "express";
import apiController from "../controllers/api.controller.mjs";
import { authMid } from "../middlewares/Auth.mjs";

const apiRouter = Router();

apiRouter.post("/user/register", apiController.create_user);
apiRouter.post("/user/login", apiController.user_login);
apiRouter.get("/check", authMid, apiController.check);

export default apiRouter;