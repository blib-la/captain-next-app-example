import { globalStyles } from "@captn/joy/styles";
import { ThemeProvider } from "@captn/joy/theme";
import CssBaseline from "@mui/joy/CssBaseline";
import type { AppProps } from "next/app";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider>
			{globalStyles}
			<Head>
				<title>Blibla</title>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, viewport-fit=cover"
				/>
				<meta charSet="utf8" />
				<meta name="format-detection" content="telephone=no" />
				<link rel="shortcut icon" type="image/png" href="/images/logo.png" />
			</Head>

			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	);
}

export default App;
