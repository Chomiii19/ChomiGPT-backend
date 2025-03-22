import express from "express";
import * as appController from "../controllers/appController";

const router = express.Router();

router.route("/new-chat").post(appController.newChat);
router.route("/chats/:userId").get(appController.getAllChats);
router
  .route("/chat/:chatId")
  .get(appController.getChat)
  .post(appController.continueChat);

export default router;
