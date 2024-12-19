import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  createChannel,
  getChannelImage,
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
channelRoutes.post("/:id/upload", (req, res, next) => {
  console.log("Request received for upload:", req.params.id);
  next();
}, upload.single("image"), uploadChannelImage);

channelRoutes.get("/api/channels/:id/image", getChannelImage);



export default channelRoutes;
