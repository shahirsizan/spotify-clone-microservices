import express from "express";
import uploadFile, { isAuth } from "./middlewares.js";
import { addAlbum } from "./controllers.js";

const router = express.Router();

router.post("/album/new", isAuth, uploadFile, addAlbum);

export default router;
