import Link from "next/link";
import { formatPrice, getPreviewMenus } from "@/lib/recommendation";

const steps = [
  {
    title: "조건 입력",
    body: "싫어하는 음식, 예산, 원하는 맛을 입력합니다."
  },
  {
    title: "메뉴 필터링",
    body: "빛가람혁신도시 메뉴 데이터에서 조건에 맞지 않는 메뉴를 제거합니다."
  },
  {
    title: "Top 3 추천",
    body: "조건에 맞는 메뉴 3개를 추천 이유와 함께 확인합니다."
  }
];

export default function Home() {
  const previewMenus = getPreviewMenus();

  return (
    <main>
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-meoti-sky">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold text-meoti-blue">KENTECH 주변 메뉴 추천 MVP</p>
            <h1 className="mt-4 text-4xl font-bold tracking-normal text-slate-950 sm:text-6xl">
              오늘 뭐 먹지?
            </h1>
            <p className="mt-5 text-xl font-semibold text-slate-700">
              빛가람혁신도시에서 오늘 먹을 메뉴를 빠르게 추천받으세요.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              먹기 싫은 음식, 예산, 원하는 맛을 입력하면 메오티가 조건에 맞는 메뉴 3개를 골라드립니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/recommend"
                className="inline-flex items-center justify-center rounded-lg bg-meoti-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                메뉴 추천 받기
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-meoti-blue hover:text-meoti-blue"
              >
                서비스 알아보기
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">추천 예시</p>
            <div className="mt-4 space-y-3">
              {previewMenus.map((menu) => (
                <div key={menu.id ?? menu.menuName} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">{menu.restaurantName}</p>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-slate-950">{menu.menuName}</h2>
                    <span className="shrink-0 text-sm text-meoti-blue">
                      {formatPrice(menu.estimatedPrice)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{menu.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-950">How It Works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="max-w-4xl text-sm leading-7 text-slate-600">
            메오티는 MVP 단계에서 빛가람혁신도시 내 음식점과 대표 메뉴 데이터를 기반으로 추천합니다.
            가격과 영업 정보는 실제 방문 전 확인이 필요할 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
