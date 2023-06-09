import { couchDB } from "@/helper/Database";
import { IncomingForm } from "formidable";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			couchDB
				.insertAttachment(
					"another",
					"ea5558271a4e6f1b0966a0f1dc011ee4",
					"custom-attach",
					"attachment body",
					"11-0e97da0a9a382fddcba664ab2ec1a316",
				)
				.then(
					({ data, header, status }) => {
						console.log("data", data, "header", header, "status", status);
						return res
							.status(201)
							.json({ status: 201, message: "success", data });
					},
					(error) => {
						console.log("error", error);
						return res
							.status(400)
							.json({ status: 400, message: error.message });
					},
				);
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ status: 500, message: "Internal server error.", error });
		}
	} else if (req.method === "POST") {
		try {
			const data = await new Promise((resolve, reject) => {
				const form = new IncomingForm();
				form.parse(req, (err, fields, files) => {
					if (err) return reject(err);
					resolve({ fields, files });
				});
			});
			await couchDB
				.insertAttachment(
					data?.fields.database_name,
					data?.fields._id,
					data?.fields.title,
					data?.fields.attachment_image,
					data?.fields._rev,
				)
				.then(({ data, header, status }) => {
					return res
						.status(202)
						.json({ status: 202, message: "success", data });
				})
				.catch((error) => {
					return res.status(400).json({ status: 400, message: error.message });
				});
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ status: 500, message: "Internal server error.", error });
		}
	} else {
		return res
			.status(405)
			.json({ status: 405, message: "Method not allowed." });
	}
}
