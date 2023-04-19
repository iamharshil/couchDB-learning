import { couch } from "@/helper/Database";

export default async function (req, res) {
	if (req.method === "GET") {
		try {
			const deleted = await couch.del(
				"learning",
				"ea5558271a4e6f1b0966a0f1dc000840",
				"2-cbd550c913e39302fb6f2dddeee126bf",
			);
			if (deleted) {
				return res
					.status(202)
					.json({ status: 202, message: "success", data: deleted });
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
