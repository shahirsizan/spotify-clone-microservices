import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "./models.js";

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;
		let user = await User.findOne({ email });

		if (user) {
			res.status(400).json({
				message: "User Already exists",
			});

			return;
		}

		const hashPassword = await bcrypt.hash(password, 10);

		user = await User.create({
			name: name,
			email: email,
			password: hashPassword,
		});

		// create jwt to send to user
		const token = jwt.sign(
			{ _id: user._id },
			process.env.JWT_SEC as string,
			{
				expiresIn: "3d",
			}
		);

		res.status(201).json({
			message: "User Registered",
			user: user,
			token: token,
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};
