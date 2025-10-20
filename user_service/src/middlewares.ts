import jwt from "jsonwebtoken";
import { User } from "./models.js";

export const isAuth = async (req: any, res: any, next: any) => {
	try {
		const token = req.headers.token as string;

		if (!token) {
			res.status(403).json({
				message: "No token in header",
			});
			return;
		}

		const decodedValue = jwt.verify(
			token,
			process.env.JWT_SEC as string
		) as JwtPayload;

		if (!decodedValue || !decodedValue._id) {
			res.status(403).json({
				message: "Invalid token",
			});
			return;
		}

		const decodedUserId = decodedValue._id;

		const user = await User.findById(decodedUserId).select("-password");

		if (!user) {
			res.status(403).json({
				message: "User Not found",
			});
			return;
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(403).json({
			message: "Please Login",
		});
	}
};
