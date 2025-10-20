import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./routes.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const initDB = async () => {
	try {
		await sql`
        CREATE TABLE IF NOT EXISTS albums(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

		await sql`
        CREATE TABLE IF NOT EXISTS songs(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255),
          audio VARCHAR(255) NOT NULL,
          album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

		console.log("✅ NeonDB initialized");
	} catch (error) {
		console.log("❌ error -> initDB(): ", error);
	}
};

app.use("/api/v1", adminRoutes);

const port = process.env.PORT || 7000;

app.listen(port, async () => {
	console.log(`✅ admin-service is running on port ${port}`);
	initDB();
});
