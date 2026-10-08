/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCityName } from "@/utils/city";
import { FilterSelect } from "@/app/components/form/FilterSelect";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6"

const cityPriority = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];

const getCityPriority = (name: string) => {
  const index = cityPriority.indexOf(formatCityName(name));
  return index === -1 ? cityPriority.length : index;
};

export const Section1 = () => {
  const router = useRouter();
  const [cityList, setCityList] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [cityLoadError, setCityLoadError] = useState(false);
  const [cityLoadAttempt, setCityLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCityLoadError(false);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/list`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("City list failed");
        return res.json();
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        if (data.code === "success") {
          setCityList([...(data.cityList || [])].sort(
            (a, b) => getCityPriority(a.name) - getCityPriority(b.name)
          ));
        } else throw new Error("City list failed");
      })
      .catch(() => {
        if (!controller.signal.aborted) setCityLoadError(true);
      });
    return () => controller.abort();
  }, [cityLoadAttempt]);

  const handleSearch = (event: any) => {
    event.preventDefault();
    const city = event.target.city.value;
    const keyword = event.target.keyword.value;
    const params = new URLSearchParams();

    if (city) {
      params.set("city", city);
    }

    if (keyword) {
      params.set("keyword", keyword);
    }

    router.push(`/search?${params.toString()}`);
  }

  return (
    <>
      <div className="bg-[#000065] py-[60px]">
        <div className="container mx-auto px-[16px]">
          <h1 className="text-white font-[700] text-[28px] text-center mb-[30px]">
            887 Việc làm IT cho Developer &quot;Chất&quot;
          </h1>
          <form 
            onSubmit={handleSearch}
            role="search"
            aria-label="Tìm kiếm việc làm IT"
            className="mb-[30px] grid grid-cols-1 gap-3 md:grid-cols-[240px_minmax(0,1fr)_200px] md:gap-4"
          >
            <FilterSelect id="home-search-city" name="city" label="Địa điểm" variant="home"
              value={selectedCity} onChange={setSelectedCity}
              options={[{ value: "", label: "Tất cả thành phố" }, ...cityList.map(city => ({ value: city.name, label: formatCityName(city.name) }))]} />
            <div className="min-w-0">
              <label htmlFor="home-search-keyword" className="sr-only">Vị trí hoặc kỹ năng</label>
              <input id="home-search-keyword" type="search" name="keyword" placeholder="Nhập từ khóa..." className="h-14 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-5 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300" />
            </div>
            <button type="submit" className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-[#0070d8] px-5 text-base font-semibold text-white transition-colors hover:bg-[#0061bd] active:bg-[#0056a8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 motion-reduce:transition-none">
              <FaMagnifyingGlass aria-hidden="true" className="text-lg" /> Tìm kiếm
            </button>
          </form>
          {cityLoadError && <p role="alert" className="mb-5 text-sm text-white">
            Chưa tải được danh sách thành phố.
            <button type="button" onClick={() => setCityLoadAttempt(attempt => attempt + 1)} className="ml-2 rounded px-1 font-medium underline underline-offset-4 hover:text-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300">Thử lại</button>
          </p>}
          <div className="flex flex-col md:flex-row md:items-start gap-x-[12px] gap-y-[15px]">
            <div className="text-[#DEDEDE] font-[500] text-[16px] shrink-0 pt-[8px]">
              Mọi người đang tìm kiếm:
            </div>
            <div className="flex flex-wrap gap-[10px] flex-1">
              <Link href="/search?language=Java" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                Java
              </Link>
              <Link href="/search?language=ReactJS" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                ReactJS
              </Link>
              <Link href="/search?language=.NET" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                .NET
              </Link>
              <Link href="/search?keyword=Tester" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                Tester
              </Link>
              <Link href="/search?language=PHP" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                PHP
              </Link>
              <Link href="/search?keyword=Business%20Analysis" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                Business Analysis
              </Link>
              <Link href="/search?language=Javascript" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                Javascript
              </Link>
              <Link href="/search?language=NodeJS" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                NodeJS
              </Link>
              <Link href="/search?keyword=Team%20Management" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                Team Management
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
