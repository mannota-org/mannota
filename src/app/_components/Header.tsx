import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="relative flex h-32 flex-shrink-0 items-center justify-center bg-white bg-dot-black/[0.4] dark:bg-black dark:bg-dot-white/[0.4] sm:h-40">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>
      <h2 className="relative z-20 bg-gradient-to-b from-[#264d35] to-[#458b61] bg-clip-text pt-12 text-center text-3xl font-bold text-transparent sm:text-5xl">
        {title}
      </h2>
    </div>
  );
};

export default Header;
