import { couchDB } from "@/helper/Database";
import multer from "multer";
import nc from "next-connect";
import path from "path";
import fs from "fs";
import { validateEmail, validateName, validateUsername } from "@/helper/common";

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
	// fileFilter: (req, file, cb) => {
	// 	console.log("file from upload", file);
	// 	if (fs.existsSync(path.join(UPLOAD_DIR, file.originalname))) {
	// 		console.log("skipped");
	// 		cb(null, false);
	// 		return;
	// 	}

	// 	cb(null, true);
	// },
});

const uploadFile = upload.single("profile");

handler.use(uploadFile).post(async (req, res) => {
	try {
		const parsed = req.body;
		const checkValidation = {};
		if (!parsed.firstName || parsed.firstName.length === 0) {
			checkValidation.firstName = "First name is required.";
		} else if (!validateName(parsed.firstName)) {
			checkValidation.firstName = "First name is not valid.";
		}
		if (!parsed.lastName || parsed.lastName.length === 0) {
			checkValidation.lastName = "Last name is required.";
		} else if (!validateName(parsed.lastName)) {
			checkValidation.lastName = "Last name is not valid.";
		}
		if (!parsed.username || parsed.username.length === 0) {
			checkValidation.username = "Username is required.";
		} else if (!validateUsername(parsed.username)) {
			checkValidation.username = "Username is not valid";
		}
		if (!parsed.email || parsed.email.length === 0) {
			checkValidation.email = "Email is required.";
		} else if (!validateEmail(parsed.email)) {
			checkValidation.email = "Email is not valid.";
		}

		if (Object.keys(checkValidation).length === 0) {
			let olderData = await couchDB.get("learning", req.body._id);
			olderData = olderData.data;
			if (typeof req.file === "undefined") {
				await couchDB
					.update("learning", {
						...olderData,
						_rev: req.body._rev,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						username: req.body.username,
						email: req.body.email,
						updatedAt: new Date(),
					})
					.then(({ data }) => {
						return res
							.status(202)
							.json({ status: 202, ok: true, message: "success", data });
					})
					.catch((error) => {
						return res.status(400).json({
							status: 400,
							ok: false,
							message: error.message,
						});
					});
			} else {
				await couchDB
					.update("learning", {
						...olderData,
						_rev: req.body._rev,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						username: req.body.username,
						email: req.body.email,
						profile: req.file.filename,
						updatedAt: new Date(),
					})
					.then(({ data }) => {
						fs.unlinkSync(`public/assets/user/profile/${olderData.profile}`);
						return res
							.status(202)
							.json({ status: 202, ok: true, message: "success", data });
					})
					.catch((error) => {
						fs.unlinkSync(req.file.path);
						return res.status(400).json({
							status: 400,
							ok: false,
							message: error.message,
						});
					});
			}
		} else {
			if (req.file) {
				fs.unlinkSync(req.file.path);
			}
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "Something went wrong.",
				error: checkValidation,
			});
		}
	} catch (error) {
		fs.unlinkSync(req.file.path);
		console.log(error);
		return res
			.status(500)
			.json({ status: 500, message: "Internal server error.", error });
	}
});

export default handler;
