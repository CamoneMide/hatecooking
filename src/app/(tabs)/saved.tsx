import { useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import { Bookmark } from "lucide-react-native";
import { useRecipeStore, Recipe } from "../../store/useRecipeStore";
import { RecipeCard } from "../../components/RecipeCard";

export default function SavedScreen() {
  const savedRecipes = useRecipeStore((state) => state.savedRecipes);
  const removeSavedRecipe = useRecipeStore((state) => state.removeSavedRecipe);

  const renderItem = useCallback(
    ({ item }: { item: Recipe }) => (
      <RecipeCard
        recipe={item}
        onRemove={() => removeSavedRecipe(item.id)}
      />
    ),
    [removeSavedRecipe]
  );

  const keyExtractor = useCallback((item: Recipe) => item.id, []);

  return (
    <View className="flex-1 bg-deepBlack px-6 pt-16">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-outfit font-bold text-softWhite mb-2">
          My Recipes
        </Text>
        <Text className="text-base font-dmSans text-softWhite/70">
          Your personal cookbook
        </Text>
      </View>

      {savedRecipes.length === 0 ? (
        /* Empty State */
        <View className="flex-1 items-center justify-center pb-20">
          <View className="w-24 h-24 rounded-full bg-softWhite/5 border border-softWhite/10 items-center justify-center mb-6">
            <Bookmark size={40} color="#52525B" />
          </View>
          <Text className="text-softWhite font-outfit text-xl font-bold mb-3 text-center">
            No saved recipes yet
          </Text>
          <Text className="text-softWhite/50 font-dmSans text-base text-center leading-relaxed px-8">
            Tap the bookmark icon on any recipe to save it here for later.
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={savedRecipes}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </View>
      )}
    </View>
  );
}
