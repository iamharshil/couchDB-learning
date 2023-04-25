import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const query = req.query;
			let total;
			// console.log(typeof query);
			const oldView = await couchDB.get(
				process.env.COUCH_DB_NAME,
				"_design/products",
			);
			await couchDB
				.update(process.env.COUCH_DB_NAME, {
					...oldView.data,
					views: {
						...oldView.data.views,
						count: {
							reduce: "_count",
							map: 'function (doc) {\n  if (doc.doc_type === "product"){\n    emit(doc._id, doc);\n  }\n}',
						},
					},
					language: "javascript",
				})
				.catch((error) => {
					console.log(error);
				});
			await couchDB
				.get(process.env.COUCH_DB_NAME, "_design/products/_view/count")
				.then(({ data }) => {
					total = data.rows[0].value;
				});
			await couchDB
				.mango(process.env.COUCH_DB_NAME, {
					selector: {
						doc_type: "product",
					},
					limit: Number(query.limit),
					skip: Number((query.page - 1) * query.limit),
				})
				.then(({ data, header, status }) => {
					console.log(data);
					return res.status(202).json({
						status: 202,
						ok: true,
						message: "success",
						data: data.docs,
						total: Math.ceil(total / query.limit),
					});
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
