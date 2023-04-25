import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const query = req.query;
			console.log(query);
			const mangoQuery = {
				selector: {
					doc_type: "product",
				},
				sort: [{ createdAt: query.date }],
			};

			await couchDB
				.mango(process.env.COUCH_DB_NAME, mangoQuery)
				.then(({ data, header, status }) => {
					return res
						.status(202)
						.json({ status: 202, ok: true, message: "success", data });
				})
				.catch((error) => {
					console.log(error);
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
