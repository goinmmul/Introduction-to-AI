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

function hasAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

export function parseSituationText(text: string): ParsedSituation {
  const normalized = text.replace(/\s+/g, "").toLowerCase();

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
    hasAny(normalized, ["1만5천", "15000", "15,000", "만오천"])
  ) {
    result.budget = "10000to15000";
    result.extractedSummary.push("예산: 1만5천원 이하");
  } else if (hasAny(normalized, ["만원", "10000", "10,000", "1만원"])) {
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

  // Disliked foods or styles
  const disliked: string[] = [];

  if (
    /(해산물|해물|생선|새우|조개|백합)(은|는|이|가|을|를|도)?(싫|안먹|못먹|제외)/.test(
      normalized
    )
  ) {
    disliked.push("seafood", "해산물", "해물", "생선", "새우", "조개");
  }

  if (
    /(치킨|닭|닭고기)(은|는|이|가|을|를|도)?(싫|안먹|못먹|제외)/.test(
      normalized
    )
  ) {
    disliked.push("chicken", "치킨", "닭");
  }

  if (
    /(고기|돼지고기|소고기|한우|삼겹살)(은|는|이|가|을|를|도)?(싫|안먹|못먹|제외)/.test(
      normalized
    )
  ) {
    disliked.push("meat", "고기", "돼지고기", "소고기", "한우", "삼겹살");
  }

  if (
    /(면|면류|국수|라면|칼국수|냉면|파스타)(은|는|이|가|을|를|도)?(싫|안먹|못먹|제외)/.test(
      normalized
    )
  ) {
    disliked.push("noodle", "면", "국수", "라면", "칼국수", "냉면", "파스타");
  }

  if (
    /(느끼한|느끼|기름진|튀긴|튀김)(건|거|음식)?(은|는|이|가|을|를|도)?(싫|안먹|못먹|제외)/.test(
      normalized
    )
  ) {
    disliked.push("creamy", "fried", "greasy", "느끼한", "튀김");
  }

  if (disliked.length > 0) {
    result.dislikedFoods = Array.from(new Set(disliked)).join(", ");
    result.extractedSummary.push(`제외 조건: ${result.dislikedFoods}`);
  }

  // Recent meals
  const recentFoodKeywords = [
    "피자",
    "치킨",
    "햄버거",
    "파스타",
    "돈가스",
    "돈까스",
    "비빔밥",
    "라면",
    "짜장면",
    "자장면",
    "짬뽕",
    "국밥",
    "곰탕",
    "초밥",
    "스테이크",
    "칼국수",
    "냉면",
    "삼겹살",
    "제육",
    "찌개",
    "볶음밥",
  ];

  if (hasAny(normalized, ["최근", "어제", "오늘아침", "방금", "먹었"])) {
    const recentMeals = recentFoodKeywords.filter((food) =>
      normalized.includes(food)
    );

    if (recentMeals.length > 0) {
      result.recentMeals = recentMeals.join(", ");
      result.extractedSummary.push(`최근 먹은 음식: ${result.recentMeals}`);
    }
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

function normalizeText(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

function splitInput(value?: string) {
  return (value ?? "")
    .split(/[,\s]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getBudgetLimit(budget?: string) {
  if (budget === "under10000") return 10000;
  if (budget === "10000to15000") return 15000;
  if (budget === "over15000") return Number.POSITIVE_INFINITY;
  return null;
}

function matchesDislikedFood(menu: MenuItem, dislikedFoods?: string) {
  const disliked = splitInput(dislikedFoods);

  if (disliked.length === 0) return false;

  const searchableText = [
    menu.restaurantName,
    menu.menuName,
    menu.category,
    menu.locationNote,
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

function createRecommendationReason(menu: MenuItem, input: RecommendationInput) {
  const reasons: string[] = [];

  const budgetLimit = getBudgetLimit(input.budget);

  if (
    budgetLimit !== null &&
    typeof menu.estimatedPrice === "number" &&
    menu.estimatedPrice <= budgetLimit
  ) {
    reasons.push("예산 조건에 맞습니다");
  }

  if (
    input.preferredTaste &&
    safeTags(menu.tasteTags).includes(input.preferredTaste)
  ) {
    reasons.push("선호한 맛 태그와 잘 맞습니다");
  }

  if (input.mealTime && safeTags(menu.mealTimeTags).includes(input.mealTime)) {
    reasons.push("선택한 식사 시간에 어울립니다");
  }

  if (input.recentMeals && !matchesRecentMeal(menu, input.recentMeals)) {
    reasons.push("최근 먹은 음식과 겹치지 않습니다");
  }

  if (reasons.length === 0) {
    return "기본 메뉴 데이터에서 안정적으로 추천할 수 있는 후보입니다.";
  }

  return `${reasons.join(", ")}.`;
}

function calculateScore(menu: MenuItem, input: RecommendationInput) {
  let score = 0;

  const budgetLimit = getBudgetLimit(input.budget);

  // Budget score
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

  // Taste score
  if (input.preferredTaste) {
    if (safeTags(menu.tasteTags).includes(input.preferredTaste)) {
      score += 5;
    } else {
      score -= 1;
    }
  }

  // Meal time score
  if (input.mealTime) {
    if (safeTags(menu.mealTimeTags).includes(input.mealTime)) {
      score += 3;
    } else {
      score -= 1;
    }
  }

  // Recent meal penalty
  if (input.recentMeals && matchesRecentMeal(menu, input.recentMeals)) {
    score -= 4;
  }

  // Small bonus for menus with verified or existing price
  if (typeof menu.estimatedPrice === "number") {
    score += 1;
  }

  // Small bonus for menus with image
  if (menu.imageUrl) {
    score += 0.5;
  }

  return score;
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

  const sourceMenus = filteredMenus.length > 0 ? filteredMenus : menus;

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

  // 핵심 변경점:
  // 기존에는 점수순 Top 3만 고정으로 보여줬지만,
  // 이제는 상위 후보군 8개 안에서 랜덤으로 3개를 뽑습니다.
  // 조건에는 맞으면서도 매번 결과가 조금씩 달라집니다.
  const topPool = sorted.slice(0, Math.min(8, sorted.length));

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