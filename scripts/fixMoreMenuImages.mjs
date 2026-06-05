import fs from "fs";

const MENU_FILE = "data/menus.json";

const fixes = {
    // 2046팬스테이크 - 팬 스테이크 170g
    m004: {
        imageUrl:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
        imageAlt: "스테이크 사진",
        imageSourceLabel: "Unsplash representative food image",
        imageCreditUrl: "https://unsplash.com/license",
        fallbackImageUrl:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    },

    // 2046팬스테이크 - 스테이크 메뉴
    m005: {
        imageUrl:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
        imageAlt: "스테이크 사진",
        imageSourceLabel: "Unsplash representative food image",
        imageCreditUrl: "https://unsplash.com/license",
        fallbackImageUrl:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    },

    // 2046팬스테이크 - 연어 스테이크
    m006: {
        imageUrl:
            "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=900&q=80",
        imageAlt: "연어 스테이크 사진",
        imageSourceLabel: "Unsplash representative food image",
        imageCreditUrl: "https://unsplash.com/license",
        fallbackImageUrl:
            "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=900&q=80",
    },

    // 육온담 - 갈매기살
    m021: {
        imageUrl:
            "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80",
        imageAlt: "갈매기살과 비슷한 돼지고기 구이 사진",
        imageSourceLabel: "Unsplash representative food image",
        imageCreditUrl: "https://unsplash.com/license",
        fallbackImageUrl:
            "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80",
    },

    // 정희 - 고사리 크림 수제비
    m027: {
        imageUrl:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Sujebi.jpg?width=900",
        imageAlt: "수제비 사진",
        imageSourceLabel: "Wikimedia Commons",
        imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Sujebi.jpg",
        fallbackImageUrl:
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80",
    },

    // 제주밥상 - 흑돼지제육볶음
    m030: {
        imageUrl:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Jeyuk-bokkeum.jpg?width=900",
        imageAlt: "제육볶음 사진",
        imageSourceLabel: "Wikimedia Commons",
        imageCreditUrl:
            "https://commons.wikimedia.org/wiki/File:Jeyuk-bokkeum.jpg",
        fallbackImageUrl:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    },
};

const raw = fs.readFileSync(MENU_FILE, "utf-8");
const menus = JSON.parse(raw);

const updatedMenus = menus.map((menu) => {
    const fix = fixes[menu.id];

    if (!fix) return menu;

    return {
        ...menu,
        ...fix,
        imageLastCheckedAt: "2026-06-05",
    };
});

fs.writeFileSync(MENU_FILE, JSON.stringify(updatedMenus, null, 2) + "\n");

console.log("Fixed more menu images:", Object.keys(fixes).join(", "));