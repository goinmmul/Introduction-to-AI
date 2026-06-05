"use client";

import FoodBackground from "@/components/FoodBackground";
import { FormEvent, useState } from "react";
import {
  formatPrice,
  parseSituationText,
  recommendMenus,
  RecommendedMenu,
} from "@/lib/recommendation";

const tasteOptions = [
  { label: "따뜻한", value: "warm" },
  { label: "매운", value: "spicy" },
  { label: "순한", value: "mild" },
  { label: "든든한", value: "filling" },
  { label: "신선한", value: "fresh" },
  { label: "가벼운", value: "light" },
  { label: "크리미한", value: "creamy" },
];

const mealTimeOptions = [
  { label: "점심", value: "lunch" },
  { label: "저녁", value: "dinner" },
  { label: "야식", value: "lateNight" },
];

const budgetOptions = [
  { label: "예산 선택 안 함", value: "" },
  { label: "1만원 이하", value: "under10000" },
  { label: "1만원 ~ 1만5천원", value: "10000to15000" },
  { label: "1만5천원 이상", value: "over15000" },
];

export default function RecommendPage() {
  const [dislikedFoods, setDislikedFoods] = useState("");
  const [budget, setBudget] = useState("");
  const [preferredTaste, setPreferredTaste] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [recentMeals, setRecentMeals] = useState("");
  const [results, setResults] = useState<RecommendedMenu[] | null>(null);
  const [situationText, setSituationText] = useState("");
  const [parsedSummary, setParsedSummary] = useState<string[]>([]);

  function getCurrentInput() {
    return {
      dislikedFoods,
      budget,
      preferredTaste,
      mealTime,
      recentMeals,
    };
  }

  function applySituationText() {
    const parsed = parseSituationText(situationText);

    if (parsed.dislikedFoods) setDislikedFoods(parsed.dislikedFoods);
    if (parsed.budget) setBudget(parsed.budget);
    if (parsed.preferredTaste) setPreferredTaste(parsed.preferredTaste);
    if (parsed.mealTime) setMealTime(parsed.mealTime);
    if (parsed.recentMeals) setRecentMeals(parsed.recentMeals);

    setParsedSummary(parsed.extractedSummary);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResults(recommendMenus(getCurrentInput()));
  }

  function handleRecommendAgain() {
    setResults(recommendMenus(getCurrentInput()));
  }

  function getGoogleMapUrl(menu: RecommendedMenu) {
    const query = [menu.restaurantName, menu.locationNote]
      .filter(Boolean)
      .join(" ");

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
  }

  return (
    <main className="relative min-h-[calc(100vh-144px)] overflow-hidden bg-gradient-to-b from-orange-50 via-white to-amber-50">
      <FoodBackground />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <p className="text-sm font-semibold text-orange-600">
            조건 기반 추천
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            메뉴 추천 받기
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            싫어하는 음식, 예산, 원하는 맛과 식사 시간을 입력하면 메뉴
            데이터에서 Top 3를 추천합니다.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="space-y-5">
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 shadow-sm">
                <label className="text-sm font-semibold text-slate-800">
                  자연어 상황 입력
                </label>

                <textarea
                  value={situationText}
                  onChange={(event) => setSituationText(event.target.value)}
                  placeholder="예: 오늘 점심은 만 원 이하로 따뜻하고 든든한 거 먹고 싶어. 해산물은 싫고 어제 피자 먹었어."
                  className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <button
                  type="button"
                  onClick={applySituationText}
                  className="mt-3 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-100 transition hover:bg-orange-700"
                >
                  상황 자동 적용
                </button>

                {parsedSummary.length > 0 && (
                  <div className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">
                      자동 추출 결과
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {parsedSummary.map((summary) => (
                        <li key={summary}>{summary}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  먹기 싫은 음식
                </span>
                <input
                  value={dislikedFoods}
                  onChange={(event) => setDislikedFoods(event.target.value)}
                  placeholder="예: 해산물, 면, 고기"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  예산
                </span>
                <select
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  원하는 맛
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tasteOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setPreferredTaste(
                          preferredTaste === option.value ? "" : option.value
                        )
                      }
                      className={`rounded-full border px-4 py-2 text-sm transition ${preferredTaste === option.value
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  식사 시간
                </span>
                <select
                  value={mealTime}
                  onChange={(event) => setMealTime(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">식사 시간 선택 안 함</option>
                  {mealTimeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  최근 먹은 음식
                </span>
                <input
                  value={recentMeals}
                  onChange={(event) => setRecentMeals(event.target.value)}
                  placeholder="예: 비빔밥, 돈가스, 파스타"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-orange-700"
              >
                추천 받기
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">추천 결과</h2>
              <p className="mt-2 text-sm text-slate-500">
                조건을 입력하고 추천 받기를 눌러주세요.
              </p>
            </div>

            {results && results.length > 0 && (
              <button
                type="button"
                onClick={handleRecommendAgain}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                다시 추천받기
              </button>
            )}
          </div>

          <div className="mt-5 border-t border-slate-200" />

          {!results && (
            <div className="flex min-h-[360px] items-center justify-center text-center text-sm text-slate-500">
              입력값이 모두 비어 있으면 데이터셋의 기본 추천 메뉴를
              보여줍니다.
            </div>
          )}

          {results && results.length > 0 && (
            <div className="mt-5 grid gap-4">
              {results.map((menu, index) => (
                <article
                  key={`${menu.id ?? menu.menuName}-${index}`}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="mb-4 h-44 overflow-hidden rounded-2xl bg-orange-50">
                    <img
                      src={
                        menu.imageUrl ??
                        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={
                        menu.imageAlt ?? menu.menuName ?? "추천 음식 이미지"
                      }
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      onError={(event) => {
                        const image = event.currentTarget;

                        if (image.dataset.fallbackApplied === "true") return;

                        image.dataset.fallbackApplied = "true";
                        image.src =
                          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";
                      }}
                    />
                  </div>

                  {menu.imageSourceLabel && (
                    <p className="-mt-2 mb-4 text-xs text-slate-400">
                      Image:{" "}
                      {menu.imageCreditUrl ? (
                        <a
                          href={menu.imageCreditUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2"
                        >
                          {menu.imageSourceLabel}
                        </a>
                      ) : (
                        menu.imageSourceLabel
                      )}
                    </p>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {menu.restaurantName}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-slate-950">
                        {menu.menuName}
                      </h3>
                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                      Top {index + 1}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
                    <div>
                      <p className="font-semibold text-slate-500">분류</p>
                      <p className="mt-1 text-slate-900">
                        {menu.category ?? "분류 없음"}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-500">예상 가격</p>
                      <p className="mt-1 text-slate-900">
                        {formatPrice(menu.estimatedPrice)}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-500">위치</p>

                      {menu.locationNote ? (
                        <a
                          href={getGoogleMapUrl(menu)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block font-medium text-orange-600 underline underline-offset-4 hover:text-orange-700"
                        >
                          {menu.locationNote}
                        </a>
                      ) : (
                        <p className="mt-1 text-slate-900">위치 확인 필요</p>
                      )}
                    </div>
                  </div>

                  {menu.tasteTags && menu.tasteTags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {menu.tasteTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {menu.recommendationReason}
                  </p>

                  {menu.needsVerification && (
                    <p className="mt-4 text-xs text-slate-400">
                      검증 메모: 가격 또는 영업 정보는 실제 방문 전 확인이
                      필요할 수 있습니다.
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