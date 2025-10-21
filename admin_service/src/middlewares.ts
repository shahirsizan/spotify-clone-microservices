import axios from "axios";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
dotenv.config();

interface IUser {
	_id: string;
	name: string;
	email: string;
	password: string;
	role: string;
	playlist: string[];
}

interface AuthenticatedRequest extends Request {
	user?: IUser | null;
}

export const isAuth = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.token;

		if (!token) {
			res.status(403).json({
				message: "No token found",
			});
			return;
		}

		const { data } = await axios.get(
			`${process.env.User_URL}/api/v1/user/me`,
			{
				headers: {
					token,
				},
			}
		);

		req.user = data.user;

		next();
	} catch (error: any) {
		res.status(403).json({
			message: "Please Login",
		});
	}
};

//multer setup
import multer, { memoryStorage } from "multer";
const uploadFile = multer({ storage: multer.memoryStorage() }).single("file");
export default uploadFile;
