import { couchDB } from "@/helper/Database";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const parsed = JSON.parse(req.body);
			const loggedInfo = await couchDB.mango("learning", {
				selector: {
					doc_type: "follow",
					userId: parsed.loggedUser,
				},
			});
			console.log(loggedInfo.data.docs[0]);
			if (loggedInfo.data.docs[0].following.includes(parsed.toUser)) {
				console.log("already following");
				const addedFollowing = await couchDB.update("learning", {
					...loggedInfo.data.docs[0],
					following: [...loggedInfo.data.docs[0].following, parsed.toUser],
				});
				const followerInfo = await couchDB.mango("learning", {
					selector: {
						doc_type: "follow",
						userId: parsed.toUser,
					},
				});
				console.log(followerInfo);
			} else {
				console.log("not following");
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
			.json({ status: 405, ok: false, message: "Method not allowed." });
	}
}
