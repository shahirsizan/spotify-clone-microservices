import cloudinary from "cloudinary";
import getBuffer from "./config/dataUri.js";
import { sql } from "./config/db.js";
import type { Request } from "express";

interface AuthenticatedRequest extends Request {
	user: {
		_id: string;
		role: string;
	};
}

export const addAlbum = async (req: AuthenticatedRequest, res: any) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(401).json({
				message: "You are not admin",
			});
			return;
		}

		const { title, description } = req.body;
		const file = req.file;

		if (!file) {
			res.status(400).json({
				message: "No file to upload",
			});
			return;
		}

		const fileBuffer = getBuffer(file);

		if (!fileBuffer || !fileBuffer.content) {
			res.status(500).json({
				message: "Failed to generate file buffer",
			});
			return;
		}

		const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
			folder: "Spotify/Albums",
		});

		// store the returned url for album-image in database
		const result = await sql`
                    INSERT INTO albums (title, description, thumbnail) 
                    VALUES (${title}, ${description}, ${cloud.secure_url}) RETURNING *`;

		// if (redisClient.isReady) {
		// 	await redisClient.del("albums");
		// 	console.log("Cache invalidated for albums");
		// }

		res.json({
			message: "Album Created",
			album: result[0],
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const addSong = async (req: AuthenticatedRequest, res: any) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(401).json({
				message: "You are not admin",
			});
			return;
		}

		const { title, description, albumId } = req.body as any;

		const isAlbum = await sql`SELECT * FROM albums WHERE id = ${albumId}`;
		if (isAlbum.length === 0) {
			res.status(404).json({
				message: "No album with this id",
			});
			return;
		}

		const file = req.file;
		if (!file) {
			res.status(400).json({
				message: "No file to upload",
			});
			return;
		}

		const fileBuffer = getBuffer(file);
		if (!fileBuffer || !fileBuffer.content) {
			res.status(500).json({
				message: "Failed to generate file buffer",
			});
			return;
		}

		const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
			folder: "Spotify/Songs",
			resource_type: "auto", // for both audio and video, doesn't matter
		});

		const result = await sql`
    INSERT INTO songs (title, description, audio, album_id) VALUES
    (${title}, ${description}, ${cloud.secure_url}, ${albumId})
  `;

		// if (redisClient.isReady) {
		// 	await redisClient.del("songs");
		// 	console.log("Cache invalidated for songs");
		// }

		res.json({
			message: "Song Added",
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const addThumbnail = async (req: AuthenticatedRequest, res: any) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(401).json({
				message: "You are not admin",
			});
			return;
		}

		const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;
		if (song.length === 0) {
			res.status(404).json({
				message: "No song with this id",
			});
			return;
		}

		const file = req.file;
		if (!file) {
			res.status(400).json({
				message: "No file uploaded",
			});
			return;
		}

		const fileBuffer = getBuffer(file);
		if (!fileBuffer || !fileBuffer.content) {
			res.status(500).json({
				message: "Failed to generate file buffer",
			});
			return;
		}

		const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);
		const result = await sql`
    UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${req.params.id} RETURNING *
  `;

		res.json({
			message: "Thumbnail added",
			song: result[0],
		});
	} catch (error: any) {
		console.log(error);

		res.status(500).json({
			message: error.message,
		});
	}
};

export const deleteAlbum = async (req: AuthenticatedRequest, res: any) => {
	try {
		if (req.user.role !== "admin") {
			res.status(401).json({
				message: "You are not admin",
			});
			return;
		}

		const { id } = req.params;

		const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;
		if (isAlbum.length === 0) {
			res.status(404).json({
				message: "No album with this id",
			});
			return;
		}

		await sql`DELETE FROM songs WHERE album_id = ${id}`;
		await sql`DELETE FROM albums WHERE id = ${id}`;

		res.json({
			message: "Album deleted successfully",
		});
	} catch (error: any) {
		console.log(error);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const deleteSong = async (req: AuthenticatedRequest, res: any) => {
	try {
		if (req.user?.role !== "admin") {
			res.status(401).json({
				message: "You are not admin",
			});
			return;
		}

		const { id } = req.params;

		const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
		if (song.length === 0) {
			res.status(404).json({
				message: "No song with this id",
			});
			return;
		}

		const result = await sql`DELETE FROM  songs WHERE id = ${id}`;
		if (result[0]?.rowCount === 0) {
			res.json({
				message: "Song deletion operation failed",
			});
		}

		res.json({
			message: "Song deleted successfully",
		});
	} catch (error: any) {
		console.log(error);
		res.status(500).json({
			message: error.message,
		});
	}
};
