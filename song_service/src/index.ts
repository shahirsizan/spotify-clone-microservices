import express from "express";
import doetnv from "dotenv";
import cors from "cors";
doetnv.config();
import songRoutes from "./routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", songRoutes);

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`server is running on ${port}`);
});
