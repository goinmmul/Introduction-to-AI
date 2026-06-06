import menusData from "../../data/menus.json";

export type MenuItem = {
  id?: string;
  restaurantName?: string | null;
  menuName?: string | null;
  category?: string | null;
  estimatedPrice?: number | null;
  listedPrice?: number | null;
  servingSize?: string | null;
  priceRange?: string | null;
  tasteTags?: string[] | null;
  mealTimeTags?: string[] | null;
  similarityTags?: string[] | null;
  locationNote?: string | null;
  sourceLabel?: string | null;
  confidence?: string | null;
  needsVerification?: boolean | null;

  priceSourceLabel?: string | null;
  priceLastCheckedAt?: string | null;
  priceConfidence?: string | null;

  imageUrl?: string | null;
  imageAlt?: string | null;
  imageSourceLabel?: string | null;
  imageCreditUrl?: string | null;
  imageLastCheckedAt?: string | null;
};

export type RecommendationInput = {
  dislikedFoods?: string;
  budget?: string;
  preferredTaste?: string;
  mealTime?: string;
  recentMeals?: string;
};

export type ParsedSituation = RecommendationInput & {
  extractedSummary: string[];
};

export type RecommendedMenu = MenuItem & {
  score: number;
  recommendationReason: string;
  reason: string;
};

const menus = menusData as MenuItem[];
const RECOMMENDATION_RANDOM_POOL_SIZE = 20;
const MIN_STRICT_FILTERED_MENUS = 1;

function hasAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function normalizeSituationText(text: string) {
  return text.replace(/\s+/g, "").toLowerCase();
}

function splitSituationClauses(text: string) {
  return text
    .split(/[.!?。！？\n]/)
    .map((clause) => clause.trim())
    .filter(Boolean);
}

const negativeCueRegex = /(싫|안먹|안먹고|안먹고싶|못먹|제외|빼줘|빼고|먹기싫)/g;
const recentCuePattern = /(최근|어제|오늘아침|방금|먹었|먹은)/;

