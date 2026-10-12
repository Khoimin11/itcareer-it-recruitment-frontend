import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Settings } from "./Settings";
import "../attachments/attachments.css";
import "./settings.css";

export const metadata: Metadata = {
  title: "Cài đặt",
  description: "Quản lý mật khẩu, quyền hiển thị hồ sơ và tài khoản của bạn.",
};

export default function SettingsPage() {
  return <main className="attached-profile settings-page">
    <div className="attachment-container">
      <Link href="/" className="attachment-back"><FiArrowLeft aria-hidden="true" />Trang chủ</Link>
      <div className="attachment-page-heading"><div><h1>Cài đặt</h1><p>Quản lý bảo mật và quyền riêng tư của tài khoản.</p></div></div>
      <Settings />
    </div>
  </main>;
}
