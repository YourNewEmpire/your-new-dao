import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import Nav from "../Nav";
import Head from "next/head";
import { Childs } from "../../interfaces/childs";
import { useRouter } from "next/dist/client/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const Layout = ({ children }: Childs) => {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", () => NProgress.start());
    router.events.on("routeChangeComplete", () => NProgress.done());
    router.events.on("routeChangeError", () => NProgress.done());
  }, [router.route]);

  return (
    <div className=" min-h-full bg-th-background ">
      <Head>
        <title>Your New Dao </title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Nav />
      <div className=" xl:mx-20 sm:mx-6 mx-4 lg:p-2 xl:p-12 justify-center items-center bg-th-foreground text-slate-300 font-body shadow-2xl shadow-cyan-600 ">
        {children}
      </div>
    </div>
  );
};

export default Layout;
