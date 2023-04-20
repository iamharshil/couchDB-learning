import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const query = {
				selector: {
					status: { $eq: "draft" },
				},
				fields: ["title", "content"],
			};
			const getData = await couchDB.mango("another", query);
			return res
				.status(202)
				.json({ status: 202, message: "success", data: getData });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ status: 500, message: error.message });
		}
	} else {
		return res
			.status(405)
			.json({ status: 405, message: "Method not allowed." });
	}
}
