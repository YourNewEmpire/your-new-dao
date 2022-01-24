import React from "react";
import { motion } from "framer-motion";
import { useMoralis } from "react-moralis";
const AuthButton = () => {
  const { authenticate } = useMoralis();
  return (
    <div>
      {" "}
      <motion.button
        className="text-center text-2xl p-2 lg:p-4 xl:p-6 rounded-lg bg-cyan-600"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => authenticate()}
      >
        Authenticate
      </motion.button>
    </div>
  );
};

export default AuthButton;
