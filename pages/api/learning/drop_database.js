import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const parsed = JSON.parse(req.body);
			couchDB.dropDatabase(parsed.name).then(
				() => {
					return res.status(202).json({ status: 202, message: "success" });
				},
				(error) => {
					return res.status(400).json({ status: 400, message: error.message });
				},
			);
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
