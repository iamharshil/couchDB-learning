import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			return new Promise((resolve, reject) => {
				let allData = [];
				const query = req.query;
				async function getData(bookmark) {
					return await couchDB
						.mango(process.env.COUCH_DB_NAME, {
							selector: {
								doc_type: "product",
								status:
									typeof query.status === "undefined"
										? { $regex: "" }
										: query.status,
								category:
									typeof query.category === "undefined"
										? { $regex: "" }
										: query.category,
								available_products:
									typeof query.available_products === "undefined"
										? { $regex: "" }
										: { $gte: Number(query.available_products) },
								price:
									typeof query.priceFrom === "undefined" &&
									typeof query.priceTo === "undefined"
										? { $regex: "" }
										: typeof query.priceFrom !== "undefined" &&
										  typeof query.priceTo === "undefined"
										? { $gte: query.priceFrom }
										: typeof query.priceFrom === "undefined" &&
										  typeof query.priceTo !== "undefined"
										? { $lte: query.priceTo }
										: {
												$gte: Number(query.priceFrom),
												$lte: Number(query.priceTo),
										  },
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
								"available_products",
								"status",
								"createdAt",
							],
							sort: query.sort ? [{ createdAt: query.sort.split("-")[1] }] : [],
							// limit: query.limit,
							// skip: Number((query.page - 1) * query.limit),
							bookmark,
						})
						.then((data) => {
							return data;
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
						reject();
						console.log(temp);
						return res.status(400).json({
							status: 400,
							ok: false,
							message: temp.message,
						});
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
