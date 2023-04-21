import { couchDB } from "@/helper/Database";
import multer from "multer";
import nc from "next-connect";
import path from "path";

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
		const olderData = await couchDB.get("learning", req.body._id);
		if (typeof req.file === "undefined") {
			await couchDB
				.update("learning", {
					...olderData.data,
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
		}
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ status: 500, message: "Internal server error.", error });
	}
});

export default handler;
