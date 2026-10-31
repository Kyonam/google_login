import { Hero } from "@/components/ui/hero-1";
import { LoginNav } from "@/components/auth/login-modal";

export default function Home() {
  return (
    <main className="min-h-screen bg-white relative">
      {/* 우측 상단 로그인 링크 */}
      <LoginNav />

      {/* 히어로 섹션 */}
      <Hero
        title={"Build smarter tools\nfor modern teams"}
        subtitle="Streamline your workflow and boost productivity with intuitive solutions. Security, speed, and simplicity—all in one platform."
        eyebrow="NEXT-GEN PRODUCTIVITY"
        ctaLabel="Get Started"
        ctaHref="#"
      />
    </main>
  );
}
