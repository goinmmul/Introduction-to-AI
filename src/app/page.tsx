import FoodBackground from "@/components/FoodBackground";
import Link from "next/link";

const featureCards = [
  {
    icon: "🍜",
    title: "상황 기반 추천",
    description: "예산, 식사 시간, 원하는 맛을 반영해서 지금 먹기 좋은 메뉴를 추천합니다.",
  },
  {
    icon: "🚫",
    title: "싫어하는 음식 제외",
    description: "해산물, 면, 고기처럼 오늘 먹고 싶지 않은 음식은 추천에서 제외합니다.",
  },
  {
    icon: "✨",
    title: "자연어 입력 지원",
    description: "“만원 이하로 따뜻한 거 먹고 싶어”처럼 문장으로 입력해도 조건을 추출합니다.",
  },
];

const sampleMenus = [
  {
    name: "따뜻한 국밥",
    tag: "든든한 한 끼",
    reason: "점심 시간과 든든한 메뉴 선호에 잘 맞아요.",
  },
  {
    name: "매콤한 제육덮밥",
    tag: "가성비 메뉴",
    reason: "만원 이하 예산과 매운맛 선호에 적합해요.",
  },
  {
    name: "가벼운 샐러드",
    tag: "깔끔한 선택",
    reason: "최근 먹은 음식과 겹치지 않는 가벼운 메뉴예요.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-[calc(100vh-144px)] overflow-hidden bg-gradient-to-b from-orange-50 via-white to-amber-50">
      <FoodBackground />
      <section className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            KENTECH · Bitgaram Food Recommendation
          </p>

          <h1 className="text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
            오늘 뭐 먹지?
            <br />
            <span className="text-orange-600">메오티가 골라줄게요.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
            메오티는 KENTECH 학생과 빛가람혁신도시 주변 사용자를 위한
            음식 추천 서비스입니다. 예산, 원하는 맛, 식사 시간, 싫어하는 음식,
            최근 먹은 음식을 반영해 지금 먹기 좋은 메뉴 Top 3를 추천합니다.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/recommend"
              className="rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700"
            >
              메뉴 추천 받기
            </Link>

            <Link
              href="/about"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-700"
            >
              서비스 소개 보기
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white">
            <p className="text-sm font-semibold opacity-90">오늘의 추천 예시</p>
            <h2 className="mt-3 text-3xl font-extrabold">따뜻하고 든든한 점심</h2>
            <p className="mt-3 text-sm leading-6 opacity-90">
              “만원 이하로 따뜻한 음식이 먹고 싶고, 해산물은 싫어요.”
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {sampleMenus.map((menu, index) => (
              <div
                key={menu.name}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-orange-600">
                      추천 {index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {menu.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{menu.reason}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {menu.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold text-orange-600">How it works</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            세 단계로 끝나는 메뉴 선택
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-orange-50 p-5">
              <p className="text-sm font-bold text-orange-600">Step 1</p>
              <h3 className="mt-2 font-bold text-slate-900">상황 입력</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                자연어 문장 또는 직접 입력으로 예산, 취향, 식사 시간을 입력합니다.
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-5">
              <p className="text-sm font-bold text-amber-600">Step 2</p>
              <h3 className="mt-2 font-bold text-slate-900">조건 분석</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                싫어하는 음식은 제외하고, 선호 태그와 예산 조건을 점수화합니다.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm font-bold text-blue-600">Step 3</p>
              <h3 className="mt-2 font-bold text-slate-900">Top 3 추천</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                가장 적합한 메뉴 3개를 추천 이유와 함께 보여줍니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}