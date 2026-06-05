"use client";

import FoodBackground from "@/components/FoodBackground";
import type { MenuItem } from "@/lib/recommendation";
import menusData from "../../../data/menus.json";
import { useMemo, useState } from "react";

type RouletteCandidate = {
    name: string;
    originalIndex: number;
};

type RouletteResult = RouletteCandidate & {
    matchedMenu?: MenuItem;
};

const menus = menusData as MenuItem[];

const sampleMenus = [
    "짬뽕",
    "삼겹살",
    "초밥",
    "파스타",
    "제육볶음",
    "닭칼국수",
    "곰탕",
    "스테이크",
];

function parseMenuCandidates(text: string) {
    return Array.from(
        new Set(
            text
                .split(/[,\n]/)
                .map((item) => item.trim())
                .filter(Boolean)
        )
    );
}

function shuffleArray<T>(array: T[]) {
    const copied = [...array];

    for (let i = copied.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copied[i], copied[j]] = [copied[j], copied[i]];
    }

    return copied;
}

function normalizeText(value?: string | null) {
    return (value ?? "").replace(/\s+/g, "").toLowerCase();
}

function findMatchingMenus(candidate: string) {
    const normalizedCandidate = normalizeText(candidate);

    if (!normalizedCandidate) return [];

    return menus.filter((menu) => {
        const menuName = normalizeText(menu.menuName);
        const restaurantName = normalizeText(menu.restaurantName);
        const category = normalizeText(menu.category);

        const tags = [
            ...(Array.isArray(menu.tasteTags) ? menu.tasteTags : []),
            ...(Array.isArray(menu.mealTimeTags) ? menu.mealTimeTags : []),
            ...(Array.isArray(menu.similarityTags) ? menu.similarityTags : []),
        ]
            .map(normalizeText)
            .join(" ");

        return (
            menuName.includes(normalizedCandidate) ||
            normalizedCandidate.includes(menuName) ||
            restaurantName.includes(normalizedCandidate) ||
            category.includes(normalizedCandidate) ||
            tags.includes(normalizedCandidate)
        );
    });
}

function pickMatchedMenu(candidate: string) {
    const matches = findMatchingMenus(candidate);

    if (matches.length === 0) return undefined;

    return shuffleArray(matches)[0];
}

function formatPrice(price?: number | null) {
    if (typeof price !== "number") return "가격 확인 필요";
    return `${price.toLocaleString("ko-KR")}원`;
}

