import { nanoCouchDB } from "@/helper/DBconnect";
import fs from "fs";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			fs.readFileSync("a.png", async function (err, data) {
				await nanoCouchDB
					.use("another")
					.multipart.insert(
						{ foo: "bar" },
						[{ name: "a.png", data, content_type: "image/png" }],
						"mydoc",
					)
					.then((res) => {
						return res
							.status(202)
							.json({ status: 202, message: "success", data: res });
					})
					.catch((error) => {
						return res
							.status(400)
							.json({ status: 400, message: error.message });
					});
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
