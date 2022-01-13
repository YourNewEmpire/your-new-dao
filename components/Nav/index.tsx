import React from "react";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { HomeIcon } from "@heroicons/react/solid";
import navItems from "../../lib/content/navItems";
const Nav = () => {
  const router = useRouter();
  return (
    <div className="bg-cyan-600  ">
      <nav
        className="
                  flex items-center justify-around p-6 space-x-16 mx-0 xl:mx-12
                    text-center text-5xl text-slate-300 font-semibold
                  "
      >
        <Link passHref href="/">
          <motion.a
            className={`p-2 rounded-lg hover:shadow-lg
            ${router.route !== "/" && "bg-indigo-700 bg-opacity-20  "}
            ${
              router.route === "/" && "bg-indigo-800 shadow-md"
            }
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9,  translateY: 2, rotateX: 25, skewX: 3 }}
          >
            <HomeIcon className="w-24 h-24 hover:cursor-pointer" />
          </motion.a>
        </Link>
        {navItems.map((item, index) => (
          <Link key={index} href={item.link}>
            <motion.a
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.9, translateY: 2, rotateX: 25, skewX: 3 }}
              className={`
                ${router.route !== item.link && "bg-indigo-700 bg-opacity-20  "}
                ${router.route === item.link && "bg-indigo-800 shadow-md"}
                p-6 w-full  h-full rounded-lg 
                items-center justify-center  hover:cursor-pointer hover:shadow-lg
               `}
            >
              {item.text}
            </motion.a>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Nav;
