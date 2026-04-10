import { Router } from "express";
import apiController from "../controllers/api.controller.mjs";
import { authMid } from "../middlewares/Auth.mjs";
import { upload } from "../middlewares/Multer.mjs";

const apiRouter = Router();

apiRouter.post("/user/register", apiController.create_user);
apiRouter.post("/user/login", apiController.user_login);
apiRouter.post("/user/update", upload.single("file"), apiController.update_user);
apiRouter.get("/check", authMid, apiController.check);
apiRouter.get("/user/:user_id", authMid, apiController.get_user);

export default apiRouter;