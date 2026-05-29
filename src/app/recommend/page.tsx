"use client";

import { FormEvent, useState } from "react";
import { formatPrice, recommendMenus, RecommendedMenu } from "@/lib/recommendation";

const budgetOptions = [
  { value: "", label: "예산 선택 안 함" },
  { value: "under10000", label: "1만원 이하" },
  { value: "10000to15000", label: "1만5천원 이하" },
  { value: "under20000", label: "2만원 이하" }
];

const tasteOptions = [
  { value: "warm", label: "따뜻한" },
  { value: "spicy", label: "매운" },
  { value: "mild", label: "순한" },
  { value: "filling", label: "든든한" },
  { value: "fresh", label: "신선한" },
  { value: "light", label: "가벼운" },
  { value: "creamy", label: "크리미한" }
];

const mealTimeOptions = [
  { value: "", label: "식사 시간 선택 안 함" },
  { value: "lunch", label: "점심" },
  { value: "dinner", label: "저녁" },
  { value: "lateNight", label: "야식" }
];

export default function RecommendPage() {
  const [dislikedFoods, setDislikedFoods] = useState("");
  const [budget, setBudget] = useState("");
  const [preferredTaste, setPreferredTaste] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [recentMeals, setRecentMeals] = useState("");
  const [results, setResults] = useState<RecommendedMenu[] | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResults(
      recommendMenus({
        dislikedFoods,
        budget,
        preferredTaste,
        mealTime,
        recentMeals
      })
    );
  }

  function resetForm() {
    setDislikedFoods("");
    setBudget("");
    setPreferredTaste("");
    setMealTime("");
    setRecentMeals("");
    setResults(null);
  }

  return (
    <main className="min-h-[calc(100vh-144px)] bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <p className="text-sm font-semibold text-meoti-blue">조건 기반 추천</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">메뉴 추천 받기</h1>
          <p className="mt-3 leading-7 text-slate-600">
            싫어하는 음식, 예산, 원하는 맛과 식사 시간을 입력하면 메뉴 데이터에서 Top 3를 추천합니다.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">먹기 싫은 음식</span>
                <input
                  value={dislikedFoods}
                  onChange={(event) => setDislikedFoods(event.target.value)}
                  placeholder="예: 해산물, 면, 고기"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-meoti-blue focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">예산</span>
                <select
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-meoti-blue focus:ring-2 focus:ring-blue-100"
                >
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset>
                <legend className="text-sm font-semibold text-slate-700">원하는 맛</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tasteOptions.map((taste) => {
                    const selected = preferredTaste === taste.value;
                    return (
                      <button
                        key={taste.value}
                        type="button"
                        onClick={() => setPreferredTaste(selected ? "" : taste.value)}
                        className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                          selected
                            ? "border-meoti-blue bg-meoti-blue text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-meoti-blue hover:text-meoti-blue"
                        }`}
                      >
                        {taste.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">식사 시간</span>
                <select
                  value={mealTime}
                  onChange={(event) => setMealTime(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-meoti-blue focus:ring-2 focus:ring-blue-100"
                >
                  {mealTimeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">최근 먹은 음식</span>
                <input
                  value={recentMeals}
                  onChange={(event) => setRecentMeals(event.target.value)}
                  placeholder="예: 비빔밥, 돈가스, 파스타"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-meoti-blue focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-meoti-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              추천 받기
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">추천 결과</h2>
              <p className="mt-1 text-sm text-slate-500">조건을 입력하고 추천 받기를 눌러주세요.</p>
            </div>
            {results && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-meoti-blue hover:text-meoti-blue"
              >
                다시 추천받기
              </button>
            )}
          </div>

          {!results && (
            <div className="flex min-h-64 items-center justify-center text-center text-sm leading-7 text-slate-500">
              입력값이 모두 비어 있으면 데이터셋의 기본 추천 메뉴를 보여줍니다.
            </div>
          )}

          {results && results.length < 3 && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
              조건에 맞는 메뉴가 부족합니다. 제외 음식이나 예산 조건을 조금 완화해보세요.
            </div>
          )}

          {results && results.length >= 3 && (
            <div className="mt-5 grid gap-4">
              {results.map((menu, index) => (
                <article key={`${menu.id ?? menu.menuName}-${index}`} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{menu.restaurantName}</p>
                      <h3 className="mt-1 text-xl font-bold text-slate-950">{menu.menuName}</h3>
                    </div>
                    <span className="rounded-full bg-meoti-sky px-3 py-1 text-sm font-semibold text-meoti-blue">
                      Top {index + 1}
                    </span>
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="font-semibold text-slate-500">분류</dt>
                      <dd className="mt-1 text-slate-900">{menu.category ?? "분류 확인 필요"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-500">예상 가격</dt>
                      <dd className="mt-1 text-slate-900">{formatPrice(menu.estimatedPrice)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-500">위치</dt>
                      <dd className="mt-1 text-slate-900">{menu.locationNote ?? "위치 확인 필요"}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(menu.tasteTags ?? []).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-7 text-slate-700">{menu.reason}</p>

                  {menu.needsVerification && (
                    <p className="mt-3 text-xs leading-6 text-slate-500">
                      검증 메모: 가격 또는 영업 정보는 실제 방문 전 확인이 필요할 수 있습니다.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
