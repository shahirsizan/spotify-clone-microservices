import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./routes.js";
import cloudinary from "cloudinary";
import cors from "cors";
dotenv.config();

/**
 * cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
 * above code renders warnings for possible null env variables. 
That's why we impose checking like below to ensure no env variables are null
 */

// Define a function or wrapper to ensure variables are present
function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		// Stop the application if a required variable is missing
		throw new Error(
			`FATAL ERROR: Environment variable ${name} is not set.`
		);
	}
	return value;
}

cloudinary.v2.config({
	// Use the helper function to guarantee the type is 'string'
	cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
	api_key: requireEnv("CLOUDINARY_API_KEY"),
	api_secret: requireEnv("CLOUDINARY_API_SECRET"),
});

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
