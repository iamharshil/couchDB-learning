import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			couchDB
				.insert("posts", {
					_id: "_design/get-all-posts",
					views: {
						"all-posts": {
							map: "function (doc) {\n emit(doc, 1);\n }",
						},
					},
					language: "javascript",
				})
				.then(
					(doc) => {
						return res
							.status(202)
							.json({ status: 202, message: "success", data: doc });
					},
					(error) => {
						console.log(error);
						return res
							.status(400)
							.json({ status: 400, message: error.message });
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
