import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/dist/client/router";
import { ThemeProvider } from "next-themes";
import React, { ComponentType } from "react";
import { MoralisProvider } from "react-moralis";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
const moralisAppID = process.env.NEXT_PUBLIC_MORALIS_APP_ID || "";
const moralisServerUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL || "";

const MyApp = ({
  Component,
  pageProps,
}: {
  Component: ComponentType<AppProps>;
  pageProps: AppProps;
}) => {
  const router = useRouter();

  return (
    <MoralisProvider appId={moralisAppID} serverUrl={moralisServerUrl}>
      <ThemeProvider>
        <Layout>
          <motion.div
            key={router.route}
            initial={{ opacity: 0.1, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Component {...pageProps} />
          </motion.div>
        </Layout>
      </ThemeProvider>
    </MoralisProvider>
  );
};

export default MyApp;
