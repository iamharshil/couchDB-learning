import { couch } from "@/helper/Database";

export default async function (req, res) {
	if (req.method === "GET") {
		try {
			const createdData = await couch.insert("another", {
				title: "Post Seventh Title",
				content: "Post seventh content.",
				author: "John Doe",
				status: "draft",
				date: "2021-08-07T05:31:05.547Z",
				type: "post",
			});
			if (createdData) {
				return res
					.status(202)
					.json({ status: 202, message: "success", data: createdData });
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
