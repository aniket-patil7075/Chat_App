import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  addChannelImage,
  createChannel,
  getChannelMessages,
  getUserChannel,
} from "../controllers/ChannelController.js";
import multer from "multer";

const channelRoutes = Router();

const upload = multer({ dest: "uploads/profiles/" });

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channels", verifyToken, getUserChannel);
channelRoutes.get(
  "/get-channel-messages/:channelId",
  verifyToken,
  getChannelMessages
);
channelRoutes.post(
  "/add-channel-image",
  verifyToken,
  upload.single("channel-image"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }
    next();
  },
  addChannelImage
);

export default channelRoutes;
