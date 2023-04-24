import NodeCouchDb from "node-couchdb";

export const couchDB = new NodeCouchDb({
	host: "127.0.0.1",
	port: "5984",
	protocol: "http",
	auth: {
		user: process.env.COUCH_DB_USERNAME,
		pass: process.env.COUCH_DB_PASSWORD,
	},
});

// export const couch = couchDB.use("posts");
