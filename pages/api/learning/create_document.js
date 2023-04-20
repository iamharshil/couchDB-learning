import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const parsed = JSON.parse(req.body);
			const temp = {};
			if (!parsed.title || parsed.title.length === 0) {
				temp.title = "Title is required.";
			}
			if (!parsed.content || parsed.content.length === 0) {
				temp.content = "Content is required.";
			}
			if (!parsed.status || parsed.status.length === 0) {
				temp.status = "Status is required.";
			}
			if (Object.keys(temp).length === 0) {
				couchDB
					.insert("posts", {
						title: parsed.title,
						content: parsed.content,
						status: parsed.status,
						createdAt: new Date().toLocaleString(),
						updatedAt: new Date().toLocaleString(),
					})
					.then(
						(doc) => {
							return res
								.status(202)
								.json({ status: 202, message: "success", data: doc });
						},
						(error) => {
							return res
								.status(400)
								.json({ status: 400, message: error.message });
						},
					);
			} else {
				return res.status(400).json({ status: 400, message: { ...temp } });
			}
			// couchDB.insert("posts", {});
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
