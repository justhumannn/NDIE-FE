"use client";
import React, { useEffect, useState } from "react";
import { getFirebaseDb } from "@/lib/firebase";

type BannerConfig = {
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  descriptionKo: string;
  descriptionEn: string;
  highlightColor: string;
};

const defaultConfig: BannerConfig = {
  titlePrefix: "우리는",
  titleHighlight: "포용",
  titleSuffix: "해야합니다",
  descriptionKo: "대한민국은 여러 불평등 문제로 점점 갈라져가고 있습니다.\n우리 모두가 서로가 다름을 인정하고 더욱 따뜻한 마음으로 서로를 보듬어줘야합니다.",
  descriptionEn: "South Korea is becoming increasingly divided due to various inequalities.\nWe all need to acknowledge each other's differences and embrace each other with warmer hearts.",
  highlightColor: "#FF961F",
};

export default function HomeBanner() {
  const [config, setConfig] = useState<BannerConfig>(defaultConfig);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const db = await getFirebaseDb();
        if (!db) return;

        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "siteConfig", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().banner) {
          setConfig({ ...defaultConfig, ...docSnap.data().banner });
        }
      } catch (e) {
        console.error("배너 설정 로드 실패:", e);
      }
    };
    loadConfig();
  }, []);

  return (
    <div className={`absolute top-1/2 -translate-y-1/2 z-1 bg-white/60 backdrop-blur-sm min-h-[25rem] md:min-h-[35rem] left-4 right-4 md:left-[5rem] md:right-[5rem] lg:left-[10rem] lg:right-[10rem] 
                     rounded-3xl md:rounded-4xl flex flex-col justify-center items-center text-center px-6 overflow-hidden py-10 md:py-0 shadow-xl border border-white/20`}>
      <div className="z-10 w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <span className="text-gray-800 break-keep">{config.titlePrefix}</span>
          <span
            className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-none drop-shadow-md"
            style={{ color: config.highlightColor }}
          >
            {config.titleHighlight}
          </span>
          <span className="text-gray-800 break-keep">{config.titleSuffix}</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mt-6 whitespace-pre-line leading-relaxed font-medium">
          {config.descriptionKo}
        </p>
        <div className="mt-12 pt-8 border-t border-gray-200/50 text-sm sm:text-base text-black/80">
          <p className="font-bold text-lg italic">
            we must <span className="not-italic uppercase tracking-wider" style={{ color: config.highlightColor }}>embrace</span>
          </p>
          <p className="mt-2 text-gray-600 whitespace-pre-line leading-relaxed max-w-2xl mx-auto italic">
            {config.descriptionEn}
          </p>
        </div>
      </div>
    </div>
  );
}
