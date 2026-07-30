/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { positionList, workingFormList } from "@/config/variable";
import { ChangeEvent, useEffect, useState } from "react";
import { CVItem } from "./CVItem";

const ITEMS_PER_PAGE = 6;

export const CVList = () => {
  const [listCV, setListCV] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setListCV(data.listCV);
          setCurrentPage(1);
        }
      });
  }, []);

  const handleDeleteSuccess = (id: string) => {
    setListCV((prev) => {
      const nextList = prev.filter((cv) => cv.id !== id);
      const nextTotalPages = Math.max(1, Math.ceil(nextList.length / ITEMS_PER_PAGE));

      setCurrentPage((current) => (current > nextTotalPages ? nextTotalPages : current));
      return nextList;
    });
  };

  if (listCV.length === 0) {
    return (
      <div className="border border-dashed border-[#DEDEDE] rounded-[12px] bg-[#FAFAFA] py-[48px] px-[20px] text-center">
        <div className="font-[700] text-[20px] text-[#121212] mb-[8px]">
          Chưa có CV ứng tuyển nào
        </div>
        <div className="font-[400] text-[16px] text-[#6B7280]">
          Khi có ứng viên nộp CV cho công việc của bạn, danh sách sẽ hiển thị tại đây.
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(listCV.length / ITEMS_PER_PAGE);
  const currentList = listCV
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    .map((item) => ({
      ...item,
      jobPosition: positionList.find((itemPos) => itemPos.value == item.jobPosition)?.label ?? item.jobPosition,
      jobWorkingForm:
        workingFormList.find((itemWork) => itemWork.value == item.jobWorkingForm)?.label ?? item.jobWorkingForm,
    }));

  const handlePageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(Number(event.target.value));
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {currentList.map((item) => (
          <CVItem key={item.id} item={item} onDeleteSuccess={handleDeleteSuccess} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-[30px]">
          <select
            value={currentPage}
            onChange={handlePageChange}
            className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                Trang {index + 1}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};
