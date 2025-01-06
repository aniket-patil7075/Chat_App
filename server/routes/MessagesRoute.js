import {Router} from 'express'
import {verifyToken} from '../middlewares/AuthMiddleware.js';
import { deleteChatMessages, deleteForEveryone, deleteMessage, deleteMessageForUser, getMessages, uploadFile } from '../controllers/MessagesController.js';
import multer from "multer"

const messagesRoutes=Router();
const upload = multer({dest:"uploads/files"})

messagesRoutes.post("/get-messages",verifyToken,getMessages);
messagesRoutes.post(
    "/upload-file",
    verifyToken,
    upload.single("file"),
    uploadFile)

export default messagesRoutes

messagesRoutes.patch("/delete-messages/:id",  deleteChatMessages);
messagesRoutes.post("/delete-msg",verifyToken,deleteMessage)
messagesRoutes.patch('/messages/delete/:id', deleteMessageForUser);
messagesRoutes.post("/delete-everyone",verifyToken,deleteForEveryone)