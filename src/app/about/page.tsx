const limitations = [
  "데이터는 수동으로 수집되었을 수 있습니다.",
  "가격과 영업 상태는 실시간 정보가 아닐 수 있습니다.",
  "MVP에는 AI API가 포함되어 있지 않습니다."
];

const futureItems = ["AI 생성 추천 설명", "그룹 추천", "지도 링크", "실제 음식점 데이터 업데이트"];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-meoti-sky">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-sm font-semibold text-meoti-blue">About</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">메오티 소개</h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-700">
            메오티는 KENTECH 학생과 빛가람혁신도시 주변 사용자가 현재 조건에 맞는 메뉴를 빠르게 고를 수
            있도록 돕는 조건 기반 음식 추천 MVP입니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-950">무엇을 하나요?</h2>
          <p className="mt-3 leading-7 text-slate-600">
            싫어하는 음식, 예산, 선호 맛, 식사 시간, 최근 먹은 음식을 바탕으로 로컬 JSON 메뉴 데이터에서
            적합한 메뉴 3개를 추천합니다.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-950">누구를 위한 서비스인가요?</h2>
          <p className="mt-3 leading-7 text-slate-600">
            점심이나 저녁 메뉴를 빠르게 정해야 하는 KENTECH 학생, 교직원, 빛가람혁신도시 방문자와 거주자를
            주요 사용자로 가정했습니다.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-950">데이터 범위</h2>
          <p className="mt-3 leading-7 text-slate-600">
            MVP 데이터는 빛가람혁신도시 주변 음식점과 대표 메뉴를 담은 `data/menus.json` 파일을 기준으로
            합니다. 별도 데이터베이스나 지도 API는 사용하지 않습니다.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-950">MVP 한계</h2>
          <ul className="mt-3 space-y-2 text-slate-600">
            {limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-950">향후 개선</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {futureItems.map((item) => (
              <span key={item} className="rounded-full bg-meoti-sky px-3 py-2 text-sm font-semibold text-meoti-blue">
                {item}
              </span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
