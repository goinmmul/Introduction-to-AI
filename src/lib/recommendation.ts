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
};

export type RecommendationInput = {
  dislikedFoods?: string;
  budget?: string;
  preferredTaste?: string;
  mealTime?: string;
  recentMeals?: string;
};

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
