import fs from "node:fs";
import path from "node:path";

/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";

const cnameCandidates = [
	path.join(process.cwd(), "CNAME"),
	path.join(process.cwd(), "public", "CNAME"),
];

const hasCustomDomain = cnameCandidates.some((filePath) => {
	if (!fs.existsSync(filePath)) {
		return false;
	}

	return fs.readFileSync(filePath, "utf8").trim().length > 0;
});

const basePath = isGithubActions && repoName && !hasCustomDomain ? `/${repoName}` : "";

const nextConfig = {
	output: "export",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	basePath,
	assetPrefix: basePath ? `${basePath}/` : undefined,
	env: {
		NEXT_PUBLIC_BASE_PATH: basePath,
	},
};
export default nextConfig;
