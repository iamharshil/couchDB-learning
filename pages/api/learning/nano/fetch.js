import { nanoCouchDB } from "@/helper/DBconnect";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const listOfData = [
				"ea5558271a4e6f1b0966a0f1dc015d73",
				"ea5558271a4e6f1b0966a0f1dc011ee4",
				"ea5558271a4e6f1b0966a0f1dc0139f1",
			];
			await nanoCouchDB
				.use("another")
				.fetch({ keys: listOfData })
				.then((data) => {
					return res
						.status(202)
						.json({ status: 202, message: "success", data });
				})
				.catch((error) => {
					return res.status(400).json({ status: 400, message: error.message });
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
