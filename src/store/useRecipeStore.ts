import { create } from "zustand";

export interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: string;
  calories: number;
  image: string;
  tags: string[];
  missingIngredients: string[];
  steps: { instruction: string; time: string }[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
}

interface RecipeStore {
  scannedIngredients: Ingredient[];
  recipes: Recipe[];
  savedRecipes: Recipe[];
  shoppingList: ShoppingItem[];
  addIngredient: (item: { name: string; quantity?: string }) => void;
  removeIngredient: (id: string) => void;
  addToShoppingList: (name: string) => void;
  removeFromShoppingList: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  clearShoppingList: () => void;
  setRecipes: (recipes: Recipe[]) => void;
  saveRecipe: (recipe: Recipe) => void;
  removeSavedRecipe: (id: string) => void;
}

const PLACEHOLDER_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Terracotta Roasted Veggie Bowl",
    description: "A hearty and healthy bowl packed with roasted sweet potatoes, broccoli, and a drizzle of rich tahini dressing.",
    difficulty: "Medium",
    prepTime: "25 min",
    calories: 450,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2340&auto=format&fit=crop",
    tags: ["Vegetarian", "Healthy"],
    missingIngredients: ["Quinoa", "Tahini"],
    steps: [
      { instruction: "Preheat the oven to 400°F (200°C).", time: "5 min" },
      { instruction: "Chop the sweet potatoes, broccoli, and red onions.", time: "10 min" },
      { instruction: "Toss vegetables in olive oil, salt, pepper, and paprika.", time: "2 min" },
      { instruction: "Roast until golden and tender.", time: "20 min" },
      { instruction: "Serve over cooked quinoa and drizzle with tahini dressing.", time: "3 min" }
    ],
  },
  {
    id: "2",
    title: "Garlic Butter Steak Bites",
    description: "Tender, juicy sirloin steak cubes seared to perfection and tossed in a rich, aromatic garlic herb butter.",
    difficulty: "Easy",
    prepTime: "15 min",
    calories: 600,
    image: "https://images.unsplash.com/photo-1544025162-d76f60b52c00?q=80&w=2338&auto=format&fit=crop",
    tags: ["Keto", "High Protein"],
    missingIngredients: ["Sirloin Steak"],
    steps: [
      { instruction: "Cut the steak into bite-sized cubes.", time: "5 min" },
      { instruction: "Heat a large skillet over high heat with olive oil.", time: "3 min" },
      { instruction: "Add steak cubes and sear per side.", time: "4 min" },
      { instruction: "Reduce heat, add butter, minced garlic, and rosemary.", time: "1 min" },
      { instruction: "Baste the steak with the garlic butter.", time: "1 min" }
    ],
  },
  {
    id: "3",
    title: "Creamy Tomato Basil Soup",
    description: "A comforting classic made with crushed tomatoes, infused with fresh basil, and finished with heavy cream.",
    difficulty: "Easy",
    prepTime: "20 min",
    calories: 320,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2340&auto=format&fit=crop",
    tags: ["Comfort Food", "Vegetarian"],
    missingIngredients: ["Heavy Cream", "Fresh Basil"],
    steps: [
      { instruction: "Sauté diced onions and crushed garlic in olive oil until soft.", time: "5 min" },
      { instruction: "Add crushed tomatoes, vegetable broth, and a pinch of sugar.", time: "2 min" },
      { instruction: "Simmer to let flavors meld.", time: "15 min" },
      { instruction: "Stir in heavy cream and chopped fresh basil.", time: "1 min" },
      { instruction: "Blend until smooth and serve warm.", time: "2 min" }
    ],
  }
];

export const useRecipeStore = create<RecipeStore>((set) => ({
  scannedIngredients: [],
  recipes: PLACEHOLDER_RECIPES,
  savedRecipes: [],
  shoppingList: [
    { id: "s1", name: "Sirloin Steak", checked: false },
    { id: "s2", name: "Fresh Basil", checked: true },
  ],
  addIngredient: ({ name, quantity }) =>
    set((state) => ({
      scannedIngredients: [
        ...state.scannedIngredients,
        { id: Math.random().toString(), name, quantity },
      ],
    })),
  removeIngredient: (id) =>
    set((state) => ({
      scannedIngredients: state.scannedIngredients.filter((i) => i.id !== id),
    })),
  addToShoppingList: (name) =>
    set((state) => {
      // Avoid duplicates
      if (state.shoppingList.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
        return state;
      }
      return {
        shoppingList: [
          ...state.shoppingList,
          { id: Math.random().toString(), name, checked: false },
        ],
      };
    }),
  removeFromShoppingList: (id) =>
    set((state) => ({
      shoppingList: state.shoppingList.filter((item) => item.id !== id),
    })),
  toggleShoppingItem: (id) =>
    set((state) => ({
      shoppingList: state.shoppingList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    })),
  clearShoppingList: () => set({ shoppingList: [] }),
  setRecipes: (recipes) => set({ recipes }),
  saveRecipe: (recipe) =>
    set((state) => {
      // Avoid duplicate saves by checking title
      if (state.savedRecipes.some((r) => r.title === recipe.title)) return state;
      return { savedRecipes: [...state.savedRecipes, recipe] };
    }),
  removeSavedRecipe: (id) =>
    set((state) => ({
      savedRecipes: state.savedRecipes.filter((r) => r.id !== id),
    })),
}));
