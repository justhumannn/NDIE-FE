'use client'
import React, { useState, useEffect } from "react";
import { getFirebaseDb } from "@/lib/firebase";

type TimelineEntry = {
  date: string;
  title: string;
  description: string;
  type: "filled" | "outlined";
};

type TimelineData = {
  [year: string]: TimelineEntry[];
};

const defaultData: TimelineData = {
  "2024": [
    { date: "03.12", title: "연혁1", description: "연혁1 내용들", type: "filled" },
    { date: "03.12", title: "연혁2", description: "연혁2 내용들", type: "outlined" }
  ],
  "2025": [
    { date: "01.01", title: "계획1", description: "2025년 내용 예정입니다.", type: "outlined" }
  ]
};

export default function NDIETimeline() {
  const [timelineData, setTimelineData] = useState<TimelineData>(defaultData);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const db = await getFirebaseDb();
        if (!db) return;

        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "history", "timeline");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as TimelineData;
          setTimelineData(data);
          const years = Object.keys(data).sort();
          if (years.length > 0) setSelectedYear(years[0]);
        }
      } catch (e) {
        console.error("연혁 로드 실패:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const years = Object.keys(timelineData).sort();
  const entries = timelineData[selectedYear] || [];

  return (
    <div className="text-black font-sans relative pl-8 md:pl-0">
      <h1 className="text-2xl font-bold mb-12 text-center md:text-left">
        엔디(<span className="text-[#FFA037] font-bold">NDIE</span>)의{" "}
        <span className="text-[#FFA037] font-bold">연혁</span>은 다음과 같습니다
      </h1>

      <div className="flex items-center gap-2 md:gap-6 text-xl mb-8 md:mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
        {years.map((year, index) => (
          <React.Fragment key={year}>
            <button
              className={`font-bold transition-all duration-300 cursor-pointer relative pb-2 px-1 group ${
                selectedYear === year
                  ? "text-black scale-110"
                  : "text-gray-400 hover:text-gray-700"
              }`}
              onClick={() => setSelectedYear(year)}
            >
              <span className="flex items-center gap-1">
                {selectedYear === year && (
                  <span className="text-[#FFA037] text-sm">▶</span>
                )}
                {year}
              </span>
              <div
                className={`absolute bottom-0 left-0 h-[3px] bg-[#FFA037] rounded-full transition-all duration-300 ${
                  selectedYear === year ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
            {index < years.length - 1 && (
              <div className="w-6 md:w-10 h-px bg-gray-200" />
            )}
          </React.Fragment>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#FFA037] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="relative pl-10">
          <div className="absolute left-9 top-2 bottom-0 w-[2px] bg-gray-200 z-0" />
          <div className="absolute -left-10 top-1 text-lg font-bold bg-[#F8F8F8] px-1 z-10 text-[#FFA037]">
            {selectedYear}
          </div>
          {entries.map((entry, index) => (
            <div key={index} className="relative mb-10 pl-6 z-10 group">
              <div
                className={`absolute left-[-0.65rem] top-[0.45rem] w-3.5 h-3.5 rounded-full transition-transform duration-200 group-hover:scale-125 ${
                  entry.type === "filled"
                    ? "bg-[#FFA037]"
                    : "border-2 border-[#FFA037] bg-white"
                }`}
              />
              <div className="text-[17px] font-bold mb-1 group-hover:text-[#FFA037] transition-colors duration-200">
                {entry.date} {entry.title}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
