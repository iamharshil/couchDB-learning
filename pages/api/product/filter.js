import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			return new Promise((resolve, reject) => {
				const query = req.query;
				let allData = [];
				const queryInfo = {
					status:
						typeof query.status === "undefined" ? { $regex: "" } : query.status,
					category:
						typeof query.category === "undefined"
							? { $regex: "" }
							: query.category,
					price:
						typeof query.priceTo === "undefined" &&
						typeof query.priceFrom === "undefined"
							? { $regex: "" }
							: typeof query.priceFrom !== "undefined" &&
							  typeof query.priceTo === "undefined"
							? {
									$gte: Number(query.priceFrom),
							  }
							: typeof query.priceFrom === "undefined"
							? {
									$lte: Number(query.priceTo),
							  }
							: {
									$gte: Number(query.priceFrom),
									$lte: Number(query.priceTo),
							  },
					available_products:
						typeof query.available_products === "undefined"
							? { $regex: "" }
							: query.available_products,
				};

				async function getData(bookmark) {
					return await couchDB.mango(process.env.COUCH_DB_NAME, {
						selector: {
							doc_type: "product",
							status: queryInfo.status,
							category: queryInfo.category,
							price: queryInfo.price,
							available_products: queryInfo.available_products,
						},
						sort: [{ createdAt: query.sort.split("-")[1] }],
						limit: 250,
						bookmark,
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
								data: allData.slice(
									query.limit * (query.page - 1),
									query.limit,
								),
								total: Math.ceil(allData.length / query.limit),
							});
						}
					} else {
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
