"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function Signup() {
  const router = useRouter();
  const { uid, isInitialized } = useAuthStore();
  const isProcessing = useRef(false);

  const next = () => {
    router.push("/signupagree");
  };

  // 이미 로그인되어 있으면 홈으로
  useEffect(() => {
    if (isInitialized && uid) {
      router.replace("/");
    }
  }, [isInitialized, uid, router]);

  const applyUserSession = async (user: { uid: string; displayName?: string | null; email?: string | null }) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const { doc, getDoc, setDoc } = await import("firebase/firestore");
      const { getFirebaseDb } = await import("@/lib/firebase");

      const db = await getFirebaseDb();
      if (!db) throw new Error("Firestore not initialized");

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "Google 사용자",
          email: user.email || "",
          role: "USER",
          createdAt: new Date().toISOString(),
        });
      }

      // AuthProvider가 onAuthStateChanged로 자동 처리
      router.replace("/");
    } catch (error) {
      console.error("세션 적용 중 오류:", error);
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { getFirebaseAuth } = await import("@/lib/firebase");
        const { getRedirectResult } = await import("firebase/auth");

        const auth = await getFirebaseAuth();
        if (!auth) return;

        // Google redirect 로그인 처리
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult?.user) {
          await applyUserSession(redirectResult.user);
        }
      } catch (error: unknown) {
        const err = error as { code?: string };
        console.error("인증 확인 중 오류:", error);
        if (err?.code === "auth/invalid-credential") {
          const { getFirebaseAuth } = await import("@/lib/firebase");
          const { signOut } = await import("firebase/auth");
          const auth = await getFirebaseAuth();
          if (auth) await signOut(auth);
          alert("구글 인증 정보를 확인할 수 없습니다.");
        }
        isProcessing.current = false;
      }
    };
    checkAuthAndRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { GoogleAuthProvider, signInWithRedirect, setPersistence, browserLocalPersistence } = await import("firebase/auth");
      const { getFirebaseAuth } = await import("@/lib/firebase");

      const auth = await getFirebaseAuth();
      if (!auth) {
        alert("Firebase 인증이 초기화되지 않았습니다.");
        return;
      }

      await setPersistence(auth, browserLocalPersistence);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      await signInWithRedirect(auth, provider);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.error(err);
      let message = err?.message || "구글 로그인 중 오류가 발생했습니다.";
      if (err?.code === "auth/popup-blocked") {
        message = "팝업이 차단되었습니다.";
      }
      alert(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center bg-[#F8F9FA] px-4 py-20">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-500 font-medium">디포네와 함께 시작해보세요.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="group relative flex w-full py-4 items-center justify-center bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
          >
            <span className="absolute left-5 w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#4285F4] text-xl">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </span>
            Google로 시작하기
          </button>

          <button
            onClick={next}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            이메일로 회원가입
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-sm text-gray-400 mb-4">도움이 필요하신가요?</p>
          <button
            onClick={() => {
              window.location.href =
                "https://observant-agreement-17f.notion.site/20abd5ffe3fa805ca553d136e71891a3?source=copy_link";
            }}
            className="inline-flex items-center text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            <span>회원가입 방법 알아보기</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
