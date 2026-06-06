import fs from "fs";

const MENU_FILE = "data/menus.json";
const CHECKED_AT = "2026-06-07";

function commons(fileName) {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
        fileName
    )}?width=900`;
}

function commonsCredit(fileName) {
    return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(
        fileName
    )}`;
}

function imageData({ imageUrl, imageAlt, imageSourceLabel, imageCreditUrl }) {
    return {
        imageUrl,
        imageAlt,
        imageSourceLabel,
        imageCreditUrl,
        imageLastCheckedAt: CHECKED_AT,
    };
}

function commonsImage(fileName, imageAlt) {
    return imageData({
        imageUrl: commons(fileName),
        imageAlt,
        imageSourceLabel: "Wikimedia Commons",
        imageCreditUrl: commonsCredit(fileName),
    });
}

function unsplashImage(url, imageAlt) {
    return imageData({
        imageUrl: url,
        imageAlt,
        imageSourceLabel: "Unsplash representative food image",
        imageCreditUrl: "https://unsplash.com/license",
    });
}

function sourcedImage(url, imageAlt, imageSourceLabel, imageCreditUrl) {
    return imageData({
        imageUrl: url,
        imageAlt,
        imageSourceLabel,
        imageCreditUrl,
    });
}

const UNSPLASH = {
    steak:
        "https://images.unsplash.com/photo-1558030137-a56c1b004fa3?auto=format&fit=crop&w=900&q=80",
    salmon:
        "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=900&q=80",
    pasta:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
    friedRice:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    sushi:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80",
    grilledMeat:
        "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80",
    riceBowl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    seafood:
        "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
    noodles:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
    spicyNoodles:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80",
    soup:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80",
    koreanTable:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
};

const SOURCED_IMAGES = {
    galmaegisal: "https://bbq.gokiseok.com/images/menu-galmaegi.png",
    yeomsoTang:
        "https://www.everybunnyeats.com/wp-content/uploads/2018/06/GoatSoup_Reg.jpg",
};

