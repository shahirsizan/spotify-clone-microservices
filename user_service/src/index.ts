import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();
import userRoutes from "./routes.js";

const connectDb = async () => {
	try {
		mongoose.connect(process.env.MONGO_URI as string);

		console.log("✅ MongoDB Connected");
	} catch (error) {
		console.log("❌ error -> connectDb(): ", error);
	}
};

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", userRoutes);
app.get("/", (req, res) => {
	res.send("Server is working");
});

const port = process.env.PORT || 5000;

app.listen(5000, () => {
	console.log(`✅ Server is running on port ${port}`);
	connectDb();
});

/**
 * in package.json:
 * "dev": "concurrently \"tsc -w\" \"nodemon dist/index.js\" "
 * this `npm run dev` commanad will first build the `dist` folder (watch constantly)
 * and then nodemon the `index.js` file inside it to run the server
 */
