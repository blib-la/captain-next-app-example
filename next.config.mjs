import transpileModules from "next-transpile-modules";

const withTM = transpileModules(["@captn/joy", "@mui/joy"]); // Pass the modules you would like to see transpiled

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	assetPrefix: "./",
	trailingSlash: true,
};

export default withTM(nextConfig);
