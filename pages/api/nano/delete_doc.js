import { nanoCouchDB } from "@/helper/DBconnect";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			await nanoCouchDB
				.use("another")
				.destroy(
					"ea5558271a4e6f1b0966a0f1dc014ab7",
					"1-4bac163c52486a0c444e4cac2fac76c3",
				)
				.then((doc) => {
					return res.status(202).json({ status: 202, data: doc });
				})
				.catch((error) => {
					res.status(400).json({ status: 400, message: error });
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
			.json({ status: 405, message: "Method not allowed." });
	}
}
