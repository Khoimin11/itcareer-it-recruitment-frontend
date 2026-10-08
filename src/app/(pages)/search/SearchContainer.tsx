/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { CardJobItem } from "@/app/components/card/CardJobItem"
import { FilterSelect } from "@/app/components/form/FilterSelect";
import { positionList, workingFormList } from "@/config/variable";
import { formatCityName } from "@/utils/city";
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { FaBriefcase, FaRotateLeft, FaSliders, FaUserTie, FaXmark } from "react-icons/fa6";

export const SearchContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const language = searchParams.get("language") || "";
  const city = searchParams.get("city") || "";
  const company = searchParams.get("company") || "";
  const keyword = searchParams.get("keyword") || "";
  const position = searchParams.get("position") || "";
  const workingForm = searchParams.get("workingForm") || "";
  const [jobList, setJobList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchError, setSearchError] = useState(false);
  const activeFilterCount = Number(Boolean(position)) + Number(Boolean(workingForm));
  const cityLabel = formatCityName(city);
  const keywordLabel = [language, cityLabel, company, keyword].filter(Boolean).join(" ");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ language, city, company, keyword, position, workingForm, page: String(page) });
    setIsLoading(true);
    setSearchError(false);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?${params.toString()}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      })
      .then(data => {
        if (controller.signal.aborted) return;
        if(data.code == "success") {
          setJobList(data.jobs);
          setTotalPage(data.totalPage);
          setTotalRecord(data.totalRecord);
        } else throw new Error("Search failed");
      })
      .catch(() => {
        if (!controller.signal.aborted) setSearchError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [language, city, company, keyword, position, workingForm, page]);

  useEffect(() => {
    setPage(1);
  }, [language, city, company, keyword, position, workingForm]);

  const updateFilters = (changes: Partial<Record<"position" | "workingForm", string>>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setPage(1);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  }

  return (
    <>
      <div className="container mx-auto px-[16px]">
        <h2 className="font-[700] text-[28px] text-[#121212] mb-[30px]">
          {totalRecord} việc làm
          {keywordLabel && (
            <>
              : 
              <span className="text-[#0088FF] ml-[6px]">
                {keywordLabel}
              </span>
            </>
          )}
        </h2>
        
        <section aria-label="Bộ lọc việc làm" className="mb-[30px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
            <div className="flex items-center gap-3 lg:min-w-[160px] lg:self-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0070d8]"><FaSliders aria-hidden="true" /></span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Bộ lọc việc làm</h3>
                <p aria-live="polite" role="status" className="mt-1 text-xs text-slate-500">
                  {isLoading ? "Đang cập nhật…" : searchError ? "Chưa tải được kết quả" : activeFilterCount ? `${activeFilterCount} bộ lọc đang áp dụng` : "Tìm việc phù hợp với bạn"}
                </p>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
              <FilterSelect id="filter-position" label="Cấp bậc" value={position} icon={<FaUserTie />}
                options={[{ value: "", label: "Tất cả cấp bậc" }, ...positionList]}
                onChange={value => updateFilters({ position: value })} />
              <FilterSelect id="filter-working-form" label="Hình thức làm việc" value={workingForm} icon={<FaBriefcase />}
                options={[{ value: "", label: "Tất cả hình thức" }, ...workingFormList]}
                onChange={value => updateFilters({ workingForm: value })} />
            </div>
            <button type="button" disabled={!activeFilterCount} onClick={() => updateFilters({ position: "", workingForm: "" })}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070d8] disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent motion-reduce:transition-none">
              <FaRotateLeft aria-hidden="true" className="text-xs" /> Xóa bộ lọc
            </button>
          </div>
          {activeFilterCount > 0 && <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <span className="mr-1 text-xs text-slate-500">Đang chọn:</span>
            {position && <button type="button" aria-label="Bỏ lọc cấp bậc" onClick={() => updateFilters({ position: "" })} className="inline-flex min-h-[36px] items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 text-xs font-medium text-[#005eb8] hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070d8]">
              {positionList.find(item => item.value === position)?.label || position}<FaXmark aria-hidden="true" />
            </button>}
            {workingForm && <button type="button" aria-label="Bỏ lọc hình thức làm việc" onClick={() => updateFilters({ workingForm: "" })} className="inline-flex min-h-[36px] items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 text-xs font-medium text-[#005eb8] hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070d8]">
              {workingFormList.find(item => item.value === workingForm)?.label || workingForm}<FaXmark aria-hidden="true" />
            </button>}
          </div>}
        </section>

        <div aria-busy={isLoading} className={`grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px] ${isLoading ? "opacity-60" : ""}`}>
          {jobList.map(item => (
            <CardJobItem key={item.id} item={item} />
          ))}
        </div>

        {searchError && <p role="alert" className="mb-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">Không tải được kết quả tìm kiếm. Vui lòng tải lại trang để thử lại.</p>}
        {!isLoading && !searchError && totalRecord === 0 && (
          <div className="rounded-[8px] bg-white px-[20px] py-[24px] text-[16px] text-[#414042]">
            Không tìm thấy công việc phù hợp với bộ lọc hiện tại.
          </div>
        )}

        {totalPage > 0 && (
        <div className="mt-[30px]">
          <select 
            name="" 
            className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
            onChange={handlePagination}
            value={page}
          >
            {Array(totalPage).fill("").map((item, index) => (
              <option key={index} value={index+1}>Trang {index+1}</option>
            ))}
          </select>
        </div>
      )}

      </div>
    </>
  )
}
