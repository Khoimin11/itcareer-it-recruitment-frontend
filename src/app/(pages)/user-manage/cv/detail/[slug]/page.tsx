/* eslint-disable @typescript-eslint/no-explicit-any */
import { cvStatusList, positionList, workingFormList } from "@/config/variable";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chi tiết CV đã gửi",
  description: "Mô tả trang chi tiết CV đã gửi...",
};

export default async function UserManageCVDetailPage({ params }: {
  params: Promise<{
    slug: string
  }>
}) {
  const { slug } = await params;

  const headerList = await headers();
  const cookie = headerList.get("cookie");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/cv/detail/${slug}`, {
    headers: {
      cookie: cookie || ""
    },
    cache: "no-store"
  });
  const data = await res.json();

  let infoCV: any = null;
  let infoJob: any = null;
  let statusLabel = "";

  if (data.code == "success") {
    infoCV = data.infoCV;
    infoJob = data.infoJob;

    infoJob.position = positionList.find((item) => item.value == infoJob.position)?.label ?? infoJob.position;
    infoJob.workingForm = workingFormList.find((item) => item.value == infoJob.workingForm)?.label ?? infoJob.workingForm;
    statusLabel = cvStatusList.find((item) => item.value == infoCV.status)?.label ?? infoCV.status;
  }

  return (
    <div className="py-[60px]">
      <div className="container mx-auto px-[16px]">
        {infoCV && (
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
              <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">
                Thông tin CV đã gửi
              </h2>
              <Link href="/user-manage/cv/list" className="font-[400] text-[14px] text-[#0088FF] underline">
                Quay lại danh sách
              </Link>
            </div>

            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Họ tên:
              <span className="font-[700] ml-[5px]">
                {infoCV.fullName}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Email:
              <span className="font-[700] ml-[5px]">
                {infoCV.email}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Số điện thoại:
              <span className="font-[700] ml-[5px]">
                {infoCV.phone}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Trạng thái:
              <span className="font-[700] ml-[5px]">
                {statusLabel}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              File CV:
            </div>
            <div className="bg-[#D9D9D9] h-[736px]">
              <iframe src={infoCV.fileCV} className="w-full h-full"></iframe>
            </div>
          </div>
        )}

        {infoJob && (
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
            <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black mb-[20px]">
              Thông tin công việc
            </h2>

            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Tên công việc:
              <span className="font-[700] ml-[5px]">
                {infoJob.title}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Công ty:
              <span className="font-[700] ml-[5px]">
                {infoJob.companyName}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Mức lương:
              <span className="font-[700] ml-[5px]">
                {infoJob.salaryMin.toLocaleString("vi-VN")}$ - {infoJob.salaryMax.toLocaleString("vi-VN")}$
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Cấp bậc:
              <span className="font-[700] ml-[5px]">
                {infoJob.position}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Hình thức làm việc:
              <span className="font-[700] ml-[5px]">
                {infoJob.workingForm}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Công nghệ:
              <span className="font-[700] ml-[5px]">
                {infoJob.technologies.join(", ")}
              </span>
            </div>
            <Link href={`/job/detail/${infoJob.id}`} className="font-[400] text-[14px] text-[#0088FF] underline">
              Xem chi tiết công việc
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
