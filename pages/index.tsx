import { useRequiredDownloads } from "@captn/react/use-required-downloads";
import { useSDK } from "@captn/react/use-sdk";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/Download";
import PlayIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import StopIcon from "@mui/icons-material/Stop";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import LinearProgress from "@mui/joy/LinearProgress";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

import Layout from "@/components/layout";

export function useUnload(appId: string, action: string, payload = appId) {
	const { send } = useSDK<unknown, string>(appId, {});
	useEffect(() => {
		function beforeUnload() {
			send({ action, payload });
		}

		window.addEventListener("beforeunload", beforeUnload);
		return () => {
			window.removeEventListener("beforeunload", beforeUnload);
		};
	}, [send, payload, action]);
}

export function randomSeed() {
	return Math.ceil(Math.random() * 1_000_000_000) + 1;
}

export const APP_ID = "0c48d591-1288-4f5c-87a0-5bb2160e96a4";

export interface RunButtonProperties {
	isLoading: boolean;
	isRunning: boolean;
	onStop(): void;
	onStart(): void;
}

const allRequiredDownloads = [
	{
		label: "SDXL",
		id: "stabilityai/sdxl",
		source: "https://pub-aea7c308ba0147b69deba50a606e7743.r2.dev/stabilityai-sd_xl_base_1.7z",
		destination: "stable-diffusion/checkpoints",
		unzip: true,
	},
];

export function RunButton({ isLoading, isRunning, onStart, onStop }: RunButtonProperties) {
	const { isCompleted } = useRequiredDownloads(allRequiredDownloads);

	return isRunning ? (
		<Button
			disabled={isLoading || !isCompleted}
			color="danger"
			variant="soft"
			startDecorator={isLoading ? <CircularProgress /> : <StopIcon />}
			onClick={() => {
				onStop();
			}}
		>
			Stop
		</Button>
	) : (
		<Button
			disabled={isLoading || !isCompleted}
			color="success"
			variant="soft"
			startDecorator={isLoading ? <CircularProgress /> : <PlayIcon />}
			onClick={() => {
				onStart();
			}}
		>
			Start
		</Button>
	);
}

export function useResettableState<T>(initialState: T, delay: number): [T, (value: T) => void] {
	const [state, setState] = useState<T>(initialState);
	const timer = useRef(-1);

	const setTemporaryState = useCallback(
		(value: T) => {
			setState(value);

			timer.current = window.setTimeout(() => {
				setState(initialState);
			}, delay);
		},
		[initialState, delay]
	);

	return [state, setTemporaryState];
}

export function SaveButton({ image, prompt }: { image: string; prompt: string }) {
	const [saved, setSaved] = useResettableState(false, 3000);
	const promptCache = useRef(prompt);
	const imageCache = useRef(image);
	const { writeFile } = useSDK<unknown, string>(APP_ID, {});
	const saveImage = useCallback(async () => {
		const id = v4();
		await writeFile(
			`images/${id}.png`,
			image.split(";base64,").pop()!,
			{
				encoding: "base64",
			},
			promptCache.current
		);
		setSaved(true);
	}, [image, writeFile, setSaved]);

	useEffect(() => {
		if (imageCache.current !== image) {
			promptCache.current = prompt;
		}

		imageCache.current = image;
	}, [image, prompt]);

	useEffect(() => {
		async function handleSave(event: KeyboardEvent) {
			if (event.key === "s" && event.ctrlKey) {
				event.preventDefault();
				await saveImage();
			}
		}

		window.addEventListener("keydown", handleSave);
		return () => {
			window.removeEventListener("keydown", handleSave);
		};
	}, [saveImage]);
	return (
		<Button
			color={saved ? "success" : "neutral"}
			variant="soft"
			startDecorator={saved ? <CheckIcon /> : <SaveIcon />}
			onClick={saveImage}
		>
			{saved ? "Saved" : "Save"}
		</Button>
	);
}

function injectPrompt(prompt: string, style: string) {
	return style.replace(/{(\s+)?prompt(\s+)?}/i, prompt);
}

const styles = {
	photo: {
		label: "Photo",
		positive:
			"a photo of {prompt}, 4k, highres, best quality, sharp focus, aperture f/2.8, bokeh, fujifilm",
		negative:
			"nsfw, nude, worst quality, blurry, lowres, doll, figurine, illustration, digital art, toy",
	},
	cartoon: {
		label: "Cartoon",
		positive: "a cartoon of {prompt}, 4k, highres, best quality",
		negative: "nsfw, nude, worst quality, blurry, lowres, realistic, 3d render",
	},
	watercolor: {
		label: "Watercolor",
		positive: "a watercolor painting of {prompt}, 4k, highres, best quality",
		negative:
			"nsfw, nude, worst quality, blurry, lowres, realistic, digital art, painting utensils, brush",
	},
	oilPainting: {
		label: "Oil Painting",
		positive: "a oil painting of {prompt}, post-impressionism, 4k, highres, best quality",
		negative: "nsfw, nude, worst quality, blurry, lowres, frame",
	},
	hyperrealistic: {
		label: "Hyperrealism",
		positive:
			"a hyperrealistic illustration of {prompt}, intricate character concept art, 4k, highres, best quality, fine art, ultra sharp, incredible digital art",
		negative: "nsfw, nude, worst quality, blurry, lowres, photo, 3d render",
	},
	anime: {
		label: "Anime",
		positive:
			"a anime illustration of {prompt}, Chibi, kawaii style, 4k, highres, best quality, masterpiece, absurdres",
		negative: "nsfw, nude, worst quality, blurry, lowres, smudge",
	},
	charcoal: {
		label: "Charcoal",
		positive: "a charcoal sketch of {prompt}, dark theme, 4k, highres, best quality",
		negative: "nsfw, nude, worst quality, blurry, lowres, photo, realistic, drawing utensils",
	},
	tabletop: {
		label: "Tabletop Figure",
		positive:
			"a photo of {prompt} as a collectible tabletop figure, gaming miniature, rpg figurine, tilt shift, 4k, highres, best quality, depth of field, hand-painted",
		negative:
			"nsfw, nude, worst quality, blurry, lowres, illustration, lifelike, fabric, fur, fuzzy, toy, vinyl doll",
	},
	plush: {
		label: "Vinyl Doll",
		positive:
			"a photo of {prompt} as a vinyl doll, made of plastic, jointed doll, toy figure, 4k, highres, best quality",
		negative: "nsfw, nude, worst quality, blurry, lowres, fabric, fur, fuzzy",
	},
};

