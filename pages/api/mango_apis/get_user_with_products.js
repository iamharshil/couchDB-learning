import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const parsed = JSON.parse(req.body);

			let resData = {};
			const errorData = [];

			await couchDB
				.mango(process.env.COUCH_DB_NAME, {
					selector: {
						doc_type: "user",
						_id: parsed.userId,
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
				})
				.then(({ data, header, status }) => {
					resData = data;
				})
				.catch((error) => {
					errorData.push(error);
				});
			await couchDB
				.mango(process.env.COUCH_DB_NAME, {
					selector: {
						doc_type: "product",
						userId: parsed.userId,
					},
					fields: [
						"_id",
						"_rev",
						"userId",
						"name",
						"category",
						"price",
						"description",
						"images",
					],
				})
				.then(({ data, header, status }) => {
					resData.docs = { ...resData.docs[0], products: data };
				})
				.catch((error) => {
					errorData.push(error);
				});

			// console.log("resData", resData, "error", errorData);

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
