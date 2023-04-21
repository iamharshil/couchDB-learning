import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			await couchDB
				.delAttachment(
					"another",
					"ea5558271a4e6f1b0966a0f1dc011ee4",
					"attachment",
					"12-267799aa8bd733540e3ce32d43955413",
				)
				.then(
					({ data, header, status }) => {
						console.log(data, header, status);
						return res
							.status(202)
							.json({ status: 202, message: "success", data });
					},
					(error) => {
						console.log(error);
						return res
							.status(400)
							.json({ status: 400, message: error.message });
					},
				);
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
