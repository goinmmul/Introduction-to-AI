const foods = [
    { emoji: "🍜", className: "left-[6%] top-[16%] text-6xl rotate-[-12deg]" },
    { emoji: "🍱", className: "right-[8%] top-[18%] text-7xl rotate-[10deg]" },
    { emoji: "🥘", className: "left-[12%] bottom-[18%] text-7xl rotate-[8deg]" },
    { emoji: "🍛", className: "right-[14%] bottom-[16%] text-6xl rotate-[-10deg]" },
    { emoji: "🥗", className: "left-[42%] top-[10%] text-5xl rotate-[14deg]" },
    { emoji: "🥟", className: "right-[38%] bottom-[8%] text-5xl rotate-[-8deg]" },
];

export default function FoodBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />
            <div className="absolute -right-28 top-40 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-red-100/50 blur-3xl" />

            {foods.map((food) => (
                <span
                    key={food.emoji + food.className}
                    className={`absolute select-none opacity-10 ${food.className}`}
                >
                    {food.emoji}
                </span>
            ))}
        </div>
    );
}