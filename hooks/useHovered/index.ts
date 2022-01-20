import React, { useState } from "react";

const useHovered = (initial: boolean) => {
  const [isHovered, setHovered] = useState(initial);
  const onEnter = () => {
    setHovered(true);
  };
  const onLeave = () => {
    setHovered(false);
  };
  return { isHovered, setHovered, onEnter, onLeave };
};

export default useHovered;
