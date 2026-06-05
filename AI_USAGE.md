# AI Usage Report

## 1. AI Tools Used

- ChatGPT: project planning, service design review, documentation drafting, and code explanation
- Codex: AI-assisted implementation and revision of the Next.js project
- GitHub: repository management and final file organization

The running service does not use an external AI API. The final MVP uses local data and rule-based logic.

## 2. Project Summary

메오티 is a food decision support web service for KENTECH students and people around Bitgaram Innovation City. The service helps users reduce the time spent choosing food by using local menu data and transparent rule-based recommendation logic.

The final MVP includes three main features:

1. Situation-based menu recommendation
2. Food roulette for group menu decisions
3. Food price ladder game for a fun group decision after eating

## 3. Tasks Supported by AI

AI tools supported the following tasks:

- Brainstorming the service idea
- Defining target users and user scenarios
- Designing the service flow
- Creating the initial Next.js project structure
- Implementing Tailwind CSS UI layouts
- Implementing the recommendation page
- Designing the local JSON menu data structure
- Implementing rule-based filtering and scoring
- Improving natural-language situation parsing
- Adding the food roulette page
- Adding the food ladder page
- Reviewing edge cases and warning messages
- Drafting and revising README.md
- Drafting and revising AI_USAGE.md
- Checking the project against the final project rubric

## 4. Representative Prompts

1. "Build a working MVP of 메오티, a condition-based food recommendation web service."
2. "Use the provided menu dataset as the real MVP dataset."
3. "Do not integrate an AI API in the MVP. Use local data and rule-based recommendation logic."
4. "Implement recommendMenus() with disliked foods, budget, preferred taste, meal time, and recent meals."
5. "Improve the recommendation page so users can enter their situation in natural Korean text and automatically apply the extracted conditions."
6. "Add a food roulette page where users can input several menu candidates and randomly receive a Top 3 ranking."
7. "Add a ladder game page where friends can enter participants and total food price, then randomly select one result."
8. "Update README so it reflects all final features and matches the final project rubric."
9. "Evaluate the GitHub project based on the Introduction to AI final project grading criteria."

## 5. AI Outputs We Modified

AI-generated outputs were reviewed and modified before being included in the final project. Important modifications include:

- The service scope was narrowed to a realistic MVP using local JSON data instead of an external AI API.
- The recommendation logic was changed to transparent rule-based scoring so the team can explain how each result is produced.
- Natural-language parsing was adjusted to separate disliked foods from recently eaten foods.
- Disliked foods are used as exclusion conditions, while recently eaten foods reduce the score instead of being fully removed.
- The recommendation result was changed to select from a small top candidate pool so repeated recommendations are not always identical.
- Menu cards were revised to show restaurant name, menu name, estimated price, location, image, and recommendation reason.
- Image fallback behavior was added so broken image links do not visually break the result card.
- Google Maps search links were added as simple external search links, not as a full map API integration.
- Food roulette was added as a separate group menu decision feature.
- The ladder game was added as a separate entertainment feature.
- README.md was updated to reflect the final routes, service flow, core files, limitations, and future improvements.
- Documentation was revised to clearly state that the MVP does not use a live database or an LLM API.

## 6. Validation and Debugging

The following checks were used or prepared during development:

- Checked that package.json includes dev, build, start, and lint scripts.
- Ran or prepared local execution with npm install and npm run dev.
- Used npm run build to check compilation.
- Used npm run lint to check common code issues.
- Manually tested realistic Korean input examples on the recommendation page.
- Checked edge cases such as empty input, unknown price, missing image, too few roulette candidates, and too few ladder participants.
- Reviewed README.md and AI_USAGE.md so the documented features match the implemented routes.

## 7. Core Files We Can Explain

- src/app/page.tsx: Home page, service introduction, and main navigation
- src/app/recommend/page.tsx: User input form, natural-language condition application, and recommendation result display
- src/app/roulette/page.tsx: Food roulette feature, candidate parsing, random Top 3 selection, and local menu matching
- src/app/ladder/page.tsx: Participant parsing, random ladder generation, path tracing, and result display
- src/app/about/page.tsx: Service purpose, data scope, limitations, and future work
- src/lib/recommendation.ts: Natural-language parsing, disliked-food filtering, scoring, sorting, and recommendation reason generation
- data/menus.json: Local menu dataset used by the recommendation and roulette features
- README.md: Project overview, user scenario, service flow, setup guide, core files, limitations, and future improvements
- AI_USAGE.md: Explanation of how AI tools were used, modified, and verified
- package.json: Project dependencies and execution scripts

## 8. What We Learned

- AI-assisted coding is useful for generating a first version quickly, but the output must be reviewed and adapted to the actual service scenario.
- A service does not need an external AI API to provide meaningful value if the user flow and rule-based logic are clear.
- Local JSON data is enough for a small academic MVP, but data reliability and update limitations must be documented.
- Recommendation systems require explicit assumptions about filtering, scoring, randomness, and edge-case behavior.
- Documentation must be updated whenever the implemented service changes.
- The team must understand the final code structure, not only the AI prompts used to create it.

## 9. AI Usage Limitation

The running web service does not send user input to ChatGPT, OpenAI, Gemini, or any other external AI API. All recommendation outputs are produced locally using menu data and manually designed logic. This makes the MVP easier to explain and safer for a class demo, but it also means the recommendation explanation is less flexible than a real LLM-powered service.
