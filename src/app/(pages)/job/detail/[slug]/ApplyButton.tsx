"use client";

export function ApplyButton() {
  return <button type="button" aria-controls="form-apply"
    className="bg-[#0088FF] rounded-[4px] font-[700] text-[16px] text-white flex w-full items-center justify-center h-[48px] mb-[20px]"
    onClick={() => {
      document.getElementById("form-apply")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    }}>Ứng tuyển</button>;
}