const dislikedKeywordRules = [
  { keywords: ["짬뽕", "해물짬뽕"], terms: ["짬뽕"] },
  {
    keywords: ["짜장면", "자장면", "짜장", "자장", "해물짜장면", "해물자장면"],
    terms: ["짜장", "자장", "짜장면", "자장면"],
  },
  { keywords: ["삼겹살", "숙성삼겹살"], terms: ["삼겹살"] },
  { keywords: ["파스타", "크림파스타", "로제파스타"], terms: ["파스타"] },
  { keywords: ["곰탕", "수육곰탕"], terms: ["곰탕"] },
  { keywords: ["칼국수", "닭칼국수", "백합칼국수", "해물칼국수"], terms: ["칼국수"] },
  { keywords: ["냉면", "물냉면"], terms: ["냉면"] },
  { keywords: ["초밥", "스시"], terms: ["초밥", "sushi"] },
  { keywords: ["돈가스", "돈까스"], terms: ["돈가스", "돈까스"] },
  { keywords: ["스테이크", "팬스테이크"], terms: ["스테이크"] },
  { keywords: ["제육", "제육볶음"], terms: ["제육"] },
  { keywords: ["찌개", "짜글이", "김치찌개", "된장찌개"], terms: ["찌개"] },
  { keywords: ["볶음밥", "필라프"], terms: ["볶음밥", "필라프"] },
  { keywords: ["비빔밥", "육회비빔밥", "돌판비빔밥"], terms: ["비빔밥"] },
  { keywords: ["아귀찜", "아구찜"], terms: ["아귀찜", "아구찜"] },
  { keywords: ["오징어", "돌판오징어"], terms: ["오징어"] },
  { keywords: ["한우", "소고기", "소고기구이"], terms: ["한우", "소고기"] },
  { keywords: ["갈매기살"], terms: ["갈매기살"] },
  { keywords: ["명란", "명란파밥"], terms: ["명란"] },
  { keywords: ["수제비"], terms: ["수제비"] },

  {
    keywords: [
      "해산물",
      "해물",
      "생선",
      "새우",
      "조개",
      "백합",
      "갑각류",
      "게",
      "게장",
      "회",
      "생선회",
      "모듬회",
      "회정식",
      "초밥",
      "스시",
      "연어",
      "참치",
      "굴비",
      "동태",
      "알탕",
      "물회",
    ],
    terms: [
      "seafood",
      "fish",
      "shrimp",
      "crab",
      "shellfish",
      "sushi",
      "sashimi",
      "salmon",
      "tuna",
      "해산물",
      "해물",
      "생선",
      "새우",
      "조개",
      "백합",
      "게",
      "게장",
      "생선회",
      "모듬회",
      "회정식",
      "초밥",
      "스시",
      "연어",
      "참치",
      "굴비",
      "동태",
      "알탕",
      "물회",
    ],
  },
  {
    keywords: ["치킨", "닭", "닭고기"],
    terms: ["chicken", "치킨", "닭", "닭고기"],
  },
  {
    keywords: [
      "고기",
      "돼지고기",
      "소고기",
      "한우",
      "육류",
      "스테이크",
      "삼겹살",
      "오겹살",
      "갈비",
      "갈비살",
      "갈매기살",
      "목살",
      "수육",
      "육회",
      "불고기",
      "제육",
      "돈가스",
      "돈까스",
      "카츠",
      "곱창",
      "막창",
      "닭",
      "치킨",
    ],
    terms: [
      "meat",
      "beef",
      "pork",
      "chicken",
      "steak",
      "grill",
      "korean bbq",
      "고기",
      "돼지고기",
      "소고기",
      "한우",
      "육류",
      "스테이크",
      "삼겹살",
      "오겹살",
      "갈비",
      "갈비살",
      "갈매기살",
      "목살",
      "수육",
      "육회",
      "불고기",
      "제육",
      "돈가스",
      "돈까스",
      "카츠",
      "곱창",
      "막창",
      "닭",
      "치킨",
    ],
  },
  {
    keywords: [
      "면",
      "면류",
      "국수",
      "라면",
      "칼국수",
      "냉면",
      "쫄면",
      "파스타",
      "짜장",
      "짜장면",
      "자장",
      "자장면",
      "짬뽕",
      "쌀국수",
    ],
    terms: [
      "noodle",
      "pasta",
      "면",
      "면류",
      "국수",
      "라면",
      "칼국수",
      "냉면",
      "쫄면",
      "파스타",
      "짜장",
      "짜장면",
      "자장",
      "자장면",
      "짬뽕",
      "쌀국수",
    ],
  },
  {
    keywords: ["느끼한", "느끼", "기름진", "튀긴", "튀김"],
    terms: ["creamy", "fried", "greasy", "느끼한", "튀김"],
  },
];

const recentKeywordRules = [
  { keywords: ["피자"], term: "피자" },
  { keywords: ["치킨"], term: "치킨" },
  { keywords: ["햄버거", "버거"], term: "햄버거" },
  { keywords: ["파스타"], term: "파스타" },
  { keywords: ["돈가스", "돈까스"], term: "돈가스" },
  { keywords: ["비빔밥"], term: "비빔밥" },
  { keywords: ["라면"], term: "라면" },
  { keywords: ["짜장면", "자장면", "짜장", "자장"], term: "짜장" },
  { keywords: ["짬뽕"], term: "짬뽕" },
  { keywords: ["국밥"], term: "국밥" },
  { keywords: ["곰탕", "수육곰탕"], term: "곰탕" },
  { keywords: ["초밥", "스시"], term: "초밥" },
  { keywords: ["스테이크", "팬스테이크"], term: "스테이크" },
  { keywords: ["칼국수", "닭칼국수", "백합칼국수"], term: "칼국수" },
  { keywords: ["냉면", "물냉면"], term: "냉면" },
  { keywords: ["삼겹살"], term: "삼겹살" },
  { keywords: ["제육", "제육볶음"], term: "제육" },
  { keywords: ["찌개", "짜글이", "김치찌개", "된장찌개"], term: "찌개" },
  { keywords: ["볶음밥", "필라프"], term: "볶음밥" },
  { keywords: ["아귀찜", "아구찜"], term: "아귀찜" },
  { keywords: ["수제비"], term: "수제비" },
];

