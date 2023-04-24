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
			if (loggedInfo.data.docs[0].following.includes(parsed.toUser)) {
				const removeFollowing = loggedInfo.following.filter((each) => {
					return each !== parsed.toUser;
				});
				const followerInfo = await couchDB.mango("learning", {
					selector: {
						doc_type: "follow",
						userId: parsed.toUser,
					},
				});
				const removeFollower = followerInfo.data.docs[0].follower.filter(
					(each) => {
						return each !== parsed.loggedUser;
					},
				);
				// console.log(f)
			} else {
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
				const followerUpdate = await couchDB.update("learning", {
					...followerInfo.data.docs[0],
					follower: [...followerInfo.data.docs[0].follower, parsed.loggedUser],
				});
				if (addedFollowing && followerUpdate) {
					return res
						.status(202)
						.json({ status: 202, ok: true, message: "success" });
				} else {
					return res
						.status(400)
						.json({ status: 400, ok: false, message: "Something went wrong." });
				}
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
