import { AppFrame } from "@captn/joy/app-frame";
import { TitleBar } from "@captn/joy/title-bar";
import type { ReactNode } from "react";

export default function Layout({ children }: { children?: ReactNode }) {
	return (
		<AppFrame
			titleBar={
				<TitleBar color="pink" variant="solid">
					Random Character
				</TitleBar>
			}
		>
			{children}
		</AppFrame>
	);
}
