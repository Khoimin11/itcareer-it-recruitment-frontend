/* eslint-disable @next/next/no-img-element */
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaBuilding, FaUser } from "react-icons/fa6";

const AvatarCircle = (props: {
  href: string
  image?: string
  alt: string
  type: "user" | "company"
}) => {
  const { href, image, alt, type } = props;
  const hasImage = Boolean(image && image.trim());

  return (
    <Link
      href={href}
      className="w-[34px] h-[34px] rounded-full bg-white/10 border border-white/20 overflow-hidden inline-flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors"
    >
      {hasImage ? (
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : type === "company" ? (
        <FaBuilding className="text-white text-[15px]" />
      ) : (
        <FaUser className="text-white text-[15px]" />
      )}
    </Link>
  );
};

export const HeaderAccount = () => {
  const { isLogin, infoUser, infoCompany } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const userLoginLink = `/user/login?returnTo=${encodeURIComponent(currentPath)}`;
  const userRegisterLink = `/user/register?returnTo=${encodeURIComponent(currentPath)}`;

  const handleLogout = (linkRedirect: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "success") {
          router.push(linkRedirect);
        }
      });
  }

  return (
    <>
      <div className="inline-flex items-center gap-x-[10px] text-white font-[600] sm:text-[16px] text-[12px] relative group/sub-1">
        {isLogin ? (
          <>
            {infoUser && (
              <>
                <Link href="/user-manage/profile" className="truncate max-w-[120px] sm:max-w-none">
                  {infoUser.fullName}
                </Link>
                <AvatarCircle
                  href="/user-manage/profile"
                  image={infoUser.avatar}
                  alt={infoUser.fullName}
                  type="user"
                />
                <ul className="absolute top-[100%] right-[0px] w-[220px] bg-[#000065] hidden group-hover/sub-1:block z-[999]">
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/user-manage/profile" className="text-white font-[600] text-[16px]">
                      Thông tin cá nhân
                    </Link>
                  </li>
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/user-manage/cv/list" className="text-white font-[600] text-[16px]">
                      Quản lý CV đã gửi
                    </Link>
                  </li>
                  <li 
                    className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2 cursor-pointer"
                    onClick={() => handleLogout("/user/login")}
                  >
                    Đăng xuất
                  </li>
                </ul>
              </>
            )}

            {infoCompany && (
              <>
                <Link href="/company-manage/profile" className="truncate max-w-[120px] sm:max-w-none">
                  {infoCompany.companyName}
                </Link>
                <AvatarCircle
                  href="/company-manage/profile"
                  image={infoCompany.logo}
                  alt={infoCompany.companyName}
                  type="company"
                />
                <ul className="absolute top-[100%] right-[0px] w-[220px] bg-[#000065] hidden group-hover/sub-1:block z-[999]">
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/company-manage/profile" className="text-white font-[600] text-[16px]">
                      Thông tin công ty
                    </Link>
                  </li>
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/company-manage/job/list" className="text-white font-[600] text-[16px]">
                      Quản lý công việc
                    </Link>
                  </li>
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/company-manage/cv/list" className="text-white font-[600] text-[16px]">
                      Quản lý CV
                    </Link>
                  </li>
                  <li 
                    className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2 text-[16px] cursor-pointer"
                    onClick={() => handleLogout("/company/login")}
                  >
                    Đăng xuất
                  </li>
                </ul>
              </>
            )}
          </>
        ) : (
          <>
            <Link href={userLoginLink} className="">
              Đăng Nhập
            </Link>
            <span className="">/</span>
            <Link href={userRegisterLink} className="">
              Đăng Ký
            </Link>
          </>
        )}
      </div>
    </>
  )
}
