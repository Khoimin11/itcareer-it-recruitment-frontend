import { Suspense } from "react";
import { Metadata } from "next";
import { SearchContainer } from "./SearchContainer";

export const metadata: Metadata = {
  title: "Ket qua tim kiem",
  description: "Ket qua tim kiem cong viec...",
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
