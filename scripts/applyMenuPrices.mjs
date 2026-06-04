import fs from "fs";

const MENU_FILE = "data/menus.json";
const CHECKED_AT = "2026-06-05";

function getPriceRange(price) {
    if (price <= 10000) return "under10000";
    if (price <= 15000) return "10000to15000";
    return "over15000";
}

function priceData({
    estimatedPrice,
    listedPrice,
    servingSize,
    sourceLabel = "manual menu price data",
    confidence = "manual_estimate",
}) {
    return {
        estimatedPrice,
        ...(listedPrice ? { listedPrice } : {}),
        ...(servingSize ? { servingSize } : {}),
        priceRange: getPriceRange(estimatedPrice),
        priceSourceLabel: sourceLabel,
        priceLastCheckedAt: CHECKED_AT,
        priceConfidence: confidence,
        needsVerification: true,
    };
}

const priceUpdates = {
    // 이화원
    m001: priceData({
        estimatedPrice: 10000,
        sourceLabel: "web/menu reference",
        confidence: "web_reference",
    }),
    m002: priceData({
        estimatedPrice: 11000,
        sourceLabel: "web/menu reference",
        confidence: "web_reference",
    }),
    m003: priceData({
        estimatedPrice: 11000,
        sourceLabel: "web/menu reference",
        confidence: "web_reference",
    }),

    // 2046팬스테이크 나주혁신점
    m004: priceData({
        estimatedPrice: 14900,
        sourceLabel: "manual estimate based on steak menu range",
        confidence: "manual_estimate",
    }),
    m005: priceData({
        estimatedPrice: 18900,
        sourceLabel: "manual estimate based on steak menu range",
        confidence: "manual_estimate",
    }),
    m006: priceData({
        estimatedPrice: 16900,
        sourceLabel: "manual estimate based on salmon steak menu range",
        confidence: "manual_estimate",
    }),

    // 어나더키친 나주혁신점
    m007: priceData({
        estimatedPrice: 17900,
        sourceLabel: "manual estimate based on pasta menu range",
        confidence: "manual_estimate",
    }),
    m008: priceData({
        estimatedPrice: 16900,
        sourceLabel: "manual estimate based on pasta menu range",
        confidence: "manual_estimate",
    }),
    m009: priceData({
        estimatedPrice: 16900,
        sourceLabel: "manual estimate based on pilaf menu range",
        confidence: "manual_estimate",
    }),

    // 큰집나주곰탕
    m010: priceData({
        estimatedPrice: 12000,
        sourceLabel: "web/menu reference",
        confidence: "web_reference",
    }),
    m011: priceData({
        estimatedPrice: 15000,
        sourceLabel: "web/menu reference",
        confidence: "web_reference",
    }),

    // 효비초밥
    m012: priceData({
        estimatedPrice: 12000,
        sourceLabel: "manual estimate based on sushi lunch set range",
        confidence: "manual_estimate",
    }),
    m013: priceData({
        estimatedPrice: 13000,
        sourceLabel: "manual estimate based on sushi menu range",
        confidence: "manual_estimate",
    }),
    m014: priceData({
        estimatedPrice: 18000,
        sourceLabel: "manual estimate based on special sushi menu range",
        confidence: "manual_estimate",
    }),

    // 일품왕소금구이 나주점
    m015: priceData({
        estimatedPrice: 10500,
        sourceLabel: "web/menu reference",
        confidence: "web_reference",
    }),
    m016: priceData({
        estimatedPrice: 5000,
        listedPrice: 10000,
        servingSize: "2인",
        sourceLabel: "web/menu reference, per-person estimate",
        confidence: "web_reference",
    }),

    // 꾸석지돌판한우 나주혁신도시점
    m017: priceData({
        estimatedPrice: 7800,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),
    m018: priceData({
        estimatedPrice: 9800,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),
    m019: priceData({
        estimatedPrice: 5800,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),

    // 육온담
    m020: priceData({
        estimatedPrice: 15000,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),
    m021: priceData({
        estimatedPrice: 16000,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),
    m022: priceData({
        estimatedPrice: 5500,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),

    // 나주목초밥 나주본점
    m023: priceData({
        estimatedPrice: 24000,
        listedPrice: 48000,
        servingSize: "2인",
        sourceLabel: "existing project price reference, per-person estimate",
        confidence: "existing_reference",
    }),
    m024: priceData({
        estimatedPrice: 11000,
        sourceLabel: "manual estimate based on pork cutlet menu range",
        confidence: "manual_estimate",
    }),

    // 미미아구찜
    m025: priceData({
        estimatedPrice: 17000,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),
    m026: priceData({
        estimatedPrice: 3500,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),

    // 정희 나주혁신도시점
    m027: priceData({
        estimatedPrice: 13900,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),
    m028: priceData({
        estimatedPrice: 10900,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),
    m029: priceData({
        estimatedPrice: 11900,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),

    // 제주밥상
    m030: priceData({
        estimatedPrice: 9900,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),
    m031: priceData({
        estimatedPrice: 14000,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),

    // 현풍닭칼국수 나주혁신점
    m032: priceData({
        estimatedPrice: 9000,
        sourceLabel: "manual estimate based on chicken noodle soup range",
        confidence: "manual_estimate",
    }),
    m033: priceData({
        estimatedPrice: 10000,
        sourceLabel: "manual estimate based on spicy chicken noodle soup range",
        confidence: "manual_estimate",
    }),
    m034: priceData({
        estimatedPrice: 11000,
        sourceLabel: "manual estimate based on samgye chicken noodle soup range",
        confidence: "manual_estimate",
    }),

    // 솔솥 나주혁신점
    m035: priceData({
        estimatedPrice: 21200,
        listedPrice: 42400,
        servingSize: "2인",
        sourceLabel: "existing project price reference, per-person estimate",
        confidence: "existing_reference",
    }),
    m036: priceData({
        estimatedPrice: 25100,
        listedPrice: 50200,
        servingSize: "2인",
        sourceLabel: "existing project price reference, per-person estimate",
        confidence: "existing_reference",
    }),

    // 해탄 나주혁신도시점
    m037: priceData({
        estimatedPrice: 59000,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),
    m038: priceData({
        estimatedPrice: 12000,
        sourceLabel: "manual estimate based on squid menu range",
        confidence: "manual_estimate",
    }),
    m039: priceData({
        estimatedPrice: 10000,
        sourceLabel: "manual estimate based on kalguksu menu range",
        confidence: "manual_estimate",
    }),

    // 소 키우는 배보삼춘 나주혁신도시점
    m040: priceData({
        estimatedPrice: 10000,
        sourceLabel: "existing project price reference",
        confidence: "existing_reference",
    }),
    m041: priceData({
        estimatedPrice: 25000,
        sourceLabel: "manual estimate based on hanwoo grill menu range",
        confidence: "manual_estimate",
    }),
};

function applyPriceUpdates() {
    const raw = fs.readFileSync(MENU_FILE, "utf-8");
    const menus = JSON.parse(raw);

    const missingUpdates = menus
        .map((menu) => menu.id)
        .filter((id) => !priceUpdates[id]);

    const unusedUpdates = Object.keys(priceUpdates).filter(
        (id) => !menus.some((menu) => menu.id === id)
    );

    const updatedMenus = menus.map((menu) => {
        const update = priceUpdates[menu.id];

        if (!update) {
            return {
                ...menu,
                priceLastCheckedAt: menu.priceLastCheckedAt ?? CHECKED_AT,
                priceConfidence: "not_found",
                needsVerification: true,
            };
        }

        return {
            ...menu,
            ...update,
        };
    });

    fs.writeFileSync(MENU_FILE, JSON.stringify(updatedMenus, null, 2) + "\n");

    console.log(`Updated ${Object.keys(priceUpdates).length} menu prices.`);

    if (missingUpdates.length > 0) {
        console.log("Missing price updates for:", missingUpdates.join(", "));
    } else {
        console.log("All menu items have price update data.");
    }

    if (unusedUpdates.length > 0) {
        console.log("Unused price update ids:", unusedUpdates.join(", "));
    }
}

applyPriceUpdates();