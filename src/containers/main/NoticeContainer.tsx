'use client'

import React, { useEffect, useState } from "react";
import { getAnnouncement } from "@/service/announcement";

type Notice = {
  title: string;
  createdAt: string;
  content: string;
};

export default function NoticeContainer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const baseStyle = "w-12 md:w-[7.5rem] flex items-center justify-center text-gray-500";

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getAnnouncement();
        setNotices(data);
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
      }
    };
    fetchNotices();
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (notices.length === 0) return;

    const interval = setInterval(() => {
      handleSlide("next");
    }, 7500);

    return () => clearInterval(interval);
  }, [notices, currentIndex]);

  const handleSlide = (direction: "prev" | "next") => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (direction === "next") {
          return prevIndex < notices.length - 1 ? prevIndex + 1 : 0;
        } else {
          return prevIndex > 0 ? prevIndex - 1 : notices.length - 1;
        }
      });
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="relative mx-auto max-w-7xl my-10 px-4">
      <div className="relative h-[11.25rem] w-full overflow-hidden rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-[#EAEAEA] bg-white">
        <button
          className={`${baseStyle} absolute left-0 top-0 h-full border-r border-[#EAEAEA] text-xl z-10 disabled:text-gray-200 bg-white hover:bg-gray-50 transition-colors`}
          onClick={() => handleSlide("prev")}
          disabled={isAnimating}
        >
          <span className="transform hover:scale-125 transition-transform inline-block">◀</span>
        </button>
        <div className="w-full h-full overflow-hidden px-14 md:px-[7.5rem]">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{
              width: `${notices.length * 100}%`,
              transform: `translateX(-${(100 / notices.length) * currentIndex}%)`,
            }}
          >
            {Array.isArray(notices) && notices.map((notice, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 p-8 flex flex-col justify-center"
                style={{ width: `${100 / notices.length}%` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-orange-100 text-[#FFA037] text-[10px] font-bold rounded-full">NOTICE</span>
                  <span className="text-xs text-gray-400">
                    {notice.createdAt.slice(0, 10).replaceAll("-", ".")}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 truncate mb-2 hover:text-[#FFA037] cursor-pointer transition-colors">
                  {notice.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </div>
        <button
          className={`${baseStyle} absolute right-0 top-0 h-full border-l border-[#EAEAEA] text-xl z-10 disabled:text-gray-200 bg-white hover:bg-gray-50 transition-colors`}
          onClick={() => handleSlide("next")}
          disabled={isAnimating}
        >
          <span className="transform hover:scale-125 transition-transform inline-block">▶</span>
        </button>
      </div>
    </div>
  );
}