import express from "express";
import uploadFile, { isAuth } from "./middlewares.js";
import { addAlbum, addSong } from "./controllers.js";

const router = express.Router();

router.post("/album/new", isAuth, uploadFile, addAlbum);
router.post("/song/new", isAuth, uploadFile, addSong);

export default router;
