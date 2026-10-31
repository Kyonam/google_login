"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-context";

export function UserNav() {
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleOpenLoginPopup = (e: React.MouseEvent) => {
    e.preventDefault();
    const width = 480;
    const height = 680;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "/auth",
      "google_login_popup",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no`
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      setIsOpen(true);
    } else {
      popup.focus();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginLoading(true);
      setErrorMsg(null);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("로그인 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // 사용자 정보 추출
  const userMetadata = user?.user_metadata;
  const avatarUrl = userMetadata?.avatar_url || userMetadata?.picture;
  const fullName = userMetadata?.full_name || userMetadata?.name || user?.email?.split("@")[0] || "사용자";
  const userEmail = user?.email || "";

  return (
    <>
      <nav className="fixed top-6 right-6 sm:top-8 sm:right-10 z-40">
        {authLoading ? (
          <div className="w-9 h-9 rounded-full bg-zinc-100 animate-pulse border border-zinc-200" />
        ) : isAuthenticated && user ? (
          /* 로그인 상태: 사용자 프로필 아바타 & 호버 시 Sign out 팝오버 */
          <div className="group relative inline-block">
            {/* 프로필 아바타 버튼 */}
            <button
              type="button"
              className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-zinc-200 hover:border-zinc-400 bg-zinc-100 transition-all shadow-xs overflow-hidden focus:outline-none cursor-pointer"
              aria-label="사용자 프로필 메뉴"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-medium text-sm">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {/* 호버 시 아래로 부드럽게 나타나는 팝오버 */}
            <div className="absolute right-0 top-full pt-2.5 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
              <div className="w-64 rounded-2xl bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-zinc-200/90 text-zinc-900 backdrop-blur-md">
                {/* 사용자 정보 영역 */}
                <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
                  <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden border border-zinc-200 bg-zinc-100">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={fullName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white font-semibold">
                        {fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-zinc-900 truncate">
                      {fullName}
                    </span>
                    <span className="text-xs text-zinc-500 truncate" title={userEmail}>
                      {userEmail}
                    </span>
                  </div>
                </div>

                {/* 하단 Sign out 버튼 */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 비로그인 상태: 로그인 링크 */
          <a
            href="/auth"
            role="button"
            onClick={handleOpenLoginPopup}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-zinc-700 hover:text-black bg-white/70 hover:bg-white/90 backdrop-blur-md rounded-lg border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all active:scale-95 cursor-pointer"
          >
            로그인
          </a>
        )}
      </nav>

      {/* 비로그인 시 팝업 차단 또는 직접 모달 열기용 오버레이 */}
      {isOpen && !isAuthenticated && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-[420px] rounded-2xl bg-white p-7 shadow-2xl border border-zinc-200/90 text-zinc-900 transition-all flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200/90 bg-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs font-medium tracking-wider text-slate-600 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
              <span>Google 간편 시작</span>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-black">
                간편하게 시작하기
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
                Google 계정 하나로 로그인과 회원가입이 한 번에 완료됩니다.
              </p>
            </div>

            {errorMsg && (
              <div className="w-full mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs leading-relaxed border border-red-200 text-center">
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loginLoading}
              className="group w-full h-12 flex items-center justify-center gap-3 px-4 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-sm font-semibold text-zinc-800 shadow-xs hover:border-zinc-400 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-zinc-700 group-hover:text-black">
                {loginLoading ? "Google 로그인 중..." : "Google 계정으로 계속하기"}
              </span>
            </button>

            <p className="mt-5 text-center text-xs text-slate-400 leading-relaxed">
              계속 진행하면 서비스의 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export const LoginNav = UserNav;
export default UserNav;
