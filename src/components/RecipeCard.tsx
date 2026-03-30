import { memo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Clock, Flame, ChefHat, Trash2 } from "lucide-react-native";
import { Link } from "expo-router";
import { Recipe } from "../store/useRecipeStore";
import { getEmojiForIngredient } from "../utils/emojis";

interface RecipeCardProps {
  recipe: Recipe;
  onRemove?: () => void;
}

export const RecipeCard = memo(function RecipeCard({ recipe, onRemove }: RecipeCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <View className="mb-6 relative">
      <Link href={`/recipe/${recipe.id}`} asChild>
        <Pressable className="rounded-3xl overflow-hidden bg-deepBlack border border-softWhite/10 active:opacity-80">
          {/* Thumbnail with emoji fallback */}
          {imageError || !recipe.image ? (
            <View className="w-full h-56 bg-[#1A1A1A] items-center justify-center">
              <View className="w-24 h-24 rounded-full bg-softWhite/5 border border-softWhite/10 items-center justify-center">
                <Text style={{ fontSize: 44 }}>{getEmojiForIngredient(recipe.title)}</Text>
              </View>
            </View>
          ) : (
            <Image
              source={{ uri: recipe.image }}
              className="w-full h-56"
              contentFit="cover"
              transition={200}
              onError={() => setImageError(true)}
            />
          )}

          <View className="p-5">
            {/* Tags row */}
            <View className="flex-row flex-wrap gap-2 mb-3">
              {recipe.tags.map((tag) => (
                <View key={tag} className="px-3 py-1 bg-softWhite/10 rounded-full">
                  <Text className="text-xs font-dmSans font-medium text-softWhite">{tag}</Text>
                </View>
              ))}
            </View>

            <Text className="text-2xl font-outfit font-bold text-softWhite mb-4">
              {recipe.title}
            </Text>

            {/* Quick Info Grid */}
            <View className="flex-row justify-between mb-4">
              <View className="flex-row items-center gap-1.5">
                <Clock size={16} color="#A3A3A3" />
                <Text className="text-sm font-dmSans text-neutral-400">{recipe.prepTime}</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Flame size={16} color="#A3A3A3" />
                <Text className="text-sm font-dmSans text-neutral-400">{recipe.calories} kcal</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <ChefHat size={16} color="#A3A3A3" />
                <Text className="text-sm font-dmSans text-neutral-400">{recipe.difficulty}</Text>
              </View>
            </View>

            {/* Missing Ingredients Warning */}
            {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
              <View className="mt-2 pt-4 border-t border-softWhite/10">
                <Text className="text-xs font-dmSans font-bold text-terracotta mb-2 uppercase tracking-wider">
                  Missing Items
                </Text>
                <Text className="text-sm font-dmSans text-softWhite/70">
                  {recipe.missingIngredients.join(" • ")}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Link>

      {/* Trash Delete Overlay — only shown in Saved tab */}
      {onRemove && (
        <View className="absolute top-4 right-4 z-10">
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="w-12 h-12 rounded-full bg-black/60 items-center justify-center border border-softWhite/20 active:bg-terracotta"
          >
            <Trash2 size={20} color="#F5F5F5" />
          </Pressable>
        </View>
      )}
    </View>
  );
});

