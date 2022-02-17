import React from "react";
import { motion } from "framer-motion";
export interface IInfoCard {
  icon: JSX.Element;
  text: string;
}

const InfoCard = ({ icon, text }: IInfoCard) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="
      grid grid-flow-row grid-cols-8 gap-4
      p-2 lg:p-4 xl:p-6 
      items-center justify-center
      rounded-lg bg-th-primary-dark"
    >
      <div className="col-span-1 w-32 h-32">{icon}</div>
      <div className="col-span-7 text-center text-3xl">
        <p className="">{text}</p>
      </div>
    </motion.div>
  );
};

export default InfoCard;
