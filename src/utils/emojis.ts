export const getEmojiForIngredient = (ingredientName: string): string => {
  const name = ingredientName.toLowerCase();

  // ── Recipe-level dish keywords (check these first) ──────────────────────
  if (name.includes('soup') || name.includes('chowder') || name.includes('bisque')) return '🍲';
  if (name.includes('burger') || name.includes('sandwich') || name.includes('wrap') || name.includes('taco') || name.includes('burrito')) return '🌮';
  if (name.includes('pizza')) return '🍕';
  if (name.includes('sushi') || name.includes('roll')) return '🍱';
  if (name.includes('curry')) return '🍛';
  if (name.includes('stir fry') || name.includes('stir-fry') || name.includes('wok')) return '🥘';
  if (name.includes('bowl') || name.includes('grain') || name.includes('veggie bowl')) return '🥗';
  if (name.includes('salad')) return '🥗';
  if (name.includes('smoothie') || name.includes('shake')) return '🥤';
  if (name.includes('cake') || name.includes('brownie') || name.includes('muffin') || name.includes('cookie') || name.includes('dessert') || name.includes('pudding')) return '🍰';
  if (name.includes('pancake') || name.includes('waffle') || name.includes('crepe')) return '🥞';
  if (name.includes('omelette') || name.includes('frittata') || name.includes('scrambled')) return '🍳';
  if (name.includes('roast') || name.includes('baked') || name.includes('grilled')) return '🍖';
  if (name.includes('steak') || name.includes('beef bites') || name.includes('patty')) return '🥩';
  if (name.includes('chicken') || name.includes('poultry') || name.includes('wing')) return '🍗';
  if (name.includes('pasta') || name.includes('spaghetti') || name.includes('linguine') || name.includes('fettuccine') || name.includes('penne') || name.includes('lasagna')) return '🍝';
  if (name.includes('noodle') || name.includes('ramen') || name.includes('pho') || name.includes('udon')) return '🍜';
  if (name.includes('rice')) return '🍚';
  if (name.includes('bread') || name.includes('toast') || name.includes('baguette')) return '🍞';
  if (name.includes('fish') || name.includes('salmon') || name.includes('tuna') || name.includes('cod') || name.includes('sea bass')) return '🐟';
  if (name.includes('shrimp') || name.includes('prawn') || name.includes('seafood') || name.includes('lobster')) return '🦐';

  // ── Individual ingredient keywords ───────────────────────────────────────
  if (name.includes('egg')) return '🥚';
  if (name.includes('pork') || name.includes('bacon') || name.includes('ham')) return '🥓';
  if (name.includes('milk') || name.includes('cream')) return '🥛';
  if (name.includes('cheese')) return '🧀';
  if (name.includes('butter')) return '🧈';
  if (name.includes('tomato')) return '🍅';
  if (name.includes('onion')) return '🧅';
  if (name.includes('garlic')) return '🧄';
  if (name.includes('potato') || name.includes('fries')) return '🥔';
  if (name.includes('carrot')) return '🥕';
  if (name.includes('broccoli')) return '🥦';
  if (name.includes('lettuce')) return '🥬';
  if (name.includes('pepper') || name.includes('kimchi') || name.includes('chili')) return '🌶️';
  if (name.includes('apple')) return '🍎';
  if (name.includes('orange')) return '🍊';
  if (name.includes('banana')) return '🍌';
  if (name.includes('lemon') || name.includes('lime')) return '🍋';
  if (name.includes('water')) return '💧';
  if (name.includes('juice')) return '🧃';
  if (name.includes('sauce') || name.includes('dressing') || name.includes('ketchup')) return '🥫';
  if (name.includes('oil') || name.includes('olive')) return '🫒';
  if (name.includes('spice') || name.includes('herb') || name.includes('salt') || name.includes('pepper')) return '🧂';
  if (name.includes('mushroom')) return '🍄';
  if (name.includes('corn') || name.includes('maize')) return '🌽';
  if (name.includes('avocado')) return '🥑';
  if (name.includes('bean') || name.includes('legume') || name.includes('lentil')) return '🫘';

  return '🍽️'; // Generic plate — better default than shopping cart
};
