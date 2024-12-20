"use client";

import { TypeAnimation } from "react-type-animation";

export const TypedComponent = () => {
  return (
    <TypeAnimation
      sequence={[
        "Improve medical data quality",
        800,
        "Annotate medical texts in real-time",
        800,
        "Enhance active learning models",
        800,
      ]}
      wrapper="span"
      speed={40}
      style={{ display: "inline-block" }}
      repeat={Infinity}
      className="relative z-20 mb-2 text-center font-extrabold text-[#5AA676] "
    />
  );
};
