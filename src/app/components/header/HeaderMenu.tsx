import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Suspense, useEffect, useRef } from "react";
import { FaAngleDown, FaAngleRight, FaXmark } from "react-icons/fa6";
import { HeaderAccount } from "./HeaderAccount";

type MenuItem = { name: string; link?: string; children?: MenuItem[]; isMegaMenu?: boolean };
const skills = ["Java", "Python", "JavaScript", "TypeScript", "ReactJS", "NodeJS", "SQL", "AWS", ".NET", "C#", "PHP", "Tester", "DevOps", "Docker", "Kubernetes", "AI/ML"];
const companies = ["LG Electronics", "NAB Innovation Centre Vietnam", "Thoughtworks Vietnam", "SHBFinance", "MB Bank", "Samsung Electronics"];

export const HeaderMenu = ({ showMenu, onCloseMenu }: { showMenu: boolean; onCloseMenu: () => void }) => {
  const { isLogin } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onCloseMenu);
  closeRef.current = onCloseMenu;

  useEffect(() => {
    if (!showMenu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const drawer = drawerRef.current;
    drawer?.querySelector<HTMLButtonElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab" || !drawer) return;
      const controls = Array.from(drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary, [tabindex="0"]'))
        .filter(element => element.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const handleResize = () => { if (window.innerWidth >= 1100) closeRef.current(); };
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
    };
  }, [showMenu]);

  const menuList: MenuItem[] = [
    { name: "Việc làm IT", children: [
      { name: "Tất cả việc làm IT", link: "/search" },
      { name: "Theo kỹ năng", isMegaMenu: true, children: skills.map(name => ({ name, link: "/search?language=" + encodeURIComponent(name) })) },
      { name: "Theo thành phố", children: [
        { name: "Hà Nội", link: "/search?city=" + encodeURIComponent("Hà Nội") },
        { name: "Đà Nẵng", link: "/search?city=" + encodeURIComponent("Thành phố Đà Nẵng") },
        { name: "Hồ Chí Minh", link: "/search?city=" + encodeURIComponent("Thành phố Hồ Chí Minh") }
      ] }
    ] },
    { name: "Top công ty IT", children: [
      { name: "Khám phá tất cả công ty", link: "/company/list" },
      ...companies.map(name => ({ name, link: "/search?company=" + encodeURIComponent(name) }))
    ] },
    ...(!isLogin ? [{ name: "Nhà tuyển dụng", children: [
      { name: "Đăng nhập nhà tuyển dụng", link: "/company/login" },
      { name: "Đăng ký nhà tuyển dụng", link: "/company/register" }
    ] }] : [])
  ];

  const renderItems = (items: MenuItem[], mobile: boolean, level = 0) => (
    <ul className={level === 0 ? "navigation-list" : "navigation-items"}>
      {items.map(item => (
        <li key={item.name}>
          {item.children ? (
            <details className={"navigation-dropdown " + (item.isMegaMenu ? "navigation-mega" : "")}
              onMouseEnter={mobile ? undefined : event => { event.currentTarget.open = true; }}
              onMouseLeave={mobile ? undefined : event => {
                if (!event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false;
              }}
              onBlur={mobile ? undefined : event => {
                if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
              }}
              onKeyDown={mobile ? undefined : event => {
                if (event.key === "Escape") {
                  event.stopPropagation();
                  event.currentTarget.open = false;
                  event.currentTarget.querySelector<HTMLElement>("summary")?.focus();
                }
              }}>
              <summary><span>{item.name}</span>{level === 0 || mobile ? <FaAngleDown aria-hidden="true" /> : <FaAngleRight aria-hidden="true" />}</summary>
              <div className="navigation-panel">{renderItems(item.children, mobile, level + 1)}</div>
            </details>
          ) : <Link href={item.link!} onClick={event => {
            if (mobile) { onCloseMenu(); return; }
            const nav = event.currentTarget.closest("nav");
            const opened = nav?.querySelectorAll<HTMLDetailsElement>("details[open]");
            opened?.[0]?.querySelector<HTMLElement>("summary")?.focus();
            opened?.forEach(details => { details.open = false; });
          }}>{item.name}</Link>}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav className="desktop-navigation" aria-label="Điều hướng chính">{renderItems(menuList, false)}</nav>
      {showMenu && <div className="mobile-menu-layer">
        <div className="mobile-menu-overlay" onClick={onCloseMenu} aria-hidden="true" />
        <div id="mobile-navigation" ref={drawerRef} className="mobile-menu-drawer" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
          <div className="mobile-menu-heading"><span id="mobile-menu-title">Khám phá ITcareer</span>
            <button type="button" aria-label="Đóng menu" onClick={onCloseMenu}><FaXmark aria-hidden="true" /></button>
          </div>
          <nav aria-label="Điều hướng trên điện thoại">{renderItems(menuList, true)}</nav>
          <div className="mobile-menu-account">
            {!isLogin && <p>Tìm cơ hội tiếp theo của bạn</p>}
            <Suspense fallback={null}><HeaderAccount onNavigate={onCloseMenu} /></Suspense>
          </div>
        </div>
      </div>}
    </>
  );
};
