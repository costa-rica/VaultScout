import "../styles/globals.css";
import Head from "next/head";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

function App({ Component, pageProps }) {
  return (
    <div className={`${jetBrainsMono.variable} `}>
      <Head>
        <title>Vault Scout</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default App;
