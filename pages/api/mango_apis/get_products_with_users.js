import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const resData = [];
			const errorData = [];

			await couchDB
				.get(process.env.COUCH_DB_NAME, "_design/products/_view/product-view")
				.then(({ data, header, status }) => {
					resData.push(data.rows);
				})
				.catch((error) => {
					return { ok: false, error };
				});

			const users = [...resData[0].map((each) => String(each.value.userId))];

			await couchDB
				.mango(process.env.COUCH_DB_NAME, {
					selector: {
						doc_type: "user",
						_id: {
							$in: users,
						},
					},
					fields: [
						"_id",
						"_rev",
						"firstName",
						"lastName",
						"username",
						"email",
						"profile",
						"account_type",
					],
					execution_stats: true,
				})
				.then(({ data, header, status }) => {
					resData.push(data.docs);
				})
				.catch((error) => {
					console.log(error);
				});
			if (errorData.length === 0) {
				return res
					.status(202)
					.json({ status: 202, ok: true, message: "success", data: resData });
			} else {
				return res.status(400).json({
					status: 400,
					ok: false,
					message: "Something went wrong.",
					error: errorData,
				});
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
