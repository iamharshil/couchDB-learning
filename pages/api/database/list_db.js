import { couch } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const listData = await couch.listDatabases();
			if (listData) {
				console.log(listData);
				return res
					.status(202)
					.json({ status: 202, message: "success", data: listData });
			} else {
				console.log("Something went wrong.");
				return res
					.status(400)
					.json({ status: 400, message: "Something went wrong." });
			}
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
