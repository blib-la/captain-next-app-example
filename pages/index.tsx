import { AppFrame } from "@captn/joy/app-frame";
import { TitleBar } from "@captn/joy/title-bar";
import { useSDK } from "@captn/react/use-sdk";
import { USER_THEME_KEY } from "@captn/utils/constants";
import { useColorScheme } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import { useEffect } from "react";

import package_ from "../package.json";
import logo from "../public/next.svg";

const id = package_.name;

export default function Page() {
	const { setMode } = useColorScheme();
	const { send } = useSDK<string, { appPath: string }>(id, {
		onMessage(message) {
			console.log(message);
		},
	});

	useEffect(() => {
		const unsubscribeTheme = window.ipc.on(
			USER_THEME_KEY,
			(theme?: "light" | "dark" | "system") => {
				console.log("theme", { theme });
				if (theme) {
					setMode(theme);
				}
			}
		);
		const unsubscribeLanguage = window.ipc.on("language", (locale?: string) => {
			console.log("locale", { locale });
		});
		return () => {
			unsubscribeTheme();
			unsubscribeLanguage();
		};
	}, [setMode]);

	return (
		<AppFrame
			titleBar={
				<TitleBar color="orange" variant="soft">
					Hello
				</TitleBar>
			}
		>
			<Typography>
				This is an example for a Next.js App using {package_.dependencies.next}
			</Typography>
			<Image src={logo.src} height={logo.height} width={logo.width} alt="next.js logo" />
		</AppFrame>
	);
}
