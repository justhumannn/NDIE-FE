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
    selectedTag: '기타',
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

      alert('문의가 접수되었습니다.');
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
    <div className="relative w-full min-h-screen flex flex-col items-center bg-[#F8F8F8] px-4 md:px-40 pt-10">
      <div className="w-full max-w-6xl px-8 py-12 bg-white rounded-2xl shadow-sm mt-8">
        <h1 className="text-4xl font-bold mb-16 text-gray-800">문의하기</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-20 gap-y-12 w-full">
          <div className="flex flex-col gap-10">
            <div>
              <label htmlFor="name" className="block text-xl font-medium text-gray-800 mb-4">
                이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력해주세요"
                className="w-full pb-3 border-b border-gray-300 bg-transparent text-xl text-gray-700 placeholder-gray-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-xl font-medium text-gray-800 mb-4">
                단체 또는 기관명
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="단체 또는 기관명을 입력해주세요"
                className="w-full pb-3 border-b border-gray-300 bg-transparent text-xl text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xl font-medium text-gray-800 mb-4">
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="보내는 분의 이메일을 입력해주세요"
                className="w-full pb-3 border-b border-gray-300 bg-transparent text-xl text-gray-700 placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <div>
              <label className="block text-xl font-medium text-gray-800 mb-4">
                태그
              </label>
              <div className="flex space-x-3">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-200
                      ${formData.selectedTag === tag
                        ? 'border border-gray-400 text-gray-800 bg-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-xl font-medium text-gray-800 mb-4">
                내용
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="문의할 내용을 입력해주세요"
                rows={10}
                className="w-full p-4 border border-gray-300 rounded-md bg-transparent text-xl text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
                required
              ></textarea>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-white text-orange-500 border border-orange-500 text-xl font-semibold rounded-md shadow-sm hover:bg-orange-500 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center"
            >
              <svg className="w-6 h-6 mr-3 -ml-1 transform rotate-45" fill="currentColor" viewBox="0 0 20 20" style={{ transformOrigin: 'center' }}>
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l.64-.213a1 1 0 00.108-.146l.75-1.5a1 1 0 00.08-.094l5-5a1 1 0 011.414 0l5 5a1 1 0 00.08.094l.75 1.5a1 1 0 00.108.146l.64.213a1 1 0 001.169-1.409l-7-14z"></path>
              </svg>
              발송
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}