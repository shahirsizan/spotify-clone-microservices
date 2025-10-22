import express from "express";
import doetnv from "dotenv";
import cors from "cors";
doetnv.config();
import songRoutes from "./routes.js";
import { redisClient } from "./config/redis.js";

const app = express();
app.use(cors());
app.use(express.json());

redisClient
	.connect()
	.then(() => {
		console.log("✅ Redis connceted");
	})
	.catch((error) => {
		console.log("❌ Redis connection failed");
	});

app.use("/api/v1", songRoutes);

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`✅ server running on ${port}`);
});
