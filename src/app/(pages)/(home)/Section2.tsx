/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CardCompanyItem } from "@/app/components/card/CardCompanyItem";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./employers.css";

export const Section2 = () => {
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = grid.querySelectorAll<HTMLElement>(".employer-reveal");
    grid.classList.add("employers-animated");
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });
    cards.forEach(card => observer.observe(card));
    return () => { observer.disconnect(); grid.classList.remove("employers-animated"); };
  }, [companyList]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=9`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setCompanyList(data.companyList || []);
          setHasError(false);
        } else {
          setHasError(true);
        }

        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="py-[60px]">
      <div className="container mx-auto px-[16px]">
        <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] text-center mb-[30px]">
          Nhà tuyển dụng hàng đầu
        </h2>

        {isLoading ? (
          <div className="rounded-[8px] bg-white px-[20px] py-[24px] text-[16px] text-[#414042] text-center">
            Đang tải danh sách nhà tuyển dụng...
          </div>
        ) : hasError ? (
          <div className="rounded-[8px] bg-white px-[20px] py-[24px] text-[16px] text-[#414042] text-center">
            Không thể tải danh sách nhà tuyển dụng lúc này.
          </div>
        ) : companyList.length === 0 ? (
          <div className="rounded-[8px] bg-white px-[20px] py-[24px] text-[16px] text-[#414042] text-center">
            Chưa có nhà tuyển dụng nào để hiển thị.
          </div>
        ) : (
          <div ref={gridRef} className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
            {companyList.map((item, index) => (
              <div key={item.id} className="employer-reveal" style={{ "--employer-delay": `${(index % 3) * 90}ms` } as CSSProperties}>
                <CardCompanyItem item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
