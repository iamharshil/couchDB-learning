import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const viewCreated = await couchDB.insert("learning", {
				_id: "_design/get_all_posts",
				views: {
					published: {
						map: "function (doc) {\nif (doc.status === 'publish'){\nemit(doc._id, doc);\n}\n}",
					},
				},
				language: "javascript",
			});
			if (viewCreated) {
				console.log(viewCreated.data);
			} else {
				console.log(viewCreated);
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
			.json({ status: 405, ok: false, message: "Method not allowed." });
	}
}
