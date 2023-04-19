import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			couchDB
				.createDatabase("another")
				.then((doc) => {
					return res
						.status(202)
						.json({ status: 202, message: "success", data: doc });
				})
				.catch((error) => {
					console.log(error);
					return res.status(400).json({ status: 400, message: error.message });
				});
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ status: 500, message: "Internal server error.", error });
		}
	} else if (req.method === "POST") {
		try {
			const created = await couchDB.createDatabase(req.body.name);
			if (created) {
				return res.status(201).json({ status: 201, message: "Success" });
			} else {
				return res.status(400).json({
					status: 400,
					message: "Something went wrong.",
					error: created,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				status: 500,
				message: "Internal server error.",
				error: error.message,
			});
		}
	} else {
		return res
			.status(405)
			.json({ status: 405, message: "Method not allowed." });
	}
}
