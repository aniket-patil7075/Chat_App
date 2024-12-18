import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  createChannel,
  getChannelMessages,
  getUserChannel,
  uploadChannelImage,
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
// channelRoutes.post(
//   "/add-channel-image",
//   verifyToken,
//   upload.single("channel-image"),
//   (req, res, next) => {
//     if (!req.file) {
//       return res.status(400).json({ error: "No image file provided." });
//     }
//     next();
//   },
//   addChannelImage
// );
channelRoutes.post('/:id/upload', upload.single('image'), uploadChannelImage);

export default channelRoutes;
