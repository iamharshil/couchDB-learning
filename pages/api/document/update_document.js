import { couch } from "@/helper/Database";

export default async function (req, res) {
	if (req.method === "GET") {
		try {
			const updated = await couch.update("learning", {
				_id: "ea5558271a4e6f1b0966a0f1dc000840",
				_rev: "1-6871fba207a527c27f31402385d86658",
				name: "John wick",
				age: 38,
				email: "johnwick@emample.com",
			});
			if (updated) {
				return res
					.status(202)
					.json({ status: 202, message: "success", data: updated });
			} else {
				return res
					.status(400)
					.json({ status: 400, message: "Something went wrong." });
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
			.json({ status: 405, message: "Method not allowed." });
	}
}
