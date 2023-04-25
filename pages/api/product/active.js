import { couchDB } from "@/helper/Database";

export const config = {
	api: {
		externalResolver: true,
	},
};

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			return new Promise((resolve, reject) => {
				let allData = [];
				async function getData(bookmark) {
					return await couchDB
						.mango(process.env.COUCH_DB_NAME, {
							selector: {
								doc_type: "product",
								status: "active",
							},
							limit: 1,
							bookmark,
						})
						.then((docs) => {
							return docs;
						})
						.catch((error) => {
							return error;
						});
				}
				async function recurFunc(prevBookmark) {
					const temp = await getData(prevBookmark);
					if (temp.status === 200) {
						if (temp.data.docs.length > 0) {
							allData = [...allData, ...temp.data.docs];
							recurFunc(temp.data.bookmark);
						} else {
							resolve();
							return res.status(202).json({
								status: 202,
								ok: true,
								message: "success",
								data: allData,
							});
						}
					} else {
						console.log(temp);
						reject();
						return res
							.status(400)
							.json({ status: 400, ok: false, message: temp.message });
					}
				}
				recurFunc("");
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
