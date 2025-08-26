import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SSAAM-V3</title>
      </Head>
      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </>
  )
}
