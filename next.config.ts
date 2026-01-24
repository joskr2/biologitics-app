import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		cacheComponents: true,
		serverActions: {
			bodySizeLimit: "2mb",
		},
	},

	// React Compiler deshabilitado temporalmente - requiere babel-plugin-react-compiler
	reactCompiler: true,

	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
		],
	},
};

// Enable Cloudflare development platform
if (process.env.NODE_ENV === "development") {
	initOpenNextCloudflareForDev();
}

export default nextConfig;
