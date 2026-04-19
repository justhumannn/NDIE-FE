import Image from "next/image";
import Logo from "@public/images/logo.svg"
import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#1A1A1A] text-gray-400 border-t border-gray-800">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-3 gap-6 px-6 pt-6 pb-4">

        {/* 기관 정보 + 약관 + 저작권 */}
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-300 font-semibold">
            <span>대표이사 이성철</span>
            <span>사무총장 박영민</span>
          </div>
          <p className="text-gray-500">부산광역시 동래구 온천천로471번가길 40</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {["국세청", "국민권익위원회", "서울시교육청"].map((label) => (
              <button
                key={label}
                className="px-2 py-0.5 text-xs text-gray-500 border border-gray-700 rounded hover:text-white hover:border-gray-400 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
          <ul className="flex gap-4 text-gray-400 mt-2">
            <li className="hover:text-white cursor-pointer transition-colors">이용약관</li>
            <li className="font-bold text-white cursor-pointer">개인정보처리방침</li>
          </ul>
          <div className="text-gray-600 space-y-0.5">
            <p className="text-[10px]">사단법인 디지털과포용성네트워크 (NDIE)</p>
            <p>© 2024 NDIE. All rights reserved.</p>
          </div>
        </div>

        {/* 빈 칸 */}
        <div />

        {/* 로고 + 네비 */}
        <div className="flex flex-col items-end gap-3">
          <Image src={Logo} alt="NDIE Logo" className="h-auto w-24 brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" />
          <ul className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-xs text-gray-500">
            <li className="hover:text-white cursor-pointer transition-colors">연구</li>
            <li className="hover:text-white cursor-pointer transition-colors">교육</li>
            <li className="hover:text-white cursor-pointer transition-colors">소통</li>
            <li className="hover:text-white cursor-pointer transition-colors">회비/후원</li>
          </ul>
        </div>

      </div>
    </footer>
  );
};
