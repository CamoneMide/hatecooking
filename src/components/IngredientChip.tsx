import { View, Text, Pressable } from "react-native";
import { X } from "lucide-react-native";

interface IngredientChipProps {
  label: string;
  onRemove?: () => void;
  variant?: "default" | "missing";
}

export function IngredientChip({ label, onRemove, variant = "default" }: IngredientChipProps) {
  const isMissing = variant === "missing";
  
  return (
    <View 
      className={`flex-row items-center px-4 py-2 rounded-full border ${
        isMissing 
          ? "bg-terracotta/10 border-terracotta/30" 
          : "bg-softWhite/10 border-softWhite/20"
      }`}
    >
      <Text 
        className={`font-dmSans font-medium text-sm ${
          isMissing ? "text-terracotta" : "text-softWhite"
        }`}
      >
        {label}
      </Text>
      
      {onRemove && (
        <Pressable 
          onPress={onRemove} 
          className="ml-2 bg-softWhite/10 rounded-full p-0.5 active:bg-softWhite/20"
          hitSlop={10}
        >
          <X 
            size={14} 
            color={isMissing ? "#CD7F32" : "#F5F5F5"} 
            strokeWidth={2.5} 
          />
        </Pressable>
      )}
    </View>
  );
}
