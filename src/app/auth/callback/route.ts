import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>인증 완료</title>
          </head>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff;">
            <script>
              if (window.opener) {
                try {
                  window.opener.postMessage({ type: 'AUTH_SUCCESS' }, window.location.origin);
                } catch (e) {}
                window.close();
              } else {
                window.location.href = "${origin}${next}";
              }
            </script>
            <p style="color: #666; font-size: 14px;">로그인 처리 중입니다. 잠시만 기다려 주세요...</p>
          </body>
        </html>`,
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        }
      );
    }
  }

  // 에러 발생 시 홈으로 이동
  return NextResponse.redirect(`${origin}/?error=auth_failed`);
}