function extractDislikedTermsFromSituation(text: string) {
  const disliked = new Set<string>();
  const clauses = splitSituationClauses(text);

  clauses.forEach((clause) => {
    const normalizedClause = normalizeSituationText(clause);
    const cueMatches = Array.from(normalizedClause.matchAll(negativeCueRegex));

    cueMatches.forEach((match) => {
      const cueIndex = match.index ?? -1;
      if (cueIndex < 0) return;

      // 핵심:
      // "짬뽕, 삼겹살, 파스타, 곰탕 싫어"처럼
      // 싫다는 표현 앞쪽에 나열된 음식만 제외 조건으로 봅니다.
      // 뒤쪽의 "짜장은 어제 먹었어" 같은 최근 먹은 음식은 제외 조건에 섞이지 않습니다.
      const scopeBeforeNegativeCue = normalizedClause.slice(
        Math.max(0, cueIndex - 80),
        cueIndex
      );

      dislikedKeywordRules.forEach((rule) => {
        const matched = rule.keywords.some((keyword) =>
          scopeBeforeNegativeCue.includes(keyword)
        );

        if (matched) {
          rule.terms.forEach((term) => disliked.add(term));
        }
      });
    });
  });

  return Array.from(disliked);
}

function extractRecentMealsFromSituation(text: string, dislikedTerms: string[]) {
  const recent = new Set<string>();
  const dislikedSet = new Set(dislikedTerms);
  const clauses = splitSituationClauses(text);

  clauses.forEach((clause) => {
    const normalizedClause = normalizeSituationText(clause);

    if (!recentCuePattern.test(normalizedClause)) {
      return;
    }

    // 핵심:
    // 최근 먹은 음식은 "어제", "최근", "먹었어"가 있는 문장 조각에서만 찾습니다.
    // 그리고 이미 제외 조건으로 잡힌 음식은 recentMeals에서 제거합니다.
    recentKeywordRules.forEach((rule) => {
      const matched = rule.keywords.some((keyword) =>
        normalizedClause.includes(keyword)
      );

      if (matched && !dislikedSet.has(rule.term)) {
        recent.add(rule.term);
      }
    });
  });

  return Array.from(recent);
}

