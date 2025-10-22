import express from "express";
import doetnv from "dotenv";
import cors from "cors";
doetnv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`server is running on ${port}`);
});
