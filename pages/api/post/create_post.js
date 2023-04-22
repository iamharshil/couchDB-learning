import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const parsed = JSON.parse(req.body);

			await couchDB
				.insert("learning", {
					doc_type: "post",
					userId: parsed.userId,
					title: parsed.title,
					description: parsed.description,
					content: parsed.content,
					status: parsed.status,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.then(({ data, header, status }) => {
					return res
						.status(201)
						.json({ status: 201, ok: true, message: "success", data });
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
