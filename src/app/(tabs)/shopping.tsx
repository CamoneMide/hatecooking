import { useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput, Keyboard } from "react-native";
import { useRecipeStore } from "../../store/useRecipeStore";
import { Check, Plus, Trash2, X } from "lucide-react-native";

export default function ShoppingScreen() {
  const shoppingList = useRecipeStore((state) => state.shoppingList);
  const toggleShoppingItem = useRecipeStore((state) => state.toggleShoppingItem);
  const addToShoppingList = useRecipeStore((state) => state.addToShoppingList);
  const clearShoppingList = useRecipeStore((state) => state.clearShoppingList);
  const removeFromShoppingList = useRecipeStore((state) => state.removeFromShoppingList);

  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim().length > 0) {
      addToShoppingList(newItem.trim());
      setNewItem("");
      Keyboard.dismiss();
    }
  };

  const completedCount = shoppingList.filter((i) => i.checked).length;
  const totalCount = shoppingList.length;

  return (
    <View className="flex-1 bg-deepBlack px-6 pt-16">
      <View className="mb-8 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-outfit font-bold text-softWhite mb-2">
            Shopping List
          </Text>
          <Text className="text-base font-dmSans text-softWhite/70">
            {completedCount} of {totalCount} items gathered
          </Text>
        </View>
        <Pressable 
          onPress={clearShoppingList}
          className="bg-softWhite/10 p-3 rounded-full active:bg-softWhite/20"
        >
          <Trash2 size={24} color="#EF4444" />
        </Pressable>
      </View>

      <View className="flex-row items-center mb-6">
        <TextInput 
          className="flex-1 bg-softWhite/10 text-softWhite font-dmSans px-4 py-3 rounded-xl border border-softWhite/20"
          placeholder="Add item..."
          placeholderTextColor="#A3A3A3"
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={handleAdd}
          blurOnSubmit={true}
        />
        <Pressable 
          onPress={handleAdd} 
          className="ml-3 bg-terracotta p-3 rounded-xl items-center justify-center active:bg-terracotta/80"
        >
          <Plus size={20} color="#F5F5F5" />
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4 pb-12 gap-y-3">
          {shoppingList.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => toggleShoppingItem(item.id)}
              className={`flex-row items-center p-4 rounded-2xl border ${
                item.checked 
                  ? "bg-softWhite/5 border-softWhite/5 opacity-60" 
                  : "bg-softWhite/10 border-softWhite/20"
              }`}
            >
              <View 
                className={`w-6 h-6 rounded-md items-center justify-center mr-4 border-2 ${
                  item.checked 
                    ? "bg-terracotta border-terracotta" 
                    : "border-softWhite/40"
                }`}
              >
                {item.checked && <Check size={16} color="#0A0A0A" strokeWidth={3} />}
              </View>
              
              <Text 
                className={`font-dmSans text-lg flex-1 ${
                  item.checked 
                    ? "text-softWhite/50 line-through decoration-softWhite/50" 
                    : "text-softWhite font-medium"
                }`}
              >
                {item.name}
              </Text>
              
              <Pressable 
                onPress={() => removeFromShoppingList(item.id)}
                className="p-2 ml-2 bg-softWhite/5 rounded-full active:bg-softWhite/10"
              >
                <X size={16} color="#A3A3A3" />
              </Pressable>
            </Pressable>
          ))}
          
          {shoppingList.length === 0 && (
            <View className="items-center justify-center py-20 opacity-50">
              <Text className="text-softWhite font-dmSans text-center leading-relaxed">
                Your shopping list is empty.{"\n"}Add missing ingredients from recipes!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
