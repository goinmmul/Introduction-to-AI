import menusData from "../../data/menus.json";

export type MenuItem = {
  id?: string;
  restaurantName?: string | null;
  menuName?: string | null;
  category?: string | null;
  estimatedPrice?: number | null;
  priceRange?: string | null;
  tasteTags?: string[] | null;
  mealTimeTags?: string[] | null;
  similarityTags?: string[] | null;
  locationNote?: string | null;
  needsVerification?: boolean | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  imageSourceLabel?: string | null;
  imageCreditUrl?: string | null;
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
  if (
    hasAny(normalized, ["2만원", "20000", "20,000", "이만원"])
  ) {
    result.budget = "under20000";
    result.extractedSummary.push("예산: 2만원 이하");
  } else if (
    hasAny(normalized, ["1만5천", "15000", "15,000", "만오천"])
  ) {
    result.budget = "10000to15000";
    result.extractedSummary.push("예산: 1만5천원 이하");
  } else if (
    hasAny(normalized, ["만원", "10000", "10,000", "1만원"])
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
  } else if (hasAny(normalized, ["매운", "맵", "칼칼"])) {
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
    /(해산물|해물|생선|새우)(은|는|이|가|을|를|도)?(싫|안먹|못먹|제외)/.test(
      normalized
    )
  ) {
    disliked.push("seafood", "해산물", "해물", "생선", "새우");
  }

  if (/(치킨|닭|닭고기)(은|는|이|가|을|를|도)?(싫|안먹|못먹|제외)/.test(normalized)) {
    disliked.push("chicken", "치킨", "닭");
  }

  if (/(고기|돼지고기|소고기)(은|는|이|가|을|를|도)?(싫|안먹|못먹|제외)/.test(normalized)) {
    disliked.push("meat", "고기", "돼지고기", "소고기");
  }

  if (/(면|면류|국수|라면)(은|는|이|가|을|를|도)?(싫|안먹|못먹|제외)/.test(normalized)) {
    disliked.push("noodle", "면", "국수", "라면");
  }

  if (hasAny(normalized, ["느끼한건싫", "느끼한거싫", "느끼싫", "기름진거싫"])) {
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
    "비빔밥",
    "라면",
    "짜장면",
    "자장면",
    "짬뽕",
    "국밥",
    "초밥",
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
    result.extractedSummary.push("자동으로 추출된 조건이 없습니다. 직접 조건을 선택해주세요.");
  }

  return result;
}

export type RecommendedMenu = MenuItem & {
  score: number;
  reason: string;
  priceNeedsVerification: boolean;
};

const menus = menusData as MenuItem[];

const budgetLimits: Record<string, number> = {
  under10000: 10000,
  "10000to15000": 15000,
  under15000: 15000,
  under20000: 20000
};

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function tokenize(value?: string) {
  return normalize(value)
    .split(/[\s,，、/]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function safeTags(tags?: string[] | null) {
  return Array.isArray(tags) ? tags.filter(Boolean) : [];
}

function fieldMatches(menu: MenuItem, tokens: string[]) {
  if (tokens.length === 0) return false;

  const searchable = [
    menu.menuName,
    menu.restaurantName,
    menu.category,
    ...safeTags(menu.tasteTags),
    ...safeTags(menu.similarityTags)
  ]
    .map(normalize)
    .join(" ");

  return tokens.some((token) => searchable.includes(token));
}

function recentMealMatches(menu: MenuItem, tokens: string[]) {
  if (tokens.length === 0) return false;

  const searchable = [menu.menuName, ...safeTags(menu.similarityTags)]
    .map(normalize)
    .join(" ");

  return tokens.some((token) => searchable.includes(token));
}

function getBudgetLimit(budget?: string) {
  if (!budget) return null;
  return budgetLimits[budget] ?? null;
}

function buildReason({
  menu,
  budgetMatched,
  tasteMatched,
  mealTimeMatched,
  recentPenalty
}: {
  menu: MenuItem;
  budgetMatched: boolean;
  tasteMatched: boolean;
  mealTimeMatched: boolean;
  recentPenalty: boolean;
}) {
  if (menu.estimatedPrice == null) {
    return "가격 정보는 검증이 필요하지만, 조건 태그가 잘 맞는 후보입니다.";
  }

  if (budgetMatched && tasteMatched) {
    return "예산 조건에 맞고, 선택한 맛 선호와 잘 맞는 메뉴입니다.";
  }

  if (!recentPenalty && mealTimeMatched) {
    return "최근 먹은 음식과 겹치지 않으며 선택한 식사 시간에 적합합니다.";
  }

  if (safeTags(menu.tasteTags).includes("filling") && budgetMatched) {
    return "든든한 식사를 원할 때 적합하고 가격 조건도 만족합니다.";
  }

  if (mealTimeMatched || tasteMatched) {
    return "입력한 조건과 메뉴 태그가 잘 맞는 추천 후보입니다.";
  }

  return "기본 메뉴 데이터에서 안정적으로 추천할 수 있는 후보입니다.";
}

export function recommendMenus(input: RecommendationInput = {}): RecommendedMenu[] {
  const dislikedTokens = tokenize(input.dislikedFoods);
  const recentTokens = tokenize(input.recentMeals);
  const budgetLimit = getBudgetLimit(input.budget);
  const preferredTaste = normalize(input.preferredTaste);
  const mealTime = normalize(input.mealTime);

  const candidates = menus.filter((menu) => {
    if (!menu || !menu.restaurantName || !menu.menuName) return false;
    return !fieldMatches(menu, dislikedTokens);
  });

  const scored = candidates.map((menu, index) => {
    let score = 10;
    const tasteTags = safeTags(menu.tasteTags).map(normalize);
    const mealTimeTags = safeTags(menu.mealTimeTags).map(normalize);
    const recentPenalty = recentMealMatches(menu, recentTokens);
    const tasteMatched = Boolean(preferredTaste && tasteTags.includes(preferredTaste));
    const mealTimeMatched = Boolean(mealTime && mealTimeTags.includes(mealTime));
    let budgetMatched = false;

    if (preferredTaste) score += tasteMatched ? 8 : 0;
    if (mealTime) score += mealTimeMatched ? 5 : 0;

    if (budgetLimit != null && typeof menu.estimatedPrice === "number") {
      if (menu.estimatedPrice <= budgetLimit) {
        score += 5;
        budgetMatched = true;
      } else {
        score -= Math.min(8, Math.ceil((menu.estimatedPrice - budgetLimit) / 5000) * 2);
      }
    }

    if (recentPenalty) score -= 6;
    if (menu.estimatedPrice == null) score += 1;
    if (menu.needsVerification) score -= 0.5;

    return {
      ...menu,
      score,
      priceNeedsVerification: menu.estimatedPrice == null,
      reason: buildReason({
        menu,
        budgetMatched,
        tasteMatched,
        mealTimeMatched,
        recentPenalty
      }),
      _index: index
    };
  });

  return scored
    .sort((a, b) => b.score - a.score || a._index - b._index)
    .slice(0, 3)
    .map(({ _index, ...menu }) => menu);
}

export function formatPrice(price?: number | null) {
  if (typeof price !== "number") return "가격 확인 필요";
  return `${price.toLocaleString("ko-KR")}원`;
}

export function getPreviewMenus() {
  return menus
    .filter((menu) => menu.restaurantName && menu.menuName)
    .slice(0, 3);
}