export function parseSituationText(text: string): ParsedSituation {
  const normalized = normalizeSituationText(text);

  const result: ParsedSituation = {
    dislikedFoods: "",
    budget: "",
    preferredTaste: "",
    mealTime: "",
    recentMeals: "",
    extractedSummary: [],
  };

  // Budget
  if (hasAny(normalized, ["2만원", "20000", "20,000", "이만원"])) {
    result.budget = "over15000";
    result.extractedSummary.push("예산: 2만원 이하");
  } else if (
    hasAny(normalized, ["1만5천", "15000", "15,000", "만오천", "만오천원"])
  ) {
    result.budget = "10000to15000";
    result.extractedSummary.push("예산: 1만5천원 이하");
  } else if (
    hasAny(normalized, ["만원", "10000", "10,000", "1만원", "만원이하"])
  ) {
    result.budget = "under10000";
    result.extractedSummary.push("예산: 1만원 이하");
  }

  // Meal time
  if (hasAny(normalized, ["점심", "런치", "lunch"])) {
    result.mealTime = "lunch";
    result.extractedSummary.push("식사 시간: 점심");
  } else if (hasAny(normalized, ["저녁", "디너", "dinner"])) {
    result.mealTime = "dinner";
    result.extractedSummary.push("식사 시간: 저녁");
  } else if (hasAny(normalized, ["야식", "밤", "latenight"])) {
    result.mealTime = "lateNight";
    result.extractedSummary.push("식사 시간: 야식");
  }

  // Preferred taste
  if (hasAny(normalized, ["따뜻", "뜨끈", "국물"])) {
    result.preferredTaste = "warm";
    result.extractedSummary.push("선호 맛: 따뜻한");
  } else if (hasAny(normalized, ["매운", "맵", "칼칼", "얼큰"])) {
    result.preferredTaste = "spicy";
    result.extractedSummary.push("선호 맛: 매운");
  } else if (hasAny(normalized, ["순한", "안매운", "자극적이지않은"])) {
    result.preferredTaste = "mild";
    result.extractedSummary.push("선호 맛: 순한");
  } else if (hasAny(normalized, ["든든", "배부른", "포만감"])) {
    result.preferredTaste = "filling";
    result.extractedSummary.push("선호 맛: 든든한");
  } else if (hasAny(normalized, ["가벼운", "가볍게", "라이트"])) {
    result.preferredTaste = "light";
    result.extractedSummary.push("선호 맛: 가벼운");
  } else if (hasAny(normalized, ["신선", "상큼", "깔끔"])) {
    result.preferredTaste = "fresh";
    result.extractedSummary.push("선호 맛: 신선한");
  } else if (hasAny(normalized, ["크림", "크리미"])) {
    result.preferredTaste = "creamy";
    result.extractedSummary.push("선호 맛: 크리미한");
  }

  // Disliked foods
  const disliked = extractDislikedTermsFromSituation(text);

  if (disliked.length > 0) {
    result.dislikedFoods = disliked.join(", ");
    result.extractedSummary.push(`제외 조건: ${result.dislikedFoods}`);
  }

  // Recent meals
  const recentMeals = extractRecentMealsFromSituation(text, disliked);

  if (recentMeals.length > 0) {
    result.recentMeals = recentMeals.join(", ");
    result.extractedSummary.push(`최근 먹은 음식: ${result.recentMeals}`);
  }

  if (result.extractedSummary.length === 0) {
    result.extractedSummary.push(
      "자동으로 추출된 조건이 없습니다. 직접 조건을 선택해주세요."
    );
  }

  return result;
}

function safeTags(tags?: string[] | null) {
  return Array.isArray(tags) ? tags : [];
}

