export const getEmojiForIngredient = (ingredientName: string): string => {
  const name = ingredientName.toLowerCase();
  
  if (name.includes('egg')) return '🥚';
  if (name.includes('beef') || name.includes('steak') || name.includes('patty')) return '🥩';
  if (name.includes('chicken') || name.includes('poultry')) return '🍗';
  if (name.includes('pork') || name.includes('bacon')) return '🥓';
  if (name.includes('milk') || name.includes('cream')) return '🥛';
  if (name.includes('cheese')) return '🧀';
  if (name.includes('butter')) return '🧈';
  if (name.includes('tomato')) return '🍅';
  if (name.includes('onion')) return '🧅';
  if (name.includes('garlic')) return '🧄';
  if (name.includes('potato')) return '🥔';
  if (name.includes('carrot')) return '🥕';
  if (name.includes('broccoli')) return '🥦';
  if (name.includes('lettuce') || name.includes('salad')) return '🥗';
  if (name.includes('pepper') || name.includes('kimchi')) return '🌶️';
  if (name.includes('apple')) return '🍎';
  if (name.includes('orange')) return '🍊';
  if (name.includes('banana')) return '🍌';
  if (name.includes('lemon') || name.includes('lime')) return '🍋';
  if (name.includes('bread') || name.includes('toast')) return '🍞';
  if (name.includes('rice')) return '🍚';
  if (name.includes('noodle') || name.includes('pasta')) return '🍝';
  if (name.includes('fish') || name.includes('salmon')) return '🐟';
  if (name.includes('shrimp')) return '🦐';
  if (name.includes('water')) return '💧';
  if (name.includes('juice')) return '🧃';
  if (name.includes('sauce') || name.includes('dressing') || name.includes('ketchup')) return '🥫';
  if (name.includes('oil')) return '🫒';
  if (name.includes('spice') || name.includes('herb') || name.includes('salt')) return '🧂';

  return '🛒'; // Default emoji if no match
};
