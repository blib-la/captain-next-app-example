import { useRequiredDownloads } from "@captn/react/use-required-downloads";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import LinearProgress from "@mui/joy/LinearProgress";
import Typography from "@mui/joy/Typography";
import Image from "next/image";

import package_ from "../package.json";
import logo from "../public/next.svg";

import Layout from "@/components/layout";

export default function Page() {
	const { download, isCompleted, isDownloading, percent, downloadCount, requiredDownloads } =
		useRequiredDownloads([
			{
				label: "SD Turbo",
				id: "stabilityai/sd-turbo/fp16",
				source: "https://pub-aea7c308ba0147b69deba50a606e7743.r2.dev/stabilityai-sd-turbo-fp16.7z",
				destination: "stable-diffusion/checkpoints",
				unzip: true,
			},
		]);
	/* 	Const { download, isCompleted, isDownloading, percent, downloadCount, requiredDownloads } = {
		download() {},
		isCompleted: false,
		isDownloading: true,
		percent: 0.5,
		downloadCount: 0,
		requiredDownloads: [],
	}; */
	return (
		<Layout>
			<Typography>
				This is an example for a Next.js App using {package_.dependencies.next}
			</Typography>
			<Box>
				<Button
					disabled={isDownloading || isCompleted}
					startDecorator={isCompleted ? <CheckIcon /> : <DownloadIcon />}
					onClick={download}
				>
					<Box sx={{ pb: 1 }}>
						Download ({downloadCount} of {requiredDownloads.length})
					</Box>

					<LinearProgress
						determinate={isDownloading || isCompleted}
						value={isDownloading || isCompleted ? percent * 100 : 0}
						sx={{
							position: "absolute",
							left: 0,
							right: 0,
							bottom: 0,
							"--LinearProgress-radius": "0px",
							"--LinearProgress-thickness": "8px",
						}}
					/>
				</Button>
			</Box>

			<Image src={logo.src} height={logo.height} width={logo.width} alt="next.js logo" />
		</Layout>
	);
}
