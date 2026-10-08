import type { Metadata } from "next";
import { AttachedProfile } from "./AttachedProfile";

export const metadata: Metadata = {
  title: "Hồ sơ đính kèm",
  description: "CV cá nhân, kinh nghiệm, kỹ năng và thư giới thiệu của ứng viên.",
};

export default function AttachmentsPage() {
  return <AttachedProfile />;
}
