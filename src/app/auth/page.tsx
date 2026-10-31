"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-context";

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 이미 로그인된 경우 메인 페이지로 이동
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 overflow-hidden bg-white select-none">
      {/* 메인 페이지와 동일한 은은한 격자 배경 마스크 */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-50 h-[600px] w-full 
        bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] 
        bg-[size:4.5rem_3.5rem] 
        [mask-image:radial-gradient(ellipse_75%_50%_at_50%_25%,#000_50%,transparent_100%)]"
      />

      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* 상단 뱃지 */}
        <div className="mb-6 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200/90 bg-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-sm text-xs font-medium tracking-wider text-slate-600 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
          <span>Google 간편 시작</span>
        </div>

        {/* 헤드라인 타이틀 */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black text-center leading-tight mb-3">
          간편하게 시작하기
        </h1>

        {/* 서브타이틀 */}
        <p className="text-slate-500 text-sm sm:text-base text-center leading-relaxed mb-8 max-w-sm">
          Google 계정으로 빠르고 안전하게 시작하세요.
          <br />
          별도의 회원가입 절차 없이 즉시 이용할 수 있습니다.
        </p>

        {/* 로그인 카드 컨테이너 */}
        <div className="w-full rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/90 p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col items-center">
          {errorMsg && (
            <div className="w-full mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs leading-relaxed border border-red-200 text-center">
              {errorMsg}
            </div>
          )}

          {/* Google 로그인 버튼 */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || authLoading}
            className="group w-full h-12 flex items-center justify-center gap-3 px-5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-sm font-semibold text-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-zinc-400 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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
              {loading ? "Google 로그인 중..." : "Google 계정으로 계속하기"}
            </span>
          </button>

          <p className="mt-5 text-center text-xs text-slate-400 leading-relaxed">
            계속 진행하면 서비스의 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </div>
      </div>

      {/* 하단 지평선 호 곡선 */}
      <div
        className="pointer-events-none absolute left-1/2 bottom-[-420px] sm:bottom-[-460px] 
        h-[520px] sm:h-[600px] w-[140%] sm:w-[120%] 
        -translate-x-1/2 rounded-[100%] 
        bg-[radial-gradient(closest-side_at_50%_45%,#ffffff_76%,#18181b_93%,#000000_100%)] 
        shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
      />
    </main>
  );
}