export type Styles = typeof styles;
export type KeyOfStyles = keyof Styles;

export const stylesItems = Object.entries(styles).map(([key, value]) => ({
	label: value.label,
	id: key,
}));

const characters = [
	"Kitten",
	"Puppy",
	"Hamster",
	"Wolf",
	"Fox",
	"Unicorn",
	"Elf",
	"Cute Monster",
	"Cute Alien",
	"Robot",
];

export function RandomImage() {
	const [isRunning, setIsRunning] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [image, setImage] = useState("/kitten.png");
	const [style, setStyle] = useState<KeyOfStyles>("photo");
	const [character, setCharacter] = useState("Kitten");

	const { send } = useSDK<unknown, string>(APP_ID, {
		onMessage(message) {
			switch (message.action) {
				case "text-to-image:started": {
					setIsRunning(true);
					setIsLoading(false);
					break;
				}

				case "text-to-image:stopped": {
					setIsRunning(false);
					setIsLoading(false);
					break;
				}

				case "text-to-image:generated": {
					setIsGenerating(false);
					setImage(message.payload);
					break;
				}

				default: {
					break;
				}
			}
		},
	});

	useUnload(APP_ID, "text-to-image:stop");

	return (
		<Box>
			<Sheet sx={{ display: "flex", gap: 1, py: 2, px: 1 }}>
				<RunButton
					isLoading={isLoading}
					isRunning={isRunning}
					onStop={() => {
						setIsLoading(true);
						send({ action: "text-to-image:stop", payload: APP_ID });
					}}
					onStart={() => {
						setIsLoading(true);
						send({ action: "text-to-image:start", payload: APP_ID });
					}}
				/>
				<Box sx={{ flex: 1 }} />
				<Select
					aria-label="Select the style"
					value={style}
					onChange={(_event, value) => {
						if (value) {
							setStyle(value);
						}
					}}
				>
					{stylesItems.map(item => (
						<Option key={item.id} value={item.id}>
							{item.label}
						</Option>
					))}
				</Select>
				<Select
					aria-label="Select the character"
					value={character}
					onChange={(_event, value) => {
						if (value) {
							setCharacter(value);
						}
					}}
				>
					{characters.map(item => (
						<Option key={item} value={item}>
							{item}
						</Option>
					))}
				</Select>
				<Button
					disabled={isGenerating || !isRunning}
					startDecorator={isGenerating ? <CircularProgress /> : <PlayIcon />}
					onClick={() => {
						if (isRunning) {
							setIsGenerating(true);
							send({
								action: "text-to-image:settings",
								payload: {
									prompt: injectPrompt(`a ${character}`, styles[style].positive),
									negative_prompt: styles[style].negative,
									seed: randomSeed(),
								},
							});
						}
					}}
				>
					Generate
				</Button>
				<SaveButton
					image={image}
					prompt={injectPrompt(`a ${character}`, styles[style].positive)}
				/>
			</Sheet>
			<Box
				sx={{
					position: "relative",
					width: "100%",
					px: 1,
					py: 1,
				}}
			>
				<Box
					sx={{
						position: "relative",
						width: "100%",
						maxWidth: 1024,
						mx: "auto",
						aspectRatio: 1,
					}}
				>
					<Image
						src={image}
						alt={`a ${character} as ${styles[style].label}`}
						layout="fill"
					/>
				</Box>
			</Box>
		</Box>
	);
}

export default function Page() {
	const { download, isCompleted, isDownloading, percent, downloadCount, requiredDownloads } =
		useRequiredDownloads(allRequiredDownloads);

	//
	// const { download, isCompleted, isDownloading, percent, downloadCount, requiredDownloads } = {
	// 	download() {},
	// 	isCompleted: false,
	// 	isDownloading: true,
	// 	percent: 0.5,
	// 	downloadCount: 0,
	// 	requiredDownloads: [],
	// };
	return (
		<Layout>
			{!isCompleted && (
				<Box sx={{ px: 1, py: 2 }}>
					<Typography>
						This app requires Stable Diffusion XL (SDXL). Please download it here.
					</Typography>
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
			)}
			<RandomImage />
		</Layout>
	);
}
