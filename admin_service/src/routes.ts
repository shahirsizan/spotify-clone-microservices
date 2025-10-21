import express from "express";
import uploadFile, { isAuth } from "./middlewares.js";
import {
	addAlbum,
	addSong,
	addThumbnail,
	deleteAlbum,
	deleteSong,
} from "./controllers.js";

const router = express.Router();

router.post("/album/new", isAuth, uploadFile, addAlbum);
router.post("/song/new", isAuth, uploadFile, addSong);
router.post("/song/:id", isAuth, uploadFile, addThumbnail);
router.delete("/album/:id", isAuth, deleteAlbum);
router.delete("/song/:id", isAuth, deleteSong);

export default router;
