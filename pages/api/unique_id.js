import { couchDB } from "@/helper/Database";

export default async function helper(req, res) {
	if (req.method === "GET") {
		try {
			// use empty uniqid for one id only.
			couchDB.uniqid(10).then(
				(ids) => {
					return res
						.status(202)
						.json({ status: 202, message: "success", data: ids });
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
