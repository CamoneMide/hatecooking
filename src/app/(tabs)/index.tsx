import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Camera,
  ChefHat,
  ImagePlus,
  Plus,
  Search,
  X,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { IngredientCard } from "../../components/IngredientCard";
import { useRecipeStore } from "../../store/useRecipeStore";
import { analyzeFridgeImage, generateRecipes } from "../../utils/gemini";

const QUICK_ADD_ITEMS = ["Eggs", "Garlic", "Onions", "Milk", "Chicken"];

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [manualItem, setManualItem] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);

  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView>(null);

  const scannedIngredients = useRecipeStore(
    (state) => state.scannedIngredients,
  );
  const addIngredient = useRecipeStore((state) => state.addIngredient);
  const removeIngredient = useRecipeStore((state) => state.removeIngredient);
  const setRecipes = useRecipeStore((state) => state.setRecipes);

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;

    if (isScanning) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
    } else {
      scanLineAnim.stopAnimation();
      scanLineAnim.setValue(0);
    }

    return () => {
      if (loop) loop.stop();
      scanLineAnim.stopAnimation();
    };
  }, [isScanning, scanLineAnim]);

  if (!permission) {
    return <View className="flex-1 bg-deepBlack" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-deepBlack p-6">
        <Text className="text-xl font-outfit font-bold text-softWhite text-center mb-4">
          Enable Camera Access
        </Text>
        <Text className="text-base font-dmSans text-softWhite/70 text-center mb-8">
          We need access to your camera to scan your fridge and suggest recipes.
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-terracotta px-8 py-4 rounded-full"
        >
          <Text className="text-softWhite font-dmSans font-bold text-base">
            Grant Permission
          </Text>
        </Pressable>
      </View>
    );
  }

  const handleScanPress = async () => {
    if (!cameraRef.current) return;
    setIsScanning(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });

      if (photo?.base64) {
        const aiIngredients = await analyzeFridgeImage(photo.base64);
        aiIngredients.forEach((item) => addIngredient(item));
        setIsCameraActive(false);
      }
    } catch (e) {
      console.error("Camera or AI Error:", e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleImageLibraryPress = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        base64: true,
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]?.base64) {
        setIsScanning(true);
        const aiIngredients = await analyzeFridgeImage(result.assets[0].base64);
        aiIngredients.forEach((item) => addIngredient(item));
      }
    } catch (e) {
      console.error("Image Library Error:", e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualAdd = () => {
    if (manualItem.trim().length > 0) {
      addIngredient({ name: manualItem.trim() });
      setManualItem("");
      Keyboard.dismiss();
    }
  };

  const handleGenerateRecipes = async () => {
    if (scannedIngredients.length === 0) return;
    setIsGeneratingRecipes(true);
    
    try {
      const ingredientStrings = scannedIngredients.map(
        (i) => `${i.quantity ? i.quantity + " " : ""}${i.name}`
      );
      const newRecipes = await generateRecipes(ingredientStrings);
      
      if (newRecipes && newRecipes.length > 0) {
        setRecipes(newRecipes);
        router.navigate("/recipes");
      }
    } catch (error) {
      console.error("Recipe generation failed:", error);
    } finally {
      setIsGeneratingRecipes(false);
    }
  };

  if (isCameraActive) {
    return (
      <View className="flex-1 bg-black">
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
        />

        {/* Top Gradient Overlay */}
        <View className="absolute top-0 w-full h-32 bg-black/40 pointer-events-none" />

        {/* Header Title */}
        <View className="absolute top-16 left-6 right-6 flex-row justify-between items-center z-20">
          <Text className="text-softWhite font-outfit text-2xl font-bold tracking-wide pointer-events-none">
            Scan Ingredients
          </Text>
          <Pressable
            onPress={() => setIsCameraActive(false)}
            className="w-10 h-10 bg-black/50 rounded-full items-center justify-center border border-softWhite/20 backdrop-blur-md active:bg-black/70"
          >
            <X size={20} color="#F5F5F5" />
          </Pressable>
        </View>

        {/* Scanning Line Animation */}
        {isScanning && (
          <Animated.View
            className="absolute left-0 right-0 h-1 bg-terracotta z-10 opacity-80"
            style={{
              shadowColor: "#C47A5C",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 10,
              elevation: 10,
              transform: [
                {
                  translateY: scanLineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 700],
                  }),
                },
              ],
            }}
          />
        )}

        {/* Scan Button Overlay */}
        <View className="absolute bottom-12 left-0 right-0 items-center z-10">
          <Pressable
            disabled={isScanning}
            onPress={handleScanPress}
            className={`w-20 h-20 rounded-full items-center justify-center border-4 ${
              isScanning
                ? "border-terracotta bg-terracotta/30"
                : "border-softWhite bg-softWhite/20 backdrop-blur-md"
            }`}
          >
            {isScanning ? (
              <View className="w-8 h-8 rounded-full bg-terracotta animate-pulse" />
            ) : (
              <Search size={32} color="#F5F5F5" />
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-deepBlack">
      <ScrollView
        className="flex-1 px-6 pt-16"
        showsVerticalScrollIndicator={false}
      >
        {/* Hello Chef Header */}
        <Text className="text-4xl font-outfit font-bold text-softWhite mt-2 mb-1">
          Hello, Chef! 👋
        </Text>
        <Text className="text-base font-dmSans text-softWhite/70 mb-5">
          Here&apos;s what&apos;s in your inventory.
        </Text>

        {/* Manual Input Row */}
        <View className="flex-row items-center mb-6">
          <TextInput
            className="flex-1 bg-softWhite/5 text-softWhite font-dmSans px-4 py-3.5 rounded-xl border border-softWhite/20"
            placeholder="Manually add item..."
            placeholderTextColor="#A3A3A3"
            value={manualItem}
            onChangeText={setManualItem}
            onSubmitEditing={handleManualAdd}
            blurOnSubmit={true}
          />
          <Pressable
            onPress={handleManualAdd}
            className="ml-3 bg-terracotta h-[42px] w-[48px] rounded-xl items-center justify-center active:bg-terracotta/80 shadow-md"
          >
            <Plus size={24} color="#F5F5F5" />
          </Pressable>
        </View>

        {/* The CTA Cards */}
        <View className="flex-row gap-4 mb-8">
          <Pressable
            onPress={() => setIsCameraActive(true)}
            className="flex-1 bg-terracotta/10 border border-terracotta/30 p-4 rounded-3xl active:bg-terracotta/20"
          >
            <View className="w-10 h-10 bg-terracotta/20 rounded-xl items-center justify-center mb-4">
              <Camera size={20} color="#CD7F32" />
            </View>
            <Text className="font-outfit font-bold text-softWhite text-lg mb-1">
              Snap Fridge
            </Text>
            <Text className="font-dmSans text-softWhite/50 text-xs">
              AI will identify items
            </Text>
          </Pressable>
          <Pressable
            onPress={handleImageLibraryPress}
            className="flex-1 bg-softWhite/5 border border-softWhite/10 p-4 rounded-3xl active:bg-softWhite/10"
          >
            <View className="w-10 h-10 bg-softWhite/10 rounded-xl items-center justify-center mb-4">
              <ImagePlus size={20} color="#F5F5F5" />
            </View>
            <Text className="font-outfit font-bold text-softWhite text-lg mb-1">
              Upload Photo
            </Text>
            <Text className="font-dmSans text-softWhite/50 text-xs">
              Select from gallery
            </Text>
          </Pressable>
        </View>

        {/* Quick Add Row */}
        <View className="mb-3">
          <Text className="text-softWhite/40 font-dmSans text-xs mb-3 ml-1 uppercase tracking-wider">
            Quick Add Staples
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pr-10">
              {QUICK_ADD_ITEMS.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => addIngredient({ name: item })}
                  className="px-4 py-2.5 bg-softWhite/5 border border-softWhite/20 rounded-full active:bg-softWhite/10"
                >
                  <Text className="text-softWhite font-dmSans text-sm tracking-wide">
                    + {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* List Header */}
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-xl font-outfit font-bold text-softWhite">
            Current Ingredients
          </Text>
          <Text className="font-dmSans text-softWhite/50 text-sm mb-0.5">
            {scannedIngredients.length} items
          </Text>
        </View>

        {/* List mapping IngredientCard */}
        <View className="pb-32">
          {scannedIngredients.length === 0 && manualItem.length === 0 ? (
            <View className="py-10 items-center opacity-50">
              <ChefHat
                size={40}
                color="#F5F5F5"
                className="mb-4"
                opacity={0.5}
              />
              <Text className="text-softWhite font-dmSans text-center leading-relaxed px-10">
                Your inventory is empty. Check your fridge or pick quick staples
                above!
              </Text>
            </View>
          ) : (
            scannedIngredients.map((item) => (
              <IngredientCard
                key={item.id}
                label={item.name}
                quantity={item.quantity}
                onRemove={() => removeIngredient(item.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Final Search Button */}
      {scannedIngredients.length > 0 && (
        <View className="absolute bottom-6 left-6 right-6 z-50">
          <Pressable
            disabled={isGeneratingRecipes}
            onPress={handleGenerateRecipes}
            className={`w-full py-4 rounded-2xl items-center flex-row justify-center gap-2 shadow-lg ${
              isGeneratingRecipes ? "bg-terracotta/50" : "bg-terracotta active:bg-terracotta/90"
            }`}
          >
            {isGeneratingRecipes ? (
              <ActivityIndicator color="#F5F5F5" size="small" />
            ) : (
              <ChefHat size={20} color="#F5F5F5" />
            )}
            <Text className="text-softWhite font-dmSans text-base font-bold">
              {isGeneratingRecipes 
                ? "Crafting Recipes..." 
                : `Find Recipes (${scannedIngredients.length})`
              }
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
