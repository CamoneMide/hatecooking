import { View, Text, Pressable } from "react-native";
import { Trash2 } from "lucide-react-native";
import { getEmojiForIngredient } from "../utils/emojis";

interface IngredientCardProps {
  label: string;
  quantity?: string;
  onRemove?: () => void;
}

export function IngredientCard({ label, quantity, onRemove }: IngredientCardProps) {
  const emoji = getEmojiForIngredient(label);

  return (
    <View className="flex-row items-center w-full bg-softWhite/5 border border-softWhite/10 rounded-3xl p-4 mb-3">
      {/* Emoji Container */}
      <View className="w-12 h-12 bg-softWhite/10 rounded-2xl items-center justify-center mr-4">
        <Text className="text-2xl">{emoji}</Text>
      </View>

      {/* Text Container */}
      <View className="flex-1 justify-center">
        <Text className="font-outfit font-semibold text-softWhite text-lg mb-0.5">
          {label}
        </Text>
        <Text className="font-dmSans text-softWhite/50 text-sm">
          {quantity || "1 unit"}
        </Text>
      </View>

      {/* Delete Button */}
      {onRemove && (
        <Pressable 
          onPress={onRemove}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-softWhite/10"
        >
          <Trash2 size={20} color="#EF4444" opacity={0.8} />
        </Pressable>
      )}
    </View>
  );
}
