import React from "react";
import InquiryForm from "@/containers/main/InquiryForm";
import ContentContainer from "@/containers/main/ContentContainer";

export default function InquiryPage() {
  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <div className="py-20">
        <h1 className="text-4xl md:text-5xl font-black text-center mb-4">문의하기</h1>
        <p className="text-center text-gray-500 mb-12">디포네와 함께하고 싶은 모든 분들을 환영합니다.</p>
        <InquiryForm />
      </div>
    </div>
  );
}
