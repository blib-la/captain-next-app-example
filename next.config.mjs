import transpileModules from "next-transpile-modules";

const withTM = transpileModules([
	"@mui/joy",
	"@captn/joy",
	"@captn/utils",
	"@captn/react",
	"@captn/theme",
]); // Pass the modules you would like to see transpiled

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	assetPrefix: "./",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
};

export default withTM(nextConfig);
