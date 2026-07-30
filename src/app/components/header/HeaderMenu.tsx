import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { FaAngleDown, FaAngleLeft, FaAngleRight, FaXmark } from "react-icons/fa6"
import { useMemo, useState } from "react";

type MenuItem = {
  name: string
  link: string
  children?: MenuItem[] | null
  isMegaMenu?: boolean
  isLogin?: boolean
}

type MobileView =
  | { type: "root" }
  | { type: "children"; title: string; items: MenuItem[] }

export const HeaderMenu = (
  props: {
    showMenu: boolean
    onCloseMenu: () => void
  }
) => {
  const { showMenu, onCloseMenu } = props;
  const { isLogin } = useAuth();
  const [mobileView, setMobileView] = useState<MobileView>({ type: "root" });

  const skillList: MenuItem[] = [
    { name: "Java", link: "/search?language=Java" },
    { name: "Python", link: "/search?language=Python" },
    { name: "JavaScript", link: "/search?language=JavaScript" },
    { name: "TypeScript", link: "/search?language=TypeScript" },
    { name: "ReactJS", link: "/search?language=ReactJS" },
    { name: "NodeJS", link: "/search?language=NodeJS" },
    { name: "SQL", link: "/search?language=SQL" },
    { name: "AWS", link: "/search?language=AWS" },
    { name: ".NET", link: "/search?language=.NET" },
    { name: "C#", link: "/search?language=C%23" },
    { name: "PHP", link: "/search?language=PHP" },
    { name: "Tester", link: "/search?language=Tester" },
    { name: "DevOps", link: "/search?language=DevOps" },
    { name: "Docker", link: "/search?language=Docker" },
    { name: "Kubernetes", link: "/search?language=Kubernetes" },
    { name: "AI/ML", link: "/search?language=AI%2FML" }
  ];

  const menuList: MenuItem[] = [
    {
      name: "Việc Làm IT",
      link: "#",
      children: [
        {
          name: "Việc làm IT theo kỹ năng",
          link: "#",
          isMegaMenu: true,
          children: skillList
        },
        {
          name: "Việc làm IT theo thành phố",
          link: "#",
          children: [
            { name: "Hà Nội", link: "/search?city=Hà Nội" },
            { name: "Đà Nẵng", link: "/search?city=Đà Nẵng" },
            { name: "Hồ Chí Minh", link: "/search?city=Hồ Chí Minh" }
          ]
        }
      ]
    },
    {
      name: "Top Công Ty IT",
      link: "/company/list",
      children: [
        { name: "LG Electronics", link: "/search?company=LG Electronics" },
        { name: "NAB Innovation Centre Vietnam", link: "/search?company=NAB Innovation Centre Vietnam" },
        { name: "Thoughtworks Vietnam", link: "/search?company=Thoughtworks Vietnam" },
        { name: "SHBFinance", link: "/search?company=SHBFinance" },
        { name: "MB Bank", link: "/search?company=MB Bank" },
        { name: "Samsung Electronics", link: "/search?company=Samsung Electronics" }
      ]
    },
    {
      name: "Nhà Tuyển Dụng",
      link: "#",
      isLogin: false,
      children: [
        { name: "Đăng Nhập", link: "/company/login" },
        { name: "Đăng Ký", link: "/company/register" }
      ]
    }
  ];

  const visibleMenuList = useMemo(() => {
    return menuList.filter((menu) => menu.isLogin === undefined || menu.isLogin === isLogin);
  }, [isLogin]);

  const handleOpenMobileChildren = (item: MenuItem) => {
    if (!item.children || item.children.length === 0) return;
    setMobileView({
      type: "children",
      title: item.name,
      items: item.children
    });
  };

  const handleBackMobile = () => {
    setMobileView({ type: "root" });
  };

  const handleCloseMobile = () => {
    setMobileView({ type: "root" });
    onCloseMenu();
  };

  const renderDesktopSubMenu = (items: MenuItem[], isMegaMenu?: boolean) => {
    return (
      <ul
        className={
          isMegaMenu
            ? "hidden lg:group-hover/sub-2:grid lg:absolute top-[0px] left-[100%] w-[760px] bg-[#000065] z-[999] p-[20px] grid-cols-4 gap-x-[28px] gap-y-[8px]"
            : "hidden lg:group-hover/sub-2:block lg:absolute top-[0px] left-[100%] w-[280px] bg-[#000065] z-[999]"
        }
      >
        {items.map((menuSub2, indexSub2) => (
          <li
            key={indexSub2}
            className={
              isMegaMenu
                ? "py-[10px] px-[16px] rounded-[4px] hover:bg-[#000096]"
                : "py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096]"
            }
          >
            <Link
              href={menuSub2.link}
              className="block text-white font-[600] text-[16px]"
            >
              {menuSub2.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <nav className="hidden lg:block">
        <ul className="flex gap-x-[30px] flex-wrap">
          {visibleMenuList.map((menu, index) => (
            <li
              key={index}
              className="inline-flex items-center gap-x-[8px] relative group/sub-1 py-[10px]"
            >
              <Link
                href={menu.link}
                className="text-white font-[600] text-[16px]"
              >
                {menu.name}
              </Link>
              {menu.children && (
                <FaAngleDown className="text-white text-[16px] shrink-0" />
              )}
              {menu.children && (
                <ul className="hidden group-hover/sub-1:block absolute top-[100%] left-[0px] w-[280px] bg-[#000065] z-[999]">
                  {menu.children.map((menuSub1, indexSub1) => (
                    <li
                      key={indexSub1}
                      className="py-[10px] px-[16px] rounded-[4px] flex items-start justify-between hover:bg-[#000096] relative group/sub-2 gap-x-[8px]"
                    >
                      <Link
                        href={menuSub1.link}
                        className="text-white font-[600] text-[16px] flex-1 min-w-0"
                      >
                        {menuSub1.name}
                      </Link>
                      {menuSub1.children && (
                        <FaAngleRight className="text-white text-[16px] shrink-0 mt-[4px]" />
                      )}
                      {menuSub1.children && renderDesktopSubMenu(menuSub1.children, menuSub1.isMegaMenu)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {showMenu && (
        <div className="lg:hidden fixed inset-0 z-[999]">
          <button
            type="button"
            aria-label="Đóng menu"
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseMobile}
          />

          <div className="relative h-full w-[280px] max-w-[85vw] bg-[#000065] flex flex-col">
            <div className="relative flex items-center justify-between px-[16px] py-[14px] border-b border-[#000096]">
              <button
                type="button"
                aria-label="Quay lại"
                className={"text-white text-[18px] " + (mobileView.type === "root" ? "invisible" : "")}
                onClick={handleBackMobile}
              >
                <FaAngleLeft />
              </button>
              <button
                type="button"
                aria-label="Đóng menu"
                className="absolute top-[12px] right-[-18px] w-[36px] h-[36px] rounded-full bg-[#000096] text-white text-[20px] flex items-center justify-center shadow-[0px_4px_12px_rgba(0,0,0,0.25)]"
                onClick={handleCloseMobile}
              >
                <FaXmark />
              </button>
              <div className="text-white font-[600] text-[18px] flex-1 ml-[8px]">
                {mobileView.type === "root" ? "" : mobileView.title}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {mobileView.type === "root" && (
                <ul className="py-[6px]">
                  {visibleMenuList.map((menu, index) => (
                    <li key={index}>
                      {menu.children ? (
                        <button
                          type="button"
                          className="w-full px-[16px] py-[18px] flex items-center justify-between text-left text-white font-[500] text-[18px] hover:bg-[#000096]"
                          onClick={() => handleOpenMobileChildren(menu)}
                        >
                          <span>{menu.name}</span>
                          <FaAngleRight className="text-[16px] shrink-0" />
                        </button>
                      ) : (
                        <Link
                          href={menu.link}
                          className="block px-[16px] py-[18px] text-white font-[500] text-[18px] hover:bg-[#000096]"
                          onClick={handleCloseMobile}
                        >
                          {menu.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {mobileView.type === "children" && (
                <ul className="py-[6px]">
                  {mobileView.items.map((item, index) => (
                    <li key={index}>
                      {item.children ? (
                        <button
                          type="button"
                          className="w-full px-[16px] py-[18px] flex items-center justify-between text-left text-white font-[500] text-[18px] hover:bg-[#000096]"
                          onClick={() => handleOpenMobileChildren(item)}
                        >
                          <span>{item.name}</span>
                          <FaAngleRight className="text-[16px] shrink-0" />
                        </button>
                      ) : (
                        <Link
                          href={item.link}
                          className="block px-[16px] py-[18px] text-white font-[500] text-[18px] hover:bg-[#000096]"
                          onClick={handleCloseMobile}
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
