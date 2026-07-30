"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { HeaderMenu } from "./HeaderMenu";
import { HeaderAccount } from "./HeaderAccount";

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="bg-[#000071] py-[15px] px-[16px]">
      <div className="container mx-auto">
        <div className="flex items-center gap-x-[28px]">
          <Link href="/" className="text-white font-[800] sm:text-[28px] text-[20px] lg:flex-none flex-1">
            ITcareer
          </Link>
          <HeaderMenu showMenu={showMenu} onCloseMenu={() => setShowMenu(false)} />
          <div className="lg:ml-auto">
            <Suspense fallback={null}>
              <HeaderAccount />
            </Suspense>
          </div>
          <button
            onClick={handleShowMenu}
            className="text-white text-[20px] lg:hidden inline-block ml-[12px]"
          >
            <FaBars />
          </button>
        </div>
      </div>
    </header>
  );
};
