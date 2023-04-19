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
			const parsed = JSON.parse(req.body);
			// couchDB
			// 	.createDatabase(parsed.name)
			// 	.then((doc) => {
			// 		res.json({ status: 201, message: "Success", data: doc });
			// 		return res.status(201).end();
			// 		return res
			// 			.status(201)
			// 			.json({ status: 201, message: "Success", data: doc });
			// 	})
			// 	.catch((error) => {
			// 		res.json({ status: 400, message: error.message, error });
			//		return res.status(400).end();
			// 	});
			const created = await couchDB.createDatabase(parsed.name);
			if (created) {
				return res
					.status(201)
					.json({ status: 201, message: "Success", data: created });
			} else {
				return res.status(400).json({ status: 400, message: created.message });
			}
		} catch (error) {
			return res.status(400).json({ status: 400, message: error.message });
		}
	} else {
		return res
			.status(405)
			.json({ status: 405, message: "Method not allowed." });
	}
}
