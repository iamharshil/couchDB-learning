import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const dbName = "posts-fourth";
			const deleted = await couchDB.dropDatabase(dbName);
			return res.status(202).json({ status: 202, message: "Success" });
		} catch (error) {
			return res.status(400).json({ status: 400, message: error.message });
		}
	} else {
		return res
			.status(405)
			.json({ status: 405, message: "Method not allowed." });
	}
}
