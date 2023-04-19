import { couch } from "@/helper/Database";

export default async function (req, res) {
	if (req.method === "GET") {
		try {
			const createNew = await couch.insert("learning", {
				name: "John Doe",
				age: 30,
				email: "johndoe@example.com",
			});
			if (createNew) {
				return res
					.status(202)
					.json({ status: 202, message: "success", data: createNew });
			} else {
				return res
					.status(400)
					.json({ status: 400, message: "Something went wrong." });
			}
		} catch (error) {
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
