/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import JustValidate from "just-validate";
import { useRouter } from "next/navigation";

export const FormRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validator = new JustValidate("#registerForm");

    validator
      .addField('#companyName', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập tên công ty!'
        },
        {
          rule: 'maxLength',
          value: 200,
          errorMessage: 'Tên công ty không được vượt quá 200 ký tự!',
        },
      ])
      .addField('#email', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập email!',
        },
        {
          rule: 'email',
          errorMessage: 'Email không đúng định dạng!',
        },
      ])
      .addField('#password', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập mật khẩu!',
        },
        {
          validator: (value: string) => value.length >= 8,
          errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
        },
        {
          validator: (value: string) => /[A-Z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
        },
        {
          validator: (value: string) => /[a-z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
        },
        {
          validator: (value: string) => /\d/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
        },
        {
          validator: (value: string) => /[@$!%*?&]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
        },
      ])
      .addField('#confirmPassword', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập lại mật khẩu!',
        },
        {
          validator: (value: string) => value === document.querySelector<HTMLInputElement>('#password')?.value,
          errorMessage: 'Mật khẩu xác nhận không khớp!',
        },
      ])
      .onSuccess((event: any) => {
        const companyName = event.target.companyName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const dataFinal = {
          companyName: companyName,
          email: email,
          password: password
        };
  
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
        })
          .then(res => res.json())
          .then(data => {
            if(data.code == "error") {
              alert(data.message);
            }
  
            if(data.code == "success") {
              router.push("/company/login");
            }
          })
      });
    return () => validator.destroy();
  }, [router]);

  return (
    <>
      <form id="registerForm" action="" className="grid grid-cols-1 gap-y-[15px]">
        <div className="">
          <label htmlFor="companyName" className="block font-[500] text-[14px] text-black mb-[5px]">
            Tên công ty *
          </label>
          <input 
            type="text" 
            name="companyName" 
            id="companyName" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mật khẩu *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="new-password"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] pl-[20px] pr-[52px] font-[500] text-[14px] text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(value => !value)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              aria-pressed={showPassword}
              aria-controls="password"
              title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-[4px] top-0 flex h-[46px] w-[44px] items-center justify-center rounded-[4px] text-gray-500 hover:text-[#0088FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0088FF]"
            >
              {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>
        </div>
        <div className="">
          <label htmlFor="confirmPassword" className="block font-[500] text-[14px] text-black mb-[5px]">
            Xác nhận mật khẩu *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              autoComplete="new-password"
              aria-required="true"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] pl-[20px] pr-[52px] font-[500] text-[14px] text-black"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(value => !value)}
              aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
              aria-pressed={showConfirmPassword}
              aria-controls="confirmPassword"
              title={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
              className="absolute right-[4px] top-0 flex h-[46px] w-[44px] items-center justify-center rounded-[4px] text-gray-500 hover:text-[#0088FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0088FF]"
            >
              {showConfirmPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>
        </div>
        <div className="">
          <button type="submit" className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng ký
          </button>
        </div>
      </form>
    </>
  )
}
