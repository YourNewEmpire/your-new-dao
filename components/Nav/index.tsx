import React, { useState } from "react";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { HomeIcon, CogIcon, SunIcon as SunSolid } from "@heroicons/react/solid";
import { SunIcon as SunOutline } from "@heroicons/react/outline";
import navItems from "../../lib/content/navItems";
import Modal from "../Modal";
const Nav = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  return (
    <div className="bg-th-primary-medium rounded-lg text-th-text font-body">
      <nav
        className="
                  flex items-center justify-around p-6 space-x-16 mx-0 xl:mx-12
                  text-center text-lg lg:text-3xl xl:text-5xl  font-extrabold
                  "
      >
        <Link passHref href="/">
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, translateY: 2, rotateX: 25, skewX: 3 }}
            className={`p-2 rounded-lg hover:shadow-lg
            ${router.route !== "/" && "bg-cyan-800  "}
            ${router.route === "/" && "bg-indigo-800 shadow-md"}
            `}
          >
            <HomeIcon className="w-8 lg:w-16 xl:w-24 h-8 lg:h-16 xl:h-24 hover:cursor-pointer" />
          </motion.a>
        </Link>
        {navItems.map((item, index) => (
          <Link passHref key={index} href={item.link}>
            <motion.a
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.9, translateY: 2, rotateX: 25, skewX: 3 }}
              className={`
                ${router.route !== item.link && "bg-cyan-800 "}
                ${router.route === item.link && "bg-indigo-800 shadow-md"}
                p-2 lg:p-4 xl:p-6 w-full  h-full rounded-lg 
                items-center justify-center  hover:cursor-pointer hover:shadow-lg
               `}
            >
              {item.text}
            </motion.a>
          </Link>
        ))}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9, translateY: 2, rotateX: 25, skewX: 3 }}
          className="
          p-2 
          rounded-lg hover:shadow-lg
        bg-cyan-800"
          onClick={() => (modalOpen ? close() : open())}
        >
          <CogIcon className="w-8 lg:w-16 xl:w-24 h-8 lg:h-16 xl:h-24 hover:cursor-pointer" />
        </motion.button>
      </nav>
      <AnimatePresence
        initial={false}
        exitBeforeEnter={true}
        onExitComplete={() => null}
      >
        {modalOpen && (
          <Modal handleClose={close}>
            <div className="flex flex-row justify-center items-center space-x-6 text-center">
              <p className="text-xl "> Toggle dark/light theme</p>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <SunOutline className="w-8 lg:w-16 xl:w-24 h-8 lg:h-16 xl:h-24" />
                ) : (
                  <SunSolid className="w-8 lg:w-16 xl:w-24 h-8 lg:h-16 xl:h-24" />
                )}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Nav;
