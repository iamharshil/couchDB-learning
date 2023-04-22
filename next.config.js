/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		COUCH_DB_USERNAME: process.env.COUCH_DB_USERNAME,
		COUCH_DB_PASSWORD: process.env.COUCH_DB_PASSWORD,
		COUCHDB_NAME: process.env.COUCHDB_NAME,
		COUCHDB_URI: process.env.COUCHDB_URI,
	},
};

module.exports = nextConfig;
