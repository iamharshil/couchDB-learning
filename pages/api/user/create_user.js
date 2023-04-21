import { couchDB } from "@/helper/Database";
import { checkPassword } from "@/helper/common";
import { validateEmail, validateName, validateUsername } from "@/helper/common";
import crypto from "crypto";
import multer from "multer";
import nc from "next-connect";
import path from "path";
import fs from "fs";

export const config = {
	api: {
		bodyParser: false,
	},
};

const handler = nc();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/assets/user/profile");
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}${path.parse(file.originalname).ext}`);
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024,
	},
});

const uploadFile = upload.single("profile");

handler.use(uploadFile).post(async (req, res) => {
	try {
		const parsed = req.body;
		const errorMessages = {};
		if (!parsed.firstName || parsed.firstName.length === 0) {
			errorMessages.firstName = "First name is required.";
		} else if (!validateName(parsed.firstName)) {
			errorMessages.firstName = "First name is not valid.";
		}
		if (!parsed.lastName || parsed.lastName.length === 0) {
			errorMessages.lastName = "Last name is required.";
		} else if (!validateName(parsed.lastName)) {
			errorMessages.lastName = "Last name is not valid.";
		}
		if (!parsed.username || parsed.username.length === 0) {
			errorMessages.username = "Username is required.";
		} else if (!validateUsername(parsed.username)) {
			errorMessages.username = "Username is not valid.";
		}
		if (!parsed.email || parsed.email.length === 0) {
			errorMessages.email = "Email is required.";
		} else if (!validateEmail(parsed.email)) {
			errorMessages.email = "Email is not valid.";
		}
		if (!parsed.password) {
			errorMessages.password = "Password is required.";
		} else if (!checkPassword(parsed.password).validate) {
			errorMessages.password = checkPassword(parsed.password).message;
		}
		if (!parsed.confirmPassword) {
			errorMessages.confirmPassword = "Confirm password is required";
		} else if (
			!parsed.confirmPassword ||
			!checkPassword(parsed.confirmPassword).validate
		) {
			errorMessages.confirmPassword = checkPassword(
				parsed.confirmPassword,
			).message;
		} else if (parsed.password !== parsed.confirmPassword) {
			errorMessages.password = "Passwords does not match.";
		}

		if (Object.keys(errorMessages).length === 0) {
			const checkAvailable = {};
			const checkEmail = await couchDB.mango("learning", {
				selector: {
					doc_type: "user",
					email: parsed.email,
				},
			});
			if (checkEmail.data.docs.length > 0) {
				checkAvailable.email = "Email already exists.";
			}
			const checkUsername = await couchDB.mango("learning", {
				selector: {
					doc_type: "user",
					username: parsed.username,
				},
			});
			if (checkUsername.data.docs.length > 0) {
				checkAvailable.username = "Username already exists.";
			}

			if (Object.keys(checkAvailable).length === 0) {
				const salt = crypto.randomBytes(16).toString("hex");
				const hash = crypto
					.pbkdf2Sync(parsed.password, salt, 1000, 64, "sha512")
					.toString("hex");
				const hashedPassword = `${salt} ${hash}`;

				await couchDB
					.insert("learning", {
						doc_type: "user",
						firstName: parsed.firstName,
						lastName: parsed.lastName,
						username: parsed.username,
						email: parsed.email,
						password: hashedPassword,
						profile: req.file.filename,
						createdAt: new Date(),
						updatedAt: new Date(),
					})
					.then((doc) => {
						return res
							.status(202)
							.json({ status: 202, ok: true, message: "success", data: doc });
					})
					.catch((error) => {
						console.log(error);
						fs.unlinkSync(req.file.path);
						return res.status(400).json({
							status: 400,
							ok: false,
							message: "Something went wrong.",
							error,
						});
					});
			} else {
				fs.unlinkSync(req.file.path);
				return res.status(400).json({
					status: 400,
					oK: false,
					message: "Something went wrong.",
					error: checkAvailable,
				});
			}
		} else {
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "Something went wrong.",
				error: errorMessages,
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: 500,
			ok: false,
			message: "Internal server error.",
			error,
		});
	}
});

export default handler;
