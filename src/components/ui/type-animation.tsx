"use client";

import { TypeAnimation } from "react-type-animation";

export const TypedComponent = () => {
  return (
    <TypeAnimation
      sequence={[
        "Monitor students",
        1500,
        "Track Exam status",
        1500,
        "View Exam details",
        1500,
        "Respond to help requests",
        1500,
        "View exam submissions",
        1500,
      ]}
      wrapper="span"
      speed={40}
      style={{ display: "inline-block" }}
      repeat={Infinity}
      className="relative z-20 mb-2 text-center text-5xl font-extrabold text-[#6466E9] sm:text-6xl lg:text-7xl"
    />
  );
};
