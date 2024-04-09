import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import Link from "next/link";

import logo from "../public/next.svg";

import Layout from "@/components/layout";

export default function Page() {
	return (
		<Layout>
			<Typography>This is the second page</Typography>
			<Box>
				<Link href="/">Home</Link>
			</Box>

			<Image src={logo.src} height={logo.height} width={logo.width} alt="next.js logo" />
		</Layout>
	);
}
