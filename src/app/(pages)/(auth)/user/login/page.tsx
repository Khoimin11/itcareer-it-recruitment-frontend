import { Suspense } from "react";
import { Metadata } from "next";
import { FormLogin } from "./FormLogin";

export const metadata: Metadata = {
  title: "Dang nhap (Ung vien)",
  description: "Mo ta trang dang nhap (Ung vien)...",
};

export default function UserLoginPage() {
  return (
    <div className="py-[60px]">
      <div className="container mx-auto px-[16px]">
        <div className="border border-[#DEDEDE] rounded-[8px] py-[50px] px-[20px] max-w-[602px] mx-auto">
          <h1 className="font-[700] text-[20px] text-black text-center mb-[20px]">
            Dang nhap (Ung vien)
          </h1>
          <Suspense fallback={null}>
            <FormLogin />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