const imageUpdates = {
    // 이화원
    m001: commonsImage("Jajangmyeon.jpg", "자장면 사진"),
    m002: commonsImage("Jjampong.JPG", "짬뽕 사진"),
    m003: unsplashImage(
        UNSPLASH.friedRice,
        "게살 볶음밥과 비슷한 볶음밥 사진"
    ),

    // 2046팬스테이크 나주혁신점
    m004: unsplashImage(UNSPLASH.steak, "팬스테이크 사진"),
    m005: unsplashImage(UNSPLASH.steak, "스테이크 사진"),
    m006: unsplashImage(UNSPLASH.salmon, "연어 스테이크 사진"),

    // 어나더키친 나주혁신점
    m007: unsplashImage(UNSPLASH.pasta, "새우 크림 파스타 사진"),
    m008: unsplashImage(UNSPLASH.pasta, "쉬림프 로제 파스타 사진"),
    m009: unsplashImage(UNSPLASH.friedRice, "필라프 사진"),

    // 큰집나주곰탕
    m010: commonsImage("Gomtang.jpg", "곰탕 사진"),
    m011: commonsImage("Gomtang.jpg", "수육곰탕과 비슷한 곰탕 사진"),

    // 효비초밥
    m012: unsplashImage(UNSPLASH.sushi, "초밥 세트 사진"),
    m013: unsplashImage(UNSPLASH.sushi, "모둠초밥 사진"),
    m014: unsplashImage(UNSPLASH.sushi, "특선초밥 사진"),

    // 일품왕소금구이 나주점
    m015: commonsImage("Samgyeopsal-gui.jpg", "삼겹살 사진"),
    m016: commonsImage("Doenjang-jjigae.jpg", "된장찌개 사진"),

    // 꾸석지돌판한우 나주혁신도시점
    m017: commonsImage(
        "Yukhoe-bibimbap (32013698315).jpg",
        "육회비빔밥 사진"
    ),
    m018: commonsImage("Bibimbap.jpg", "비빔밥 사진"),
    m019: commonsImage(
        "Korean.noodles-Mul.naengmyeon-01.jpg",
        "물냉면 사진"
    ),

    // 육온담
    m020: commonsImage("Samgyeopsal-gui.jpg", "삼겹살 사진"),
    m021: sourcedImage(
        SOURCED_IMAGES.galmaegisal,
        "갈매기살 사진",
        "Gokiseok menu image",
        "https://bbq.gokiseok.com/en"
    ),
    m022: commonsImage(
        "Myeongnanjeot (pollock roe).jpg",
        "명란파밥의 재료인 명란젓 사진"
    ),

    // 나주목초밥 나주본점
    m023: unsplashImage(UNSPLASH.sushi, "모둠초밥 사진"),
    m024: commonsImage("Tonkatsu.jpg", "돈가스 사진"),

    // 미미아구찜
    m025: commonsImage("Agujjim.jpg", "아귀찜 사진"),
    m026: unsplashImage(UNSPLASH.friedRice, "볶음밥 사진"),

    // 정희 나주혁신도시점
    m027: commonsImage("Sujebi.jpg", "수제비 사진"),
    m028: commonsImage("Korean cuisine-Ssambap-01.jpg", "쌈밥 사진"),
    m029: commonsImage("Yukhoe.jpg", "육회 사진"),

    // 제주밥상
    m030: commonsImage("Jeyuk-bokkeum.jpg", "제육볶음 사진"),
    m031: commonsImage(
        "Korean.cuisine-Kimchi jjigae-01.jpg",
        "흑돼지 짜글이와 비슷한 김치찌개 사진"
    ),

    // 현풍닭칼국수 나주혁신점 - 닭칼국수
    m032: unsplashImage(
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80",
        "닭칼국수와 비슷한 국물 칼국수 사진"
    ),

    // 현풍닭칼국수 나주혁신점 - 얼큰닭칼국수
    m033: unsplashImage(
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80",
        "얼큰닭칼국수와 비슷한 국물 칼국수 사진"
    ),
    m034: commonsImage("Samgyetang.jpg", "삼계탕 사진"),

    // 솔솥 나주혁신점
    m035: unsplashImage(UNSPLASH.riceBowl, "솥밥과 비슷한 밥 사진"),
    m036: unsplashImage(UNSPLASH.riceBowl, "육해풍미솥과 비슷한 솥밥 사진"),

    // 해탄 나주혁신도시점
    m037: unsplashImage(
        UNSPLASH.seafood,
        "해탄한상과 비슷한 해산물 요리 사진"
    ),
    m038: commonsImage("Ojingeo-bokkeum.jpg", "오징어볶음 사진"),
    m039: commonsImage(
        "Haemulkalguksu (seafood kalguksu).jpg",
        "백합칼국수와 비슷한 해물칼국수 사진"
    ),

    // 소 키우는 배보삼춘 나주혁신도시점
    m040: commonsImage(
        "Yukhoe-bibimbap (32013698315).jpg",
        "육회비빔밥 사진"
    ),
    m041: unsplashImage(
        UNSPLASH.grilledMeat,
        "한우 구이와 비슷한 소고기 구이 사진"
    ),

    // 무등산염소탕
    m124: sourcedImage(
        SOURCED_IMAGES.yeomsoTang,
        "염소탕 사진",
        "Everybunny Eats recipe image",
        "https://www.everybunnyeats.com/yeomso-tang-korean-goat-stew/"
    ),

    // 은행나무갈매기 빛가람점
    m137: sourcedImage(
        SOURCED_IMAGES.galmaegisal,
        "갈매기살 사진",
        "Gokiseok menu image",
        "https://bbq.gokiseok.com/en"
    ),
};

const raw = fs.readFileSync(MENU_FILE, "utf-8");
const menus = JSON.parse(raw);

const updatedMenus = menus.map((menu) => {
    const update = imageUpdates[menu.id];

    if (!update) {
        return {
            ...menu,
            imageUrl: UNSPLASH.koreanTable,
            imageAlt: `${menu.menuName ?? "음식"} 대표 이미지`,
            imageSourceLabel: "Unsplash representative food image",
            imageCreditUrl: "https://unsplash.com/license",
            imageLastCheckedAt: CHECKED_AT,
        };
    }

    return {
        ...menu,
        ...update,
    };
});

fs.writeFileSync(MENU_FILE, JSON.stringify(updatedMenus, null, 2) + "\n");

console.log(
    `Updated ${updatedMenus.length} menu images with fixed manual mapping.`
);
