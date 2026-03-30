import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { useRecipeStore, Recipe } from "../../store/useRecipeStore";
import { RecipeCard } from "../../components/RecipeCard";

export default function RecipesScreen() {
  const recipes = useRecipeStore((state) => state.recipes);

  const renderItem = useCallback(({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} />
  ), []);

  const keyExtractor = useCallback((item: Recipe) => item.id, []);

  return (
    <View className="flex-1 bg-deepBlack px-6 pt-16">
      <View className="mb-6">
        <Text className="text-3xl font-outfit font-bold text-softWhite mb-2">
          Discover
        </Text>
        <Text className="text-base font-dmSans text-softWhite/70">
          Curated for your ingredients
        </Text>
      </View>

      <View className="flex-1">
        <FlashList
          data={recipes}
          renderItem={renderItem}
          estimatedItemSize={350}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </View>
  );
}
