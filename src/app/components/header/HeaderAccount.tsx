/* eslint-disable @next/next/no-img-element */
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaAngleDown, FaArrowRight, FaBuilding, FaUser, FaArrowRightFromBracket } from "react-icons/fa6";
import { toast } from "sonner";

export const HeaderAccount = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { isLogin, infoUser, infoCompany } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const currentPath = pathname + (searchParams.toString() ? "?" + searchParams.toString() : "");
  const authPaths = ["/user/login", "/user/register", "/company/login", "/company/register"];
  const returnTo = encodeURIComponent(authPaths.includes(pathname) ? "/" : currentPath);
  const isCompany = Boolean(infoCompany);
  const account = infoCompany || infoUser;
  const profilePath = isCompany ? "/company-manage/profile" : "/user-manage/profile";
  const name = isCompany ? infoCompany?.companyName : infoUser?.fullName;
  const image = isCompany ? infoCompany?.logo : infoUser?.avatar;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/logout", { credentials: "include" });
      if (!response.ok) throw new Error("Logout failed");
      const data = await response.json();
      if (data.code !== "success") throw new Error("Logout failed");
      onNavigate?.();
      router.push(isCompany ? "/company/login" : "/user/login");
      router.refresh();
    } catch { toast.error("Chưa thể đăng xuất. Vui lòng thử lại."); }
    finally { setIsLoggingOut(false); }
  };

  if (!isLogin || !account) {
    return <div className="header-account auth-actions">
      <Link className="auth-login" href={"/user/login?returnTo=" + returnTo} onClick={onNavigate}>Đăng nhập</Link>
      <Link className="auth-register" href={"/user/register?returnTo=" + returnTo} onClick={onNavigate}>Đăng ký <FaArrowRight aria-hidden="true" /></Link>
    </div>;
  }
  return (
    <details className="header-account account-menu" onClick={event => {
      if ((event.target as HTMLElement).closest("a")) {
        event.currentTarget.open = false;
        event.currentTarget.querySelector<HTMLElement>("summary")?.focus();
      }
    }} onKeyDown={event => {
      if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector<HTMLElement>("summary")?.focus(); }
    }} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
    }}>
      <summary aria-label={"Tài khoản " + name}>
        <span className="account-avatar">{image?.trim() ? <img src={image} alt="" /> : isCompany ? <FaBuilding aria-hidden="true" /> : <FaUser aria-hidden="true" />}</span>
        <span className="account-name">{name}</span><FaAngleDown aria-hidden="true" />
      </summary>
      <div className="account-panel">
        <div className="account-panel-heading"><strong>{name}</strong><span>{isCompany ? "Nhà tuyển dụng" : "Ứng viên"}</span></div>
        <Link href={profilePath} onClick={onNavigate}>{isCompany ? "Thông tin công ty" : "Thông tin cá nhân"}</Link>
        {isCompany && <Link href="/company-manage/job/list" onClick={onNavigate}>Quản lý công việc</Link>}
        <Link href={isCompany ? "/company-manage/cv/list" : "/user-manage/cv/list"} onClick={onNavigate}>{isCompany ? "Quản lý CV" : "CV đã ứng tuyển"}</Link>
        <button type="button" disabled={isLoggingOut} onClick={handleLogout}><FaArrowRightFromBracket aria-hidden="true" />{isLoggingOut ? "Đang đăng xuất…" : "Đăng xuất"}</button>
      </div>
    </details>
  );
};
