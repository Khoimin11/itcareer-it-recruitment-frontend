import { Metadata } from "next"
import { CVList } from "./CVList"
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import "../../attachments/attachments.css";

export const metadata: Metadata = {
  title: "Quản lý CV đã gửi",
  description: "Theo dõi CV đã gửi và trạng thái ứng tuyển của bạn.",
}

export default function UserManageCVListPage() {
  return (
    <main className="attached-profile">
      <div className="attachment-container">
        <Link href="/" className="attachment-back"><FiArrowLeft aria-hidden="true" />Trang chủ</Link>
        <div className="attachment-page-heading">
          <div><h1>Quản lý CV đã gửi</h1><p>Theo dõi CV đã gửi và trạng thái ứng tuyển của bạn.</p></div>
        </div>
        <CVList />
      </div>
    </main>
  )
}
