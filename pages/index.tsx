import { AppFrame } from "@captn/joy/app-frame";
import { TitleBar } from "@captn/joy/title-bar";
import { useSDK } from "@captn/react/use-sdk";
import Image from "next/image";
import { useEffect } from "react";

import package_ from "../package.json";
import logo from "../public/next.svg";

const id = package_.name;

export default function Page() {
	const { send } = useSDK<string, { appPath: string }>(id, {
		onMessage(message) {
			console.log(message);
		},
	});

	useEffect(() => {
		send({ action: "open", payload: id });
	}, [send]);

	return (
		<AppFrame color="orange" variant="solid" titleBar={<TitleBar>Hello</TitleBar>}>
			<Image src={logo.src} height={logo.height} width={logo.width} alt="next.js logo" />
		</AppFrame>
	);
}
