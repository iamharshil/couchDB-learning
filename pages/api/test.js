import { couch } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const getDBs = await couch.listDatabases();
			if (getDBs) {
				return res
					.status(202)
					.json({ status: 202, message: "success", data: getDBs });
			} else {
				return res
					.status(400)
					.json({ status: 400, message: "Something went wrong." });
			}
		} catch (error) {
			console.log(error);
		}
	} else {
		return res
			.status(405)
			.json({ status: 405, message: "Method not allowed." });
	}
}
