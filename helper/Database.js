import NodeCouchDb from "node-couchdb";

export const couch = new NodeCouchDb({
	host: "127.0.0.1",
	port: "5984",
	protocol: "http",
	auth: {
		user: "admin",
		pass: "adminpw",
	},
});
