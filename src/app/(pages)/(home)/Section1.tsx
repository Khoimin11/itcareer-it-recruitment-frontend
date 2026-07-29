/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6"

export const Section1 = () => {
  const router = useRouter();
  const [cityList, setCityList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/list`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setCityList(data.cityList || []);
        }
      });
  }, []);

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
            action="" 
            className="flex flex-wrap gap-x-[15px] gap-y-[12px] mb-[30px]"
          >
            <select name="city" className="bg-white md:w-[240px] w-[100%] h-[56px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212]">
              <option value="">Tất cả thành phố</option>
              {cityList.map((city) => (
                <option key={city._id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <input type="text" name="keyword" placeholder="Nhập từ khóa..." className="md:flex-1 flex-none w-[100%] bg-white h-[56px] rounded-[4px] px-[20px] font-[500] text-[16px]" />
            <button className="bg-[#0088FF] md:w-[240px] w-[100%] h-[56px] rounded-[4px] font-[500] text-[16px] text-white inline-flex items-center justify-center">
              <FaMagnifyingGlass className="text-[20px] mr-[10px]" /> Tìm Kiếm
            </button>
          </form>
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
