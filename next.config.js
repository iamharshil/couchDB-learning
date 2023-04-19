/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		COUCH_DB_USERNAME: process.env.COUCH_DB_USERNAME,
		COUCH_DB_PASSWORD: process.env.COUCH_DB_PASSWORD,
	},
};

module.exports = nextConfig;
