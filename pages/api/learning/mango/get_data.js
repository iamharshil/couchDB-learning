import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const query = {
				selector: {
					age: { $gt: 30 },
					email: { $regex: "johndoe@example.com" },
				},
			};

			const getEmail = await couchDB.mango("learning", query);
			if (getEmail) {
				return res
					.status(202)
					.json({ status: 202, message: "success", data: getEmail });
			} else {
				return res
					.status(400)
					.json({ status: 400, message: "Something went wrong." });
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				status: 500,
				message: "Internal server error.",
				error: error.message,
			});
		}
	} else {
		return res
			.status(405)
			.json({ status: 405, message: "Method not allowed." });
	}
}
