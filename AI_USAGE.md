# AI_USAGE

## 1. AI Tools Used

- ChatGPT/Codex was used as a coding assistant to scaffold and implement the MVP.
- No AI API is integrated into the running web service.

## 2. Tasks Supported by AI

- Next.js project structure setup
- Tailwind CSS UI implementation
- Rule-based recommendation logic design
- README and project documentation drafting
- Edge case handling review

## 3. Representative Prompts

- "Build a working MVP of 메오티, a condition-based food recommendation web service."
- "Use the provided menu dataset as the real MVP dataset."
- "Do not integrate an AI API in the MVP."
- "Implement recommendMenus() with disliked foods, budget, preferred taste, meal time, and recent meals."

## 4. AI Outputs Modified

AI-generated code should be reviewed and modified by the project author before submission. Important areas to verify include Korean copy, menu data correctness, scoring weights, and UI behavior on mobile screens.

## 5. Core Files We Can Explain

- `src/app/page.tsx`: Home page with hero, How It Works section, preview cards, and data note
- `src/app/recommend/page.tsx`: Client-side form and recommendation result display
- `src/app/about/page.tsx`: Service explanation, data scope, MVP limitations, and future improvements
- `src/lib/recommendation.ts`: Rule-based filtering, scoring, sorting, and recommendation reason generation
- `data/menus.json`: Local menu dataset used by the MVP
- `README.md`: Project overview, setup, data usage, limitations, and warnings
- `AI_USAGE.md`: AI assistance disclosure and explainable file list

## 6. What We Learned

- A useful MVP can avoid external AI APIs and still demonstrate recommendation behavior with transparent rules.
- Local JSON is enough for a small academic demo if the data format is stable.
- Null or uncertain data should be shown safely instead of causing crashes.
- Recommendation systems need clear assumptions about filtering, scoring, and limitations.
