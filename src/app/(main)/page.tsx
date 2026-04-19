"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Main from "@public/images/mainback.svg";
import A from "@public/images/a.svg";
import B from "@public/images/b.svg";
import ContentContainer from "@/containers/main/ContentContainer";
import NoticeContainer from "@/containers/main/NoticeContainer";
import HomeBanner from "@/containers/main/HomeBanner";
import TimeLine from "@/containers/main/TimeLine";
import { getFirebaseDb } from "@/lib/firebase";

type IntroConfig = {
  highlightWord: string;
  description: string;
};

type ThemeConfig = {
  primaryColor: string;
};

const defaultIntro: IntroConfig = {
  highlightWord: "협회",
  description: "사단법인 디지털과포용성네트워크는\n모든 사회 구성원이 디지털 환경 속에서 소외되지 않고 함께 성장할 수 있는 포용적 디지털 사회를 지향합니다.\n우리는 다양성 존중, 디지털 접근성 향상, 사회적 장벽 해소를 핵심 가치로 삼고 있으며,\n이를 실현하기 위해\n교육 프로그램 개발, 정책 연구, 전문가 네트워킹, 인식 개선 활동 등을 활발히 수행하고 있습니다.",
};

const defaultTheme: ThemeConfig = {
  primaryColor: "#FF961F",
};

export default function Home() {
  const [intro, setIntro] = useState<IntroConfig>(defaultIntro);
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const db = await getFirebaseDb();
        if (!db) return;

        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "siteConfig", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.intro) setIntro({ ...defaultIntro, ...data.intro });
          if (data.theme) setTheme({ ...defaultTheme, ...data.theme });
        }
      } catch (e) {
        console.error("사이트 설정 로드 실패:", e);
      }
    };
    loadConfig();
  }, []);

  return (
    <div>
      <ContentContainer className="min-h-[30rem] md:min-h-[45rem]">
        <Image src={Main} alt={"background"} className="absolute top-[-20px] z-0 left-0" />
        <HomeBanner />
      </ContentContainer>
      <NoticeContainer />
      <ContentContainer className="flex flex-col items-center">
        <div className="w-full max-w-4xl z-10">
          <p className="text-3xl md:text-5xl font-black mb-12 text-center leading-tight">
            <span style={{ color: theme.primaryColor }}>{intro.highlightWord}</span> 소개
          </p>

          <div className="relative p-10 md:p-16 z-10">
            <Image src={A} alt="" className="absolute top-0 left-0 w-20 md:w-28 h-auto" />
            <Image src={B} alt="" className="absolute bottom-0 right-0 w-20 md:w-28 h-auto" />
            <div className="flex flex-col gap-4">
              {intro.description.split('\n').map((line, i) => (
                <p key={i} className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed break-keep">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </ContentContainer>
      <ContentContainer>
        <TimeLine />
      </ContentContainer>
    </div>
  );
}