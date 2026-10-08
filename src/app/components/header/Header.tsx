"use client";

import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { HeaderMenu } from "./HeaderMenu";
import { HeaderAccount } from "./HeaderAccount";
import "./Header.css";

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-row">
          <Link href="/" aria-label="ITcareer — Trang chủ" className="header-brand">
            ITcareer
          </Link>
          <HeaderMenu showMenu={showMenu} onCloseMenu={() => {
            setShowMenu(false);
            menuButtonRef.current?.focus();
          }} />
          <div className="header-account-container">
            <Suspense fallback={null}>
              <HeaderAccount />
            </Suspense>
          </div>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={handleShowMenu}
            aria-label={showMenu ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
            aria-expanded={showMenu}
            aria-controls={showMenu ? "mobile-navigation" : undefined}
            className="header-menu-toggle"
          >
            {showMenu ? <FaXmark aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
};
