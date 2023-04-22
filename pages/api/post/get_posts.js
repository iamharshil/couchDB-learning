import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			await couchDB
				.mango("learning", {
					selector: {
						title: {
							$regex: "",
						},
					},
					sort: [
						{
							createdAt: "asc",
						},
					],
					skip: 0,
					limit: 1,
					// bookmark:
					// 	"g2wAAAACaAJkAA5zdGFydGtleV9kb2NpZG0AAAAgOGJlNmEwYWJhMDRiMWUyNWQ5YTdlZGNlOWMwMDEyNjJoAmQACHN0YXJ0a2V5bAAAAAFtAAAAGDIwMjMtMDQtMjJUMDM6NTQ6MjcuOTcxWmpq",
				})
				.then((data) => {
					// console.log("data is", data);
					return res
						.status(202)
						.json({ status: 202, ok: true, message: "success", data });
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
