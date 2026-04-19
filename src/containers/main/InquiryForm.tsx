'use client'
import React, { useState } from 'react';

type InquiryFormState = {
  name: string;
  organization: string;
  email: string;
  selectedTag: string;
  content: string;
};

export default function InquiryForm() {
  const [formData, setFormData] = useState<InquiryFormState>({
    name: '',
    organization: '',
    email: '',
    selectedTag: '기타', // 기본값 설정
    content: '',
  });

  const tags = ['협업', '강의', '후원', '기타'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagClick = (tag: string) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedTag: tag,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { collection, addDoc } = await import("firebase/firestore");
      const { getFirebaseDb } = await import("@/lib/firebase");

      const db = await getFirebaseDb();
      if (!db) {
        alert("Firebase가 초기화되지 않았습니다.");
        return;
      }

      await addDoc(collection(db, "inquiries"), {
        ...formData,
        createdAt: new Date().toISOString()
      });

      alert('문의가 접수되었습니다.'); // 성공 메시지 표시
      // 폼 초기화
      setFormData({
        name: '',
        organization: '',
        email: '',
        selectedTag: '기타',
        content: '',
      });
    } catch (e) {
      console.error(e);
      alert('문의 전송 중 알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-8 md:p-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">문의하기</h1>
          <p className="text-gray-500 font-medium">궁금하신 점이나 협업 제안을 남겨주시면 빠르게 답변해 드리겠습니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* 왼쪽 섹션 */}
            <div className="space-y-8">
              <div className="group">
                <label htmlFor="name" className="block text-sm font-bold text-gray-400 mb-2 group-focus-within:text-orange-500 transition-colors uppercase tracking-widest">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="성함을 입력해주세요"
                  className="w-full py-4 border-b-2 border-gray-100 bg-transparent text-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-orange-500 transition-all"
                  required
                />
              </div>

              <div className="group">
                <label htmlFor="organization" className="block text-sm font-bold text-gray-400 mb-2 group-focus-within:text-orange-500 transition-colors uppercase tracking-widest">
                  단체 또는 기관명
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="소속을 입력해주세요"
                  className="w-full py-4 border-b-2 border-gray-100 bg-transparent text-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-bold text-gray-400 mb-2 group-focus-within:text-orange-500 transition-colors uppercase tracking-widest">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="회신받을 이메일 주소"
                  className="w-full py-4 border-b-2 border-gray-100 bg-transparent text-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* 오른쪽 섹션 */}
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">
                  문의 유형
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className={`px-6 py-2 rounded-full text-base font-bold transition-all duration-200 transform active:scale-95
                        ${formData.selectedTag === tag
                          ? 'bg-orange-500 text-white shadow-lg' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label htmlFor="content" className="block text-sm font-bold text-gray-400 mb-2 group-focus-within:text-orange-500 transition-colors uppercase tracking-widest">
                  내용
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="문의 내용을 상세히 적어주세요"
                  rows={6}
                  className="w-full p-6 bg-gray-50 border-none rounded-[2rem] text-lg text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="group relative w-full md:w-auto px-16 py-6 bg-[#FFA037] text-white text-xl font-black rounded-2xl hover:bg-[#e88f2d] transition-all duration-300 transform hover:translate-y-[-4px] active:translate-y-0"
            >
              <span className="flex items-center justify-center">
                문의 보내기
                <svg className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}