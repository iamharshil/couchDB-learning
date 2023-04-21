import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const parsed = JSON.parse(req.body);
			console.log(parsed, typeof parsed);
			await couchDB
				.del("learning", parsed._id, parsed._rev)
				.then((doc) => {
					// get profile by view call
					console.log(doc);
				})
				.catch((error) => {
					console.log(error);
				});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				status: 500,
				ok: false,
				message: "Internal server error.",
				error,
			});
		}
	} else {
		return res
			.status(405)
			.json({ status: 405, message: "Method not allowed." });
	}
}
