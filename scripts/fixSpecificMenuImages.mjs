import fs from "fs";

const MENU_FILE = "data/menus.json";

function commons(fileName) {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
        fileName
    )}?width=900`;
}

const fixes = {
    // 물냉면
    m019: {
        imageUrl: commons("Korean.noodles-Mul.naengmyeon-01.jpg"),
        imageAlt: "물냉면 사진",
        imageSourceLabel: "Wikimedia Commons",
        imageCreditUrl:
            "https://commons.wikimedia.org/wiki/File:Korean.noodles-Mul.naengmyeon-01.jpg",
    },

    // 숙성 삼겹살
    m015: {
        imageUrl: commons("Samgyeopsal-gui.jpg"),
        imageAlt: "삼겹살 사진",
        imageSourceLabel: "Wikimedia Commons",
        imageCreditUrl:
            "https://commons.wikimedia.org/wiki/File:Samgyeopsal-gui.jpg",
    },

    // 삼겹살
    m020: {
        imageUrl: commons("Samgyeopsal-gui.jpg"),
        imageAlt: "삼겹살 사진",
        imageSourceLabel: "Wikimedia Commons",
        imageCreditUrl:
            "https://commons.wikimedia.org/wiki/File:Samgyeopsal-gui.jpg",
    },

    // 명란파밥
    m022: {
        imageUrl: commons("Myeongnanjeot (pollock roe).jpg"),
        imageAlt: "명란파밥의 재료인 명란젓 사진",
        imageSourceLabel: "Wikimedia Commons",
        imageCreditUrl:
            "https://commons.wikimedia.org/wiki/File:Myeongnanjeot_(pollock_roe).jpg",
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

console.log("Fixed specific menu images:", Object.keys(fixes).join(", "));