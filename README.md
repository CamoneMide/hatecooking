# 🍽️ HateCooking

> **Stop staring at your fridge. Let AI do the thinking.**

HateCooking is an AI-powered mobile app built with Expo & React Native. Snap a photo of your fridge (or manually list your ingredients) and Google Gemini will instantly generate personalized, delicious recipes you can actually make — right now.

---

## ✨ Features

- 📸 **Fridge Scanner** — Take a photo or upload from your gallery; Gemini AI identifies all visible ingredients automatically
- 🍳 **AI Recipe Generation** — Get 5 tailored recipes based on what you have, complete with steps, calories, and prep times
- 🧑‍🍳 **Immersive Cooking Mode** — Step-by-step fullscreen cooking experience with a progress bar and per-step timers
- 🔊 **Text-to-Speech** — Have each step read aloud so you never have to touch your screen with messy hands
- 🛒 **Smart Shopping List** — Missing an ingredient? Add it to your shopping list with one tap
- 🔖 **Save Recipes** — Bookmark your favourites for later
- 🖼️ **Graceful Image Fallbacks** — If an AI-generated thumbnail fails to load, a contextual emoji is shown instead

---

## 🛠 Tech Stack

| Layer      | Technology                                                                  |
| ---------- | --------------------------------------------------------------------------- |
| Framework  | [Expo](https://expo.dev) ~54 / [React Native](https://reactnative.dev) 0.81 |
| Language   | TypeScript ~5.9                                                             |
| Navigation | [Expo Router](https://expo.dev/router) v6 (file-based)                      |
| AI         | [Google Gemini](https://ai.google.dev) (`gemini-flash-latest`)              |
| Styling    | [NativeWind](https://www.nativewind.dev) v4 + Tailwind CSS v3               |
| State      | [Zustand](https://zustand-demo.pmnd.rs) v5                                  |
| Lists      | [@shopify/flash-list](https://shopify.github.io/flash-list)                 |
| Images     | [expo-image](https://docs.expo.dev/versions/latest/sdk/image)               |
| Icons      | [lucide-react-native](https://lucide.dev)                                   |
| Fonts      | DM Sans · Outfit (via `@expo-google-fonts`)                                 |
| Camera     | expo-camera · expo-image-picker                                             |
| Speech     | expo-speech                                                                 |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- [Expo Go](https://expo.dev/go) on your physical device, **or** an Android/iOS simulator

### 1. Clone the repository

```bash
git clone https://github.com/CamoneMide/hatecooking.git
cd hatecooking
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

> Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Start the development server

```bash
npx expo start --clear
```

Then scan the QR code with **Expo Go**, or press:

- `a` — open Android emulator
- `i` — open iOS simulator

---

## 📁 Project Structure

```
hatecooking/
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx        # Scan & ingredient management screen
│   │   │   ├── recipes.tsx      # Generated recipes list
│   │   │   ├── saved.tsx        # Saved/bookmarked recipes
│   │   │   └── shopping.tsx     # Shopping list
│   │   └── recipe/
│   │       └── [id].tsx         # Recipe detail + cooking mode
│   ├── components/
│   │   ├── RecipeCard.tsx       # Recipe card with image/emoji fallback
│   │   ├── IngredientCard.tsx   # Scanned ingredient item
│   │   └── IngredientChip.tsx   # Compact ingredient pill
│   ├── store/
│   │   └── useRecipeStore.ts    # Zustand global state
│   └── utils/
│       ├── gemini.ts            # Gemini AI integration (fridge scan + recipe gen)
│       └── emojis.ts            # Emoji fallback lookup for recipe thumbnails
├── assets/                      # App icons and splash screens
├── .env                         # 🔒 Local only — never commit this
├── app.json
├── babel.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔑 Environment Variables

| Variable                     | Required | Description                |
| ---------------------------- | -------- | -------------------------- |
| `EXPO_PUBLIC_GEMINI_API_KEY` | ✅ Yes   |
| `EXPO_PUBLIC_GEMINI_API_KEY` | ✅ Yes   | Your Google Gemini API key |

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

## 📜 Available Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Start on Android emulator
npm run ios        # Start on iOS simulator
npm run web        # Start in browser (Expo web)
npm run lint       # Run ESLint
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
