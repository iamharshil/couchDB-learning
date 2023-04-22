import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			// let temp = false;
			// get auth token
			// await fetch(`${process.env.COUCHDB_URI}/_session`, {
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	method: "POST",
			// 	body: JSON.stringify({
			// 		name: process.env.COUCH_DB_USERNAME,
			// 		password: process.env.COUCH_DB_PASSWORD,
			// 	}),
			// })

			// await fetch(`${process.env.COUCHDB_URI}/_all_dbs`, { //get

			// await fetch(`${process.env.COUCHDB_URI}/_dbs_info`, {
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	method: "POST",
			// 	body: JSON.stringify({
			// 		keys: ["learning"],
			// 	}),
			// })

			// await fetch(`${process.env.COUCHDB_URI}/learning/_all_docs`, {
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// })

			// create new db
			// await fetch(`${process.env.COUCHDB_URI}/created_new_second`, {
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 		Cookie:
			// 			"AuthSession=YWRtaW46NjQ0Mzc0MDc69P4aCRF1fv4lVGTFLWqafapWVlQ; Version=1; Expires=Sat, 22-Apr-2023 05:53:35 GMT; Max-Age=600; Path=/; HttpOnly",
			// 	},
			// 	method: "PUT",
			// })

			// 	.then((data) => {
			// 		console.log(data.status);
			// 		if (data.status !== 201) {
			// 			temp = true;
			// 		}
			// 		data.json();
			// 	})
			// 	.then((data) => {
			// 		console.log(data);
			// 		if (temp) {
			// 			return res.status(400).json({
			// 				status: 400,
			// 				ok: false,
			// 				message: "Something went wrong.",
			// 			});
			// 		} else {
			// 			return res
			// 				.status(202)
			// 				.json({ status: 202, ok: true, message: "success", data });
			// 		}
			// 	})
			// 	.catch((error) => {
			// 		console.log(error);
			// 		return res
			// 			.status(400)
			// 			.json({ status: 400, ok: false, message: error.message });
			// 	});

			// get design with query
			// await fetch(
			// 	`${process.env.COUCH_DB_URI}/learning/_design_docs?limit=3&conflict=true&include_docs=true`,
			// 	{
			// 		headers: {
			// 			"Content-Type": "application/json",
			// 		},
			// 		method: "POST",
			// 		body: JSON.stringify({
			// 			keys: ["_design/get_all_posts"],
			// 		}),
			// 	},
			// )

			// create index
			// await fetch(`${process.env.COUCH_DB_URI}/learning/_index`, {
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 		Cookie:
			// 			"AuthSession=YWRtaW46NjQ0MzgwREU6fLXFJ60dNExULtFm7OxBdBcrPmw; Version=1; Expires=Sat, 22-Apr-2023 06:48:22 GMT; Max-Age=600; Path=/; HttpOnly",
			// 	},

			// 	method: "POST",
			// 	body: JSON.stringify({
			// 		index: {
			// 			fields: ["title", "_id"],
			// 		},
			// 		name: "all-posts-index",
			// 		type: "json",
			// 	}),
			// })

			// await couchDB
			// 	.mango("learning", {
			// 		selector: {
			// 			title: {
			// 				$regex: "",
			// 			},
			// 		},
			// 		sort: [
			// 			{
			// 				createdAt: "asc",
			// 			},
			// 		],
			// 		skip: 0,
			// 		limit: 1,
			// 		// bookmark:
			// 		// 	"g2wAAAACaAJkAA5zdGFydGtleV9kb2NpZG0AAAAgOGJlNmEwYWJhMDRiMWUyNWQ5YTdlZGNlOWMwMDEyNjJoAmQACHN0YXJ0a2V5bAAAAAFtAAAAGDIwMjMtMDQtMjJUMDM6NTQ6MjcuOTcxWmpq",
			// 	})
			// 	.then((data) => {
			// 		// console.log("data is", data);
			// 		return res
			// 			.status(202)
			// 			.json({ status: 202, ok: true, message: "success", data });
			// 	})
			// 	.catch((error) => {
			// 		return res
			// 			.status(400)
			// 			.json({ status: 400, ok: false, message: error.message });
			// 	});

			// generate index
			const uniqueId = await couchDB.uniqid();
			await couchDB
				.insert("learning", {
					_id: `_design/${uniqueId[0]}`,
					language: "query",
					views: {
						"doc_type-index": {
							map: {
								fields: {
									doc_type: "asc",
								},
							},
							reduce: "_count",
							options: {
								def: {
									fields: ["doc_type"],
								},
							},
						},
					},
				})
				.then((data) => {
					console.log(data.data);
					return res.status(201).json({
						status: 201,
						ok: true,
						message: "success",
						data: data.data,
					});
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
