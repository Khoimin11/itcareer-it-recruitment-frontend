import { Suspense } from "react";
import { Metadata } from "next";
import { SearchContainer } from "./SearchContainer";

export const metadata: Metadata = {
  title: "Kết quả tìm kiếm",
  description: "Kết quả tìm kiếm công việc...",
};

export default function SearchPage() {
  return (
    <div className="py-[60px]">
      <Suspense fallback={null}>
        <SearchContainer />
      </Suspense>
    </div>
  );
}
