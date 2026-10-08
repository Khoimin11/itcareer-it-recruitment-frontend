import { Metadata } from "next"
import { FormProfile } from "./FormProfile"
import Link from "next/link";
import { FiArrowLeft, FiPaperclip } from "react-icons/fi";
import "../attachments/attachments.css";
import "./profile.css";

export const metadata: Metadata = {
  title: "Thông tin cá nhân",
  description: "Quản lý thông tin cá nhân và ảnh đại diện của ứng viên.",
}

export default function UserManageProfilePage() {
  return (
    <>
      <main className="attached-profile personal-profile">
        <div className="attachment-container">
          <Link href="/" className="attachment-back"><FiArrowLeft aria-hidden="true" />Trang chủ</Link>
          <div className="attachment-page-heading">
            <div><h1>Thông tin cá nhân</h1><p>Quản lý thông tin liên hệ và ảnh đại diện của bạn.</p></div>
            <Link href="/user-manage/attachments" className="attachment-outline"><FiPaperclip aria-hidden="true" />Hồ sơ đính kèm</Link>
          </div>
          <FormProfile />
        </div>
      </main>
    </>
  )
}
