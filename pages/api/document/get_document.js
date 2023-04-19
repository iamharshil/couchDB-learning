import { couch } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			couch
				.get("learning", "_design/learning/_view/new-view")
				.then((doc) => {
					return res
						.status(202)
						.json({ status: 202, message: "success", data: doc });
				})
				.catch((error) => {
					console.log(error);
					return res.status(400).json({ status: 400, message: error.message });
				});
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ status: 500, message: "Internal server error.", error });
		}
	}
}
