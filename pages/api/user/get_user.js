import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const parsed = JSON.parse(req.body);
			await couchDB
				.get("learning", parsed._id)
				.then(({ data }) => {
					return res
						.status(202)
						.json({ status: 202, ok: true, message: "success", data });
				})
				.catch((error) => {
					return res
						.status(400)
						.json({ status: 400, ok: false, message: error.message });
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
			.json({ status: 405, ok: false, message: "Method not allowed." });
	}
}
