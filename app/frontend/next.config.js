/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
module.exports = {
	async rewrites() {
		return [
			{ source: '/api_proxy/:path*', destination: '/api/api_proxy/:path*' }
		]
	}
}
