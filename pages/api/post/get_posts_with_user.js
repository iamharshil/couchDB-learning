import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const allData = await couchDB.get(
				"learning",
				"_design/get_all_posts/_view/published",
				{
					include_docs: true,
				},
			);
			if (allData.status === 200) {
				const userInfo = [];
				const posts = [];

				allData.data.rows.map((each) => {
					if (each.doc.doc_type === "post") {
						posts.push(each.doc);
					} else {
						userInfo.push(each.doc);
					}
				});
				return res.status(202).json({
					status: 202,
					ok: true,
					message: "success",
					data: { users: userInfo, posts },
				});
			} else {
				return res
					.status(400)
					.json({ status: 400, ok: false, message: allData.message });
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
