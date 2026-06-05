"use client";

import FoodBackground from "@/components/FoodBackground";
import { useMemo, useState } from "react";

type LadderBar = {
    row: number;
    col: number;
};

type ParticipantResult = {
    name: string;
    startCol: number;
    endCol: number;
    result: "결제" | "통과";
};

type LadderState = {
    bars: LadderBar[];
    bottomResults: ("결제" | "통과")[];
    participantResults: ParticipantResult[];
    payer: string;
};

function parseParticipants(text: string) {
    return Array.from(
        new Set(
            text
                .split(/[,\n]/)
                .map((name) => name.trim())
                .filter(Boolean)
        )
    );
}

function formatPrice(value: string) {
    const numberValue = Number(value.replace(/,/g, ""));

    if (!Number.isFinite(numberValue) || numberValue <= 0) {
        return "금액 미입력";
    }

    return `${numberValue.toLocaleString("ko-KR")}원`;
}

function generateBars(columnCount: number, rowCount: number) {
    const bars: LadderBar[] = [];

    for (let row = 0; row < rowCount; row += 1) {
        let col = 0;

        while (col < columnCount - 1) {
            const shouldAddBar = Math.random() < 0.38;

            if (shouldAddBar) {
                bars.push({ row, col });
                col += 2;
            } else {
                col += 1;
            }
        }
    }

    return bars;
}

function tracePath(startCol: number, bars: LadderBar[], rowCount: number) {
    let currentCol = startCol;

    for (let row = 0; row < rowCount; row += 1) {
        const rightBar = bars.find(
            (bar) => bar.row === row && bar.col === currentCol
        );

        const leftBar = bars.find(
            (bar) => bar.row === row && bar.col === currentCol - 1
        );

        if (rightBar) {
            currentCol += 1;
        } else if (leftBar) {
            currentCol -= 1;
        }
    }

    return currentCol;
}

