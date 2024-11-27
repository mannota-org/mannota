"use client";

import { TypeAnimation } from "react-type-animation";

export const TypedComponent = () => {
  return (
    <TypeAnimation
      sequence={[
        "Analyze medical texts",
        1500,
        "Annotate patient records",
        1500,
        "Streamline clinical data",
        1500,
        "Enhance diagnosis accuracy",
        1500,
        "Support healthcare decisions",
        1500,
      ]}
      wrapper="span"
      speed={40}
      style={{ display: "inline-block" }}
      repeat={Infinity}
      className="relative z-20 mb-2 text-center text-5xl font-extrabold text-[#5AA676] sm:text-6xl lg:text-7xl"
    />
  );
};
