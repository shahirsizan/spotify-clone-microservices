import { sql } from "./config/db.js";
import { redisClient } from "./config/redis.js";

export const getAllAlbum = async (req: any, res: any) => {
	try {
		let albums;
		const CACHE_EXPIRY_SECONDS = 180; // 3 minutes

		if (redisClient.isReady) {
			albums = (await redisClient.get("albums")) as string;
			albums = JSON.parse(albums);
		}

		if (albums) {
			res.json({ message: "All albums from cache", albums: albums });
			return;
		} else {
			albums = await sql`SELECT * FROM albums`;

			if (redisClient.isReady) {
				redisClient.set("albums", JSON.stringify(albums), {
					EX: CACHE_EXPIRY_SECONDS,
				});
			}

			res.json({ message: "All albums from DB", albums: albums });
			return;
		}
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getAllsongs = async (req: any, res: any) => {
	try {
		let songs;

		songs = await sql`SELECT * FROM songs`;

		res.json({ message: "Here are all the songs", songs: songs });
		return;
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getAllSongsOfAlbum = async (req: any, res: any) => {
	try {
		const { id } = req.params;

		const songs = await sql`SELECT
                                    a.id AS album_id, a.title AS album_title,
                                    s.id AS song_id, s.title AS song_title, s.audio
                                FROM
                                    albums a
                                LEFT JOIN
                                    songs s 
                                ON 
                                    s.album_id = a.id
                                WHERE
                                    a.id = ${id}`;

		console.log("songs of the album: ", songs);

		// const response = { songs, album: album[0] };

		res.json({ message: "songs of the album", response: songs });
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getSingleSong = async (req: any, res: any) => {
	try {
		const songId = req.params.id;
		const song = await sql`SELECT * FROM songs WHERE id = ${songId}`;

		res.json({ message: "Single song", response: song[0] });
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};