export default function LadderPage() {
    const [participantsText, setParticipantsText] = useState(
        "시훈, 지호, 태민, 정우"
    );
    const [totalPrice, setTotalPrice] = useState("48000");
    const [ladder, setLadder] = useState<LadderState | null>(null);
    const [message, setMessage] = useState("");

    const participants = useMemo(
        () => parseParticipants(participantsText),
        [participantsText]
    );

    function runLadder() {
        if (participants.length < 2) {
            setMessage("참가자를 최소 2명 이상 입력해주세요.");
            setLadder(null);
            return;
        }

        if (participants.length > 8) {
            setMessage("화면 표시를 위해 참가자는 최대 8명까지 추천합니다.");
            setLadder(null);
            return;
        }

        setMessage("");

        const rowCount = Math.max(8, participants.length + 5);
        const bars = generateBars(participants.length, rowCount);

        const payerBottomIndex = Math.floor(Math.random() * participants.length);
        const bottomResults = participants.map((_, index) =>
            index === payerBottomIndex ? "결제" : "통과"
        ) as ("결제" | "통과")[];

        const participantResults = participants.map((name, startCol) => {
            const endCol = tracePath(startCol, bars, rowCount);

            return {
                name,
                startCol,
                endCol,
                result: bottomResults[endCol],
            };
        });

        const payer =
            participantResults.find((item) => item.result === "결제")?.name ??
            participants[0];

        setLadder({
            bars,
            bottomResults,
            participantResults,
            payer,
        });
    }

    function resetLadder() {
        setLadder(null);
        setMessage("");
        setParticipantsText("");
        setTotalPrice("");
    }

    const svgWidth = 720;
    const svgHeight = 420;
    const topPadding = 46;
    const bottomPadding = 46;
    const sidePadding = 56;
    const rowCount = Math.max(8, participants.length + 5);

    const columnGap =
        participants.length > 1
            ? (svgWidth - sidePadding * 2) / (participants.length - 1)
            : 0;

    const rowGap = (svgHeight - topPadding - bottomPadding) / rowCount;

    function getX(col: number) {
        return sidePadding + col * columnGap;
    }

    function getY(row: number) {
        return topPadding + (row + 1) * rowGap;
    }

    return (
        <main className="relative min-h-[calc(100vh-144px)] overflow-hidden bg-gradient-to-b from-orange-50 via-white to-amber-50">
            <FoodBackground />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <p className="text-sm font-semibold text-orange-600">
                            친구들과 음식값 정하기
                        </p>

                        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                            음식값 사다리타기
                        </h1>

                        <p className="mt-3 leading-7 text-slate-600">
                            친구들과 식사 후 음식값을 누가 낼지 재미있게 정할 수 있는
                            사다리타기 기능입니다. 참가자 이름과 총 금액을 입력하면 랜덤
                            사다리가 생성되고, 한 명이 결제 담당자로 선정됩니다.
                        </p>

                        <div className="mt-6 rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm backdrop-blur">
                            <h2 className="text-lg font-bold text-slate-950">사용 예시</h2>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                예를 들어 친구 4명이 밥을 먹고 총 금액이 48,000원이라면,
                                참가자 이름을 입력한 뒤 사다리를 돌려 결제 담당자를 랜덤으로
                                정할 수 있습니다.
                            </p>

                            <p className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
                                이 기능은 친구들 모두가 동의했을 때 재미용으로 사용하는
                                기능입니다.
                            </p>
                        </div>
                    </div>

                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-orange-100">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-950">
                                참가자 입력
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                콤마 또는 줄바꿈으로 참가자 이름을 입력하세요.
                            </p>
                        </div>

                        <label className="mt-5 block">
                            <span className="text-sm font-semibold text-slate-700">
                                참가자
                            </span>
                            <textarea
                                value={participantsText}
                                onChange={(event) => {
                                    setParticipantsText(event.target.value);
                                    setMessage("");
                                }}
                                placeholder="예: 시훈 지호, 태민, 정우"
                                className="mt-2 min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                        </label>

                        <label className="mt-5 block">
                            <span className="text-sm font-semibold text-slate-700">
                                총 음식값
                            </span>
                            <input
                                value={totalPrice}
                                onChange={(event) => setTotalPrice(event.target.value)}
                                placeholder="예: 48000"
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                        </label>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {participants.length > 0 ? (
                                participants.map((name) => (
                                    <span
                                        key={name}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
                                    >
                                        {name}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400">
                                    아직 입력된 참가자가 없습니다.
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
                                onClick={runLadder}
                                className="flex-1 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-orange-700"
                            >
                                사다리 타기
                            </button>

                            <button
                                type="button"
                                onClick={resetLadder}
                                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                            >
                                초기화
                            </button>
                        </div>
                    </section>
                </section>

                <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-bold text-orange-600">
                                Ladder Result
                            </p>

                            <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
                                사다리 결과
                            </h2>
                        </div>

                        <div className="rounded-2xl bg-orange-50 px-5 py-3 text-sm font-bold text-orange-700">
                            총 금액: {formatPrice(totalPrice)}
                        </div>
                    </div>

                    {!ladder && (
                        <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-3xl bg-slate-50 text-center text-sm text-slate-500">
                            참가자를 입력하고 사다리 타기 버튼을 누르면 결과가 표시됩니다.
                        </div>
                    )}

                    {ladder && participants.length >= 2 && (
                        <div className="mt-6">
                            <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 p-5 text-white">
                                <p className="text-sm font-semibold opacity-90">
                                    오늘의 결제 담당자
                                </p>

                                <h3 className="mt-2 text-4xl font-extrabold">
                                    {ladder.payer}
                                </h3>

                                <p className="mt-3 text-sm opacity-90">
                                    {ladder.payer}님이 {formatPrice(totalPrice)} 결제 담당자로
                                    선정되었습니다.
                                </p>
                            </div>

                            <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-4">
                                <div
                                    className="grid min-w-[640px] gap-2 text-center text-sm font-semibold text-slate-700"
                                    style={{
                                        gridTemplateColumns: `repeat(${participants.length}, minmax(0, 1fr))`,
                                    }}
                                >
                                    {participants.map((name) => (
                                        <div
                                            key={name}
                                            className="rounded-xl bg-orange-50 px-3 py-2 text-orange-700"
                                        >
                                            {name}
                                        </div>
                                    ))}
                                </div>

                                <svg
                                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                    className="mt-4 h-[420px] min-w-[640px] w-full"
                                    role="img"
                                    aria-label="음식값 사다리 결과"
                                >
                                    {participants.map((_, col) => (
                                        <line
                                            key={`vertical-${col}`}
                                            x1={getX(col)}
                                            y1={topPadding}
                                            x2={getX(col)}
                                            y2={svgHeight - bottomPadding}
                                            stroke="#fb923c"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                        />
                                    ))}

                                    {ladder.bars.map((bar) => (
                                        <line
                                            key={`bar-${bar.row}-${bar.col}`}
                                            x1={getX(bar.col)}
                                            y1={getY(bar.row)}
                                            x2={getX(bar.col + 1)}
                                            y2={getY(bar.row)}
                                            stroke="#f97316"
                                            strokeWidth="7"
                                            strokeLinecap="round"
                                        />
                                    ))}
                                </svg>

                                <div
                                    className="grid min-w-[640px] gap-2 text-center text-sm font-bold"
                                    style={{
                                        gridTemplateColumns: `repeat(${participants.length}, minmax(0, 1fr))`,
                                    }}
                                >
                                    {ladder.bottomResults.map((result, index) => (
                                        <div
                                            key={`${result}-${index}`}
                                            className={`rounded-xl px-3 py-2 ${result === "결제"
                                                ? "bg-orange-600 text-white"
                                                : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {result}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 md:grid-cols-2">
                                {ladder.participantResults.map((item) => (
                                    <div
                                        key={item.name}
                                        className={`rounded-2xl border p-4 ${item.result === "결제"
                                            ? "border-orange-200 bg-orange-50"
                                            : "border-slate-200 bg-white"
                                            }`}
                                    >
                                        <p className="text-sm font-semibold text-slate-500">
                                            {item.name}
                                        </p>

                                        <p
                                            className={`mt-1 text-xl font-extrabold ${item.result === "결제"
                                                ? "text-orange-700"
                                                : "text-slate-700"
                                                }`}
                                        >
                                            {item.result}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}