function splitInput(value?: string) {
  return (value ?? "")
    .split(/[,\s]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function expandDislikedTerms(dislikedFoods?: string) {
  const inputTerms = splitInput(dislikedFoods);
  const expanded = new Set(inputTerms);

  inputTerms.forEach((inputTerm) => {
    dislikedKeywordRules.forEach((rule) => {
      const matchesRule =
        rule.keywords.some((keyword) => inputTerm.includes(keyword)) ||
        rule.terms.some((term) => inputTerm.includes(term));

      if (matchesRule) {
        rule.terms.forEach((term) => expanded.add(term.toLowerCase()));
      }
    });
  });

  return Array.from(expanded);
}

function getBudgetLimit(budget?: string) {
  if (budget === "under10000") return 10000;
  if (budget === "10000to15000") return 15000;
  if (budget === "over15000") return Number.POSITIVE_INFINITY;
  return null;
}

function matchesDislikedFood(menu: MenuItem, dislikedFoods?: string) {
  const disliked = expandDislikedTerms(dislikedFoods);

  if (disliked.length === 0) return false;

  const searchableText = [
    menu.menuName,
    ...safeTags(menu.tasteTags),
    ...safeTags(menu.mealTimeTags),
    ...safeTags(menu.similarityTags),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return disliked.some((word) => searchableText.includes(word));
}

function matchesRecentMeal(menu: MenuItem, recentMeals?: string) {
  const recent = splitInput(recentMeals);

  if (recent.length === 0) return false;

  const searchableText = [
    menu.menuName,
    menu.category,
    ...safeTags(menu.similarityTags),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return recent.some((word) => searchableText.includes(word));
}

const tasteTagLabels: Record<string, string> = {
  warm: "따뜻한",
  spicy: "매콤한",
  mild: "순한",
  filling: "든든한",
  fresh: "신선한",
  light: "가벼운",
  creamy: "크리미한",
  fried: "바삭한",
};

const foodTagLabels: Record<string, string> = {
  rice: "밥 메뉴",
  soup: "국물 메뉴",
  noodle: "면 요리",
  pasta: "파스타",
  seafood: "해산물 메뉴",
  shellfish: "조개류 메뉴",
  shrimp: "새우 메뉴",
  crab: "게살 메뉴",
  fish: "생선 메뉴",
  sushi: "초밥 메뉴",
  meat: "고기 메뉴",
  pork: "돼지고기 메뉴",
  beef: "소고기 메뉴",
  chicken: "닭고기 메뉴",
  steak: "스테이크",
  grill: "구이 메뉴",
  "korean bbq": "구이 메뉴",
  bibimbap: "비빔밥",
  sotbap: "솥밥",
  setmeal: "정식 메뉴",
  fried: "튀김 메뉴",
};

const mealTimeLabels: Record<string, string> = {
  lunch: "점심",
  dinner: "저녁",
  lateNight: "야식",
};

function formatKoreanList(items: string[]) {
  return items.join(", ");
}

function getMenuTraitReason(menu: MenuItem) {
  const tasteLabels = safeTags(menu.tasteTags)
    .map((tag) => tasteTagLabels[tag])
    .filter(Boolean)
    .slice(0, 2);
  const foodLabels = safeTags(menu.similarityTags)
    .map((tag) => foodTagLabels[tag])
    .filter(Boolean)
    .slice(0, 2);

  if (tasteLabels.length > 0 && foodLabels.length > 0) {
    return `${formatKoreanList(tasteLabels)} 느낌의 ${formatKoreanList(
      foodLabels
    )}라 한 끼로 고르기 좋습니다`;
  }

  if (tasteLabels.length > 0) {
    return `${formatKoreanList(tasteLabels)} 느낌이 있는 메뉴입니다`;
  }

  if (foodLabels.length > 0) {
    return `${formatKoreanList(foodLabels)}라 선택지로 넣기 좋습니다`;
  }

  if (menu.category) {
    return `${menu.category} 계열 메뉴라 다른 추천 후보와 구성이 겹치지 않습니다`;
  }

  return "메뉴명과 기본 정보가 확인된 후보입니다";
}

function createRecommendationReason(menu: MenuItem, input: RecommendationInput) {
  const reasons: string[] = [];

  const budgetLimit = getBudgetLimit(input.budget);

  if (
    budgetLimit !== null &&
    typeof menu.estimatedPrice === "number" &&
    menu.estimatedPrice <= budgetLimit
  ) {
    reasons.push(
      `예상 가격이 ${formatPrice(menu.estimatedPrice)}이라 선택한 예산 안에 들어갑니다`
    );
  }

  if (
    input.preferredTaste &&
    safeTags(menu.tasteTags).includes(input.preferredTaste)
  ) {
    reasons.push(
      `${tasteTagLabels[input.preferredTaste] ?? "선호한"} 맛 태그가 있어 원하는 느낌과 맞습니다`
    );
  }

  if (input.mealTime && safeTags(menu.mealTimeTags).includes(input.mealTime)) {
    reasons.push(
      `${mealTimeLabels[input.mealTime] ?? "선택한 식사 시간"}에 어울리는 메뉴로 분류되어 있습니다`
    );
  }

  if (input.dislikedFoods) {
    reasons.push("입력한 제외 음식과 겹치는 메뉴명이나 음식 태그가 없습니다");
  }

  if (input.recentMeals && !matchesRecentMeal(menu, input.recentMeals)) {
    reasons.push("최근 먹은 음식과도 겹치지 않습니다");
  }

  reasons.push(getMenuTraitReason(menu));

  if (reasons.length === 0) {
    return "메뉴 정보와 태그를 기준으로 추천 후보에 포함했습니다.";
  }

  return `${reasons.slice(0, 3).join(". ")}.`;
}

function calculateScore(menu: MenuItem, input: RecommendationInput) {
  let score = 0;

  const budgetLimit = getBudgetLimit(input.budget);

  if (budgetLimit !== null) {
    if (typeof menu.estimatedPrice === "number") {
      if (menu.estimatedPrice <= budgetLimit) {
        score += 4;
      } else {
        score -= 5;
      }
    } else {
      score -= 1;
    }
  }

  if (input.preferredTaste) {
    if (safeTags(menu.tasteTags).includes(input.preferredTaste)) {
      score += 5;
    } else {
      score -= 1;
    }
  }

  if (input.mealTime) {
    if (safeTags(menu.mealTimeTags).includes(input.mealTime)) {
      score += 3;
    } else {
      score -= 1;
    }
  }

  // 최근 먹은 음식은 완전 제외하지 않고 점수만 낮춥니다.
  if (input.recentMeals && matchesRecentMeal(menu, input.recentMeals)) {
    score -= 4;
  }

  if (typeof menu.estimatedPrice === "number") {
    score += 1;
  }

  if (menu.imageUrl) {
    score += 0.5;
  }

  return score;
}

function matchesBudget(menu: MenuItem, budget?: string) {
  const budgetLimit = getBudgetLimit(budget);

  if (budgetLimit === null || budgetLimit === Number.POSITIVE_INFINITY) {
    return true;
  }

  return (
    typeof menu.estimatedPrice === "number" && menu.estimatedPrice <= budgetLimit
  );
}

function matchesPreferredTaste(menu: MenuItem, preferredTaste?: string) {
  if (!preferredTaste) return true;
  return safeTags(menu.tasteTags).includes(preferredTaste);
}

function keepStrictFilterIfEnough(
  sourceMenus: MenuItem[],
  predicate: (menu: MenuItem) => boolean
) {
  const filtered = sourceMenus.filter(predicate);
  return filtered.length >= MIN_STRICT_FILTERED_MENUS ? filtered : sourceMenus;
}

function shuffleArray<T>(array: T[]) {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}

export function recommendMenus(input: RecommendationInput): RecommendedMenu[] {
  const filteredMenus = menus.filter(
    (menu) => !matchesDislikedFood(menu, input.dislikedFoods)
  );

  const budgetMatchedMenus = keepStrictFilterIfEnough(
    filteredMenus.length > 0 ? filteredMenus : menus,
    (menu) => matchesBudget(menu, input.budget)
  );
  const sourceMenus = keepStrictFilterIfEnough(budgetMatchedMenus, (menu) =>
    matchesPreferredTaste(menu, input.preferredTaste)
  );

  const scored = sourceMenus.map((menu, index) => {
    const score = calculateScore(menu, input);
    const recommendationReason = createRecommendationReason(menu, input);

    return {
      ...menu,
      score,
      recommendationReason,
      reason: recommendationReason,
      _index: index,
    };
  });

  const sorted = scored.sort((a, b) => b.score - a.score || a._index - b._index);

  const topPool = sorted.slice(
    0,
    Math.min(RECOMMENDATION_RANDOM_POOL_SIZE, sorted.length)
  );

  return shuffleArray(topPool)
    .slice(0, 3)
    .map(({ _index, ...menu }) => menu);
}

export function formatPrice(price?: number | null) {
  if (typeof price !== "number") {
    return "가격 확인 필요";
  }

  return `${price.toLocaleString("ko-KR")}원`;
}
