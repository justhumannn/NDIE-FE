"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "@public/images/logo.svg";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

export const Header = () => {
  const { uid, role, isLoading, isInitialized } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { signOut } = await import("firebase/auth");
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const auth = await getFirebaseAuth();
      if (auth) await signOut(auth);
    } catch (e) {
      console.error("로그아웃 오류:", e);
    }
  };

  const isLoggedIn = !!uid;
  const isAdmin = role === "ADMIN";
  const showLoading = !isInitialized || isLoading;

  const navLinks = [
    { href: "/", label: "홈" },
    { href: "/act", label: "활동" },
    { href: "/qna", label: "QnA" },
    { href: "/announcement", label: "공지사항" },
    { href: "/inquiry", label: "문의하기" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const logoutAndClose = async () => {
    closeMenu();
    await handleLogout();
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src={Logo} alt="Logo" className="h-10 w-auto" />
            <p className="text-xl font-semibold text-black">NDIE</p>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 text-sm md:flex lg:gap-12">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-orange-500">
              {label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link href="/write" className="hover:text-orange-500">
              게시물 작성
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-orange-500 font-semibold">
              관리자
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          {showLoading ? (
            <span className="text-gray-400">로딩중...</span>
          ) : isLoggedIn ? (
            <button onClick={handleLogout} className="cursor-pointer text-sm font-medium">
              로그아웃
            </button>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:text-orange-500">
                로그인
              </Link>
              <Link href="/signup" className="text-sm hover:text-orange-500">
                회원가입
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 md:hidden"
          aria-label="메뉴 열기"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">메뉴</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-black" />
            <span className="block h-0.5 w-5 bg-black" />
            <span className="block h-0.5 w-5 bg-black" />
          </div>
        </button>
      </div>

      <div
        className={`md:hidden ${isMenuOpen ? "flex" : "hidden"} flex-col gap-4 border-t border-[#EAEAEA] bg-white px-4 py-4 shadow-sm`}
      >
        <nav className="flex flex-col gap-3 text-sm">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="py-1"
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link href="/write" className="py-1" onClick={closeMenu}>
              게시물 작성
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="py-1 font-semibold text-orange-500" onClick={closeMenu}>
              관리자
            </Link>
          )}
        </nav>
        <div className="border-t border-[#EAEAEA] pt-3">
          {showLoading ? (
            <span className="text-gray-400">로딩중...</span>
          ) : isLoggedIn ? (
            <button onClick={logoutAndClose} className="text-sm font-medium">
              로그아웃
            </button>
          ) : (
            <div className="flex gap-4 text-sm">
              <Link href="/login" onClick={closeMenu}>
                로그인
              </Link>
              <Link href="/signup" onClick={closeMenu}>
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