function getGoogleMapUrl(menu: MenuItem) {
    const query = [menu.restaurantName, menu.locationNote]
        .filter(Boolean)
        .join(" ");

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query
    )}`;
}

export default function RoulettePage() {
    const [candidateText, setCandidateText] = useState(sampleMenus.join(", "));
    const [results, setResults] = useState<RouletteResult[] | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [message, setMessage] = useState("");

    const candidates = useMemo(
        () => parseMenuCandidates(candidateText),
        [candidateText]
    );

    function spinRoulette() {
        if (candidates.length < 3) {
            setMessage("메뉴 후보를 최소 3개 이상 입력해주세요.");
            setResults(null);
            return;
        }

        setMessage("");
        setIsSpinning(true);
        setResults(null);

        window.setTimeout(() => {
            const ranked = shuffleArray(
                candidates.map((name, index) => ({
                    name,
                    originalIndex: index,
                    matchedMenu: pickMatchedMenu(name),
                }))
            ).slice(0, 3);

            setResults(ranked);
            setIsSpinning(false);
        }, 900);
    }

    function resetRoulette() {
        setResults(null);
        setMessage("");
        setCandidateText("");
    }

    function useSampleMenus() {
        setCandidateText(sampleMenus.join(", "));
        setResults(null);
        setMessage("");
    }

    return (
        <main className="relative min-h-[calc(100vh-144px)] overflow-hidden bg-gradient-to-b from-orange-50 via-white to-amber-50">
            <FoodBackground />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <p className="text-sm font-semibold text-orange-600">
                            친구들과 메뉴 정하기
                        </p>

                        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                            음식 추천 룰렛
                        </h1>

                        <p className="mt-3 leading-7 text-slate-600">
                            친구들이 먹고 싶은 메뉴 후보를 여러 개 입력하면, 메오티가
                            랜덤으로 Top 3 순위를 정해줍니다. 입력한 후보가 실제 메뉴
                            데이터와 연결되면 음식점 이름과 실제 메뉴명도 함께 보여줍니다.
                        </p>

                        <div className="mt-6 rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm backdrop-blur">
                            <h2 className="text-lg font-bold text-slate-950">사용 예시</h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                친구 A는 짬뽕, 친구 B는 삼겹살, 친구 C는 초밥을 먹고 싶어할
                                때 후보를 모두 입력하고 룰렛을 돌리면 랜덤 순위가 정해집니다.
                                데이터에 있는 메뉴라면 실제 음식점 정보도 같이 표시됩니다.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {sampleMenus.map((menu) => (
                                    <span
                                        key={menu}
                                        className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700"
                                    >
                                        {menu}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-orange-100">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-950">
                                    후보 메뉴 입력
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    콤마 또는 줄바꿈으로 메뉴를 여러 개 입력하세요.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={useSampleMenus}
                                className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                            >
                                예시 넣기
                            </button>
                        </div>

                        <textarea
                            value={candidateText}
                            onChange={(event) => {
                                setCandidateText(event.target.value);
                                setMessage("");
                            }}
                            placeholder="예: 짬뽕, 삼겹살, 초밥, 파스타, 제육볶음"
                            className="mt-5 min-h-36 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {candidates.length > 0 ? (
                                candidates.map((menu) => (
                                    <span
                                        key={menu}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
                                    >
                                        {menu}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400">
                                    아직 입력된 후보가 없습니다.
                                </p>
                            )}
                        </div>

                        {message && (
                            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {message}
                            </p>
                        )}

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={spinRoulette}
                                disabled={isSpinning}
                                className="flex-1 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSpinning ? "룰렛 돌리는 중..." : "룰렛 돌리기"}
                            </button>

                            <button
                                type="button"
                                onClick={resetRoulette}
                                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                            >
                                초기화
                            </button>
                        </div>

                        <div className="mt-8 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 p-5 text-white">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold opacity-90">
                                        Roulette Result
                                    </p>
                                    <h3 className="mt-1 text-2xl font-extrabold">
                                        오늘의 랜덤 Top 3
                                    </h3>
                                </div>

                                <div
                                    className={`flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl ${isSpinning ? "animate-spin" : ""
                                        }`}
                                >
                                    🍽️
                                </div>
                            </div>

                            {!results && !isSpinning && (
                                <div className="mt-6 rounded-2xl bg-white/15 p-5 text-sm leading-7">
                                    룰렛을 돌리면 친구들이 입력한 후보 중 랜덤 Top 3가
                                    표시됩니다.
                                </div>
                            )}

                            {isSpinning && (
                                <div className="mt-6 rounded-2xl bg-white/15 p-5 text-sm font-semibold">
                                    후보 메뉴를 섞고 있습니다...
                                </div>
                            )}

                            {results && (
                                <div className="mt-6 space-y-3">
                                    {results.map((result, index) => {
                                        const matchedMenu = result.matchedMenu;

                                        return (
                                            <div
                                                key={`${result.name}-${index}`}
                                                className={`rounded-2xl p-4 ${index === 0
                                                        ? "bg-white text-slate-950"
                                                        : "bg-white/20 text-white"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p
                                                            className={`text-sm font-bold ${index === 0
                                                                    ? "text-orange-600"
                                                                    : "text-white/80"
                                                                }`}
                                                        >
                                                            {index + 1}위
                                                        </p>

                                                        {matchedMenu ? (
                                                            <>
                                                                <h4 className="mt-1 text-xl font-extrabold">
                                                                    {matchedMenu.menuName}
                                                                </h4>
                                                                <p
                                                                    className={`mt-1 text-sm ${index === 0
                                                                            ? "text-slate-500"
                                                                            : "text-white/80"
                                                                        }`}
                                                                >
                                                                    {matchedMenu.restaurantName}
                                                                </p>

                                                                <div
                                                                    className={`mt-3 flex flex-wrap gap-2 text-xs ${index === 0
                                                                            ? "text-slate-600"
                                                                            : "text-white/90"
                                                                        }`}
                                                                >
                                                                    <span className="rounded-full bg-white/20 px-2 py-1">
                                                                        입력 후보: {result.name}
                                                                    </span>
                                                                    <span className="rounded-full bg-white/20 px-2 py-1">
                                                                        {formatPrice(matchedMenu.estimatedPrice)}
                                                                    </span>
                                                                    {matchedMenu.locationNote && (
                                                                        <a
                                                                            href={getGoogleMapUrl(matchedMenu)}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="rounded-full bg-white/20 px-2 py-1 underline underline-offset-2"
                                                                        >
                                                                            위치 보기
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <h4 className="mt-1 text-xl font-extrabold">
                                                                    {result.name}
                                                                </h4>
                                                                <p
                                                                    className={`mt-1 text-sm ${index === 0
                                                                            ? "text-slate-500"
                                                                            : "text-white/80"
                                                                        }`}
                                                                >
                                                                    메뉴 데이터에서 정확한 음식점은 찾지 못했지만,
                                                                    입력 후보로 순위에 포함했습니다.
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>

                                                    <span className="text-3xl">
                                                        {index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </section>

                <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-bold text-orange-600">
                        Why this feature?
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
                        여러 명이 같이 먹을 때 메뉴 결정을 빠르게
                    </h2>

                    <p className="mt-3 leading-7 text-slate-600">
                        기존 추천 페이지는 개인의 조건을 바탕으로 메뉴를 추천합니다. 반면
                        음식 추천 룰렛은 친구들이 각자 먹고 싶은 메뉴를 후보로 넣고,
                        공정하게 랜덤 순위를 뽑아 최종 메뉴를 정하는 데 초점을 둡니다.
                        또한 입력 후보가 실제 메뉴 데이터와 연결되면 음식점 이름, 메뉴명,
                        가격, 위치까지 함께 보여줄 수 있습니다.
                    </p>
                </section>
            </div>
        </main>
    );
}