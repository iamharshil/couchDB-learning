import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			// couchDB
			// 	.insert("posts", {
			// 		_id: "_design/get-by-date",
			// 		views: {
			// 			"older-posts": {
			// 				map: "function(doc){\n\tif(doc.date && doc.title){\n\temit(doc.date, doc.title);\n}\n}",
			// 			},
			// 		},
			// 		language: "javascript",
			// 	})
			// 	.then((doc) => {
			// 		res
			// 			.status(202)
			// 			.json({ status: 202, message: "success", data: doc });
			// 		return resolve();
			// 	})
			// 	.catch((error) => {
			// 		console.log(error);
			// 		res.status(400).json({ status: 400, message: error.message });
			// 		return reject();
			// 	});
			// 02
			// couchDB
			// 	.get("posts", "_design/get-by-date/_view/older-posts", {
			// 		selector: {
			// 			date: {
			// 				$eq: [2009, 1, 15, 15, 52, 20],
			// 			},
			// 		},
			// 	})
			// 	.then((doc) => {
			// 		res
			// 			.status(202)
			// 			.json({ status: 202, message: "success", data: doc });
			// 		return resolve();
			// 	})
			// 	.catch((error) => {
			// 		console.log(error);
			// 		res.status(400).json({ status: 400, message: error.message });
			// 		return reject();
			// 	});
			// 03
			await couchDB
				.mango("learning", {
					selector: {
						// firstName: { $regex: "First" },
						createdAt: {
							$gte: "2023-04-21T07:16:00.219Z",
						},
					},
					fields: ["firstName", "lastName", "username", "email", "createdAt"],
					sort: [{ "createdAt": "asc" }],
					limit: 20,
					skip: 0,
					execution_stats: true,
				})

				.then((doc) => {
					res.status(202).json({ status: 202, message: "success", data: doc });
				})
				.catch((error) => {
					console.log(error);
					res.status(400).json({ status: 400, message: error.message });
				});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ status: 500, message: error.message });
		}
	} else {
		return res
			.status(405)
			.json({ status: 405, message: "Method not allowed." });
	}
}
