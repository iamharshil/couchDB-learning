import { couchDB } from "@/helper/Database";
import nc from "next-connect";
import multer from "multer";
import path from "path";
import fs from "fs";
import { productSchemaValidate } from "@/helper/common";

export const config = {
	api: {
		bodyParser: false,
	},
};

const handler = nc();

// check if each file has different name or not on client side
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/assets/product/images");
	},
	filename: function (req, file, cb) {
		cb(
			null,
			`${Date.now()}-${path.parse(file.originalname).name}${
				path.parse(file.originalname).ext
			}`,
		);
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024,
	},
});
// .fields([
// 	{
// 		name: "profile",
// 		maxCount: 1,
// 	},
// 	{
// 		name: "natid",
// 		maxCount: 1,
// 	},
// 	{
// 		name: "certificate",
// 		maxCount: 1,
// 	},
// ]);

const uploadFile = upload.array("product_image");

handler.use(uploadFile).post(async (req, res) => {
	try {
		// check if user seller
		const parsed = req.body;

		// console.log("data", parsed, "\nfile", req.files);

		const files = [req.files.map((each) => each.filename)];

		const userInfo = await couchDB.get(
			process.env.COUCH_DB_NAME,
			"_design/users/_view/users-view",
			{
				key: parsed.userId,
			},
		);

		if (userInfo.data.rows[0].value.account_type === "seller") {
			const data = {
				doc_type: "product",
				userId: parsed.userId,
				name: parsed.name,
				category: parsed.category,
				price: Number(parsed.price),
				description: parsed.description,
				images: files,
				available_products: Number(parsed.available_products),
				status: parsed.status,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const checkSchema = productSchemaValidate(data);
			if (checkSchema.count === 0) {
				await couchDB
					.insert(process.env.COUCH_DB_NAME, data)
					.then(({ data, header, status }) => {
						return res
							.status(201)
							.json({ status: 201, ok: true, message: "success", data });
					});
			} else {
				req.files.map((each) => {
					// fs.unlinkSync(each.path);
					console.log(each);
				});
				return res.status(400).json({
					status: 400,
					ok: false,
					message: "Something went wrong.",
					error: {
						message: "Extra field found while creating product.",
						extraFields: [...checkSchema.extraFields],
					},
				});
			}
		} else {
			req.files.map((each) => {
				fs.unlinkSync(each.path);
				console.log(each);
			});
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "User must be seller in order to create product.",
			});
		}
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ status: 500, message: "Internal server error.", error });
	}
});

handler.all(async (req, res) => {
	return res
		.status(405)
		.json({ status: 405, ok: false, message: "Method not allowed." });
});
export default handler;
