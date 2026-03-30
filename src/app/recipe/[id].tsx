import { useState, useEffect, memo, useRef } from "react";
import { View, Text, ScrollView, Pressable, Animated, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { useRecipeStore } from "../../store/useRecipeStore";
import { ArrowLeft, Clock, Flame, ChefHat, Volume2, Plus, VolumeX, Play, CheckCircle2, X, Bookmark } from "lucide-react-native";
import * as Speech from "expo-speech";
import { getEmojiForIngredient } from "../../utils/emojis";

type StepType = { instruction: string; time: string };

type StepItemProps = {
  step: StepType;
  idx: number;
  isActive: boolean;
  onPress?: () => void;
  onSpeech: (text: string) => void;
  isPlaying: boolean;
  isCookingMode?: boolean;
};

const StepItem = memo(({ step, idx, isActive, onPress, onSpeech, isPlaying, isCookingMode = false }: StepItemProps) => {
  const bgStyle = isActive ? "bg-softWhite/10 border-softWhite/30" : "bg-transparent border-transparent";
  const textStyle = isActive ? "text-softWhite font-bold" : "text-softWhite/60";

  if (isCookingMode) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <View className="w-16 h-16 rounded-full bg-softWhite/10 items-center justify-center mb-8">
          <Text className="text-softWhite font-outfit font-bold text-2xl">{idx + 1}</Text>
        </View>
        <Text className="font-dmSans text-3xl text-center leading-tight text-softWhite mb-8">
          {step.instruction}
        </Text>
        <View className="bg-terracotta/20 px-6 py-3 rounded-full border border-terracotta/30 flex-row items-center gap-2 mb-10">
          <Clock size={20} color="#CD7F32" />
          <Text className="text-terracotta font-outfit text-lg font-bold">{step.time}</Text>
        </View>

        <Pressable 
          onPress={() => onSpeech(step.instruction)}
          className="bg-softWhite/10 w-16 h-16 rounded-full items-center justify-center active:bg-softWhite/20 border border-softWhite/20"
        >
          {isPlaying ? (
            <VolumeX size={24} color="#F5F5F5" />
          ) : (
            <Volume2 size={24} color="#F5F5F5" />
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable 
      onPress={onPress}
      className={`p-4 rounded-3xl border mb-3 ${bgStyle}`}
    >
      <View className="flex-row mb-3">
        <View className="w-8 h-8 rounded-full bg-softWhite/20 items-center justify-center mr-4">
          <Text className="text-softWhite font-outfit font-bold">{idx + 1}</Text>
        </View>
        <Text className={`flex-1 font-dmSans text-lg leading-relaxed ${textStyle}`}>
          {step.instruction}
        </Text>
      </View>

      <View className="flex-row justify-between items-center pl-12">
        <View className="flex-row items-center gap-1.5 opacity-60">
          <Clock size={14} color="#F5F5F5" />
          <Text className="text-softWhite font-dmSans text-sm">{step.time}</Text>
        </View>
        {isActive && (
          <Pressable 
            onPress={() => onSpeech(step.instruction)}
            className="bg-terracotta w-10 h-10 rounded-full items-center justify-center active:bg-terracotta/80 shadow-md shadow-terracotta/50"
          >
            {isPlaying ? (
              <VolumeX size={18} color="#F5F5F5" />
            ) : (
              <Volume2 size={18} color="#F5F5F5" />
            )}
          </Pressable>
        )}
      </View>
    </Pressable>
  );
});
StepItem.displayName = "StepItem";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  
  const recipe = useRecipeStore((state) => state.recipes.find((r) => r.id === id));
  const addToShoppingList = useRecipeStore((state) => state.addToShoppingList);
  const saveRecipe = useRecipeStore((state) => state.saveRecipe);
  const removeSavedRecipe = useRecipeStore((state) => state.removeSavedRecipe);
  const isSaved = useRecipeStore((state) =>
    state.savedRecipes.some((r) => r.title === (recipe?.title ?? ""))
  );
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Timer animation placeholder for visual spice
  const timerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loop = Animated.loop(
      Animated.timing(timerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    loop.start();

    return () => {
      loop.stop();
      timerAnim.stopAnimation();
      Speech.stop();
    };
  }, [timerAnim]);

  if (!recipe) {
    return (
      <View className="flex-1 bg-deepBlack items-center justify-center p-6">
        <Text className="text-softWhite font-outfit text-xl mb-4 text-center">Recipe not found.</Text>
        <Pressable onPress={() => router.back()} className="px-6 py-3 bg-terracotta rounded-full">
          <Text className="font-dmSans font-bold text-softWhite">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleSpeech = async (text: string) => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      Speech.speak(text, {
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    }
  };

  const handleAddMissingItems = () => {
    recipe.missingIngredients.forEach(item => addToShoppingList(item));
    router.push("/(tabs)/shopping");
  };

  const startCooking = () => {
    setCurrentStep(0);
    setIsCookingMode(true);
  };

  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      if (isPlaying) {
        Speech.stop();
        setIsPlaying(false);
      }
      setCurrentStep(prev => prev + 1);
    } else {
      // Finished cooking! exit mode
      if (isPlaying) Speech.stop();
      setIsPlaying(false);
      setIsCookingMode(false);
      setCurrentStep(0);
    }
  };

  // -------------------------------------------------------------------------------- //
  // IMMERSIVE COOKING MODE RENDERER                                                  //
  // -------------------------------------------------------------------------------- //
  if (isCookingMode) {
    const isLastStep = currentStep === recipe.steps.length - 1;
    const progressPerc = ((currentStep + 1) / recipe.steps.length) * 100;

    return (
      <View className="flex-1 bg-deepBlack">
        {/* Cooking Header */}
        <View className="pt-16 px-6 pb-4 flex-row items-center justify-between z-10">
          <Pressable 
            onPress={() => {
              if (isPlaying) Speech.stop();
              setIsPlaying(false);
              setIsCookingMode(false);
            }} 
            className="w-10 h-10 rounded-full bg-softWhite/10 items-center justify-center active:bg-softWhite/20 border border-softWhite/20"
          >
            <X size={20} color="#F5F5F5" />
          </Pressable>
          <Text className="font-dmSans text-softWhite/50">Step {currentStep + 1} of {recipe.steps.length}</Text>
          <View className="w-10" />
        </View>

        {/* Progress Bar */}
        <View className="w-full h-1 bg-softWhite/10">
          <View className="h-full bg-terracotta" style={{ width: `${progressPerc}%` }} />
        </View>

        {/* Interactive Step Content */}
        <StepItem 
          step={recipe.steps[currentStep]}
          idx={currentStep}
          isActive={true}
          onSpeech={handleSpeech}
          isPlaying={isPlaying}
          isCookingMode={true}
        />

        {/* Bottom Navigation */}
        <View className="p-6 pb-12">
          <Pressable 
            onPress={handleNextStep}
            className={`w-full py-5 rounded-3xl items-center justify-center flex-row gap-2 active:opacity-80 shadow-lg ${
              isLastStep ? "bg-[#10B981]" : "bg-terracotta"
            }`}
          >
            <Text className="text-softWhite font-outfit text-xl font-bold tracking-wide">
              {isLastStep ? "Finish Cooking" : "Next Step"}
            </Text>
            {isLastStep ? (
              <CheckCircle2 size={24} color="#F5F5F5" />
            ) : (
              <ArrowLeft size={24} color="#F5F5F5" style={{ transform: [{ rotate: "180deg" }] }} />
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // -------------------------------------------------------------------------------- //
  // RECIPE OVERVIEW RENDERER (DEFAULT)                                               //
  // -------------------------------------------------------------------------------- //
  return (
    <View className="flex-1 bg-deepBlack">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header Image (With Fallback) */}
        <View className="relative h-80 rounded-b-[40px] overflow-hidden bg-softWhite/5">
          {imageError ? (
            <View className="absolute inset-0 items-center justify-center bg-[#1A1A1A]">
              <View className="w-32 h-32 rounded-full bg-softWhite/5 border border-softWhite/10 items-center justify-center shadow-lg">
                <Text className="text-6xl">{getEmojiForIngredient(recipe.title)}</Text>
              </View>
            </View>
          ) : (
            <Image 
              source={{ uri: recipe.image }} 
              className="w-full h-full"
              contentFit="cover"
              transition={300}
              onError={() => setImageError(true)}
            />
          )}

          <View className="absolute top-0 w-full h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
          
          <Pressable 
            onPress={() => router.back()}
            className="absolute top-16 left-6 w-12 h-12 rounded-full flex-row gap-2 bg-black/40 items-center justify-center border border-softWhite/20 backdrop-blur-md active:bg-black/60"
          >
            <ArrowLeft color="#F5F5F5" size={24} />
          </Pressable>

          {/* Bookmark Button */}
          <Pressable
            onPress={() => {
              if (isSaved) {
                removeSavedRecipe(recipe.id);
              } else {
                saveRecipe(recipe);
              }
            }}
            className="absolute top-16 right-6 w-12 h-12 rounded-full bg-black/40 items-center justify-center border border-softWhite/20 backdrop-blur-md active:bg-black/60"
          >
            <Bookmark
              size={22}
              color={isSaved ? "#C47A5C" : "#F5F5F5"}
              fill={isSaved ? "#C47A5C" : "transparent"}
            />
          </Pressable>
        </View>

        {/* Content Body */}
        <View className="px-6 py-8">
          {/* Tags */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {recipe.tags.map((tag) => (
              <View key={tag} className="px-3 py-1 bg-terracotta/20 rounded-full border border-terracotta/30">
                <Text className="text-xs font-dmSans font-bold text-terracotta uppercase">{tag}</Text>
              </View>
            ))}
          </View>

          <Text className="text-4xl font-outfit font-bold text-softWhite mb-3 leading-tight">
            {recipe.title}
          </Text>

          {/* Description */}
          <Text className="text-softWhite/60 font-dmSans text-base leading-relaxed mb-8">
            {recipe.description || "A delicious meal configured uniquely for you."}
          </Text>

          {/* Metrics */}
          <View className="flex-row justify-between bg-softWhite/5 p-4 rounded-3xl mb-8 border border-softWhite/10 shadow-sm">
            <View className="items-center flex-1">
              <Clock size={20} color="#C47A5C" className="mb-2" />
              <Text className="text-softWhite font-outfit text-lg font-bold">
                {recipe.prepTime}
              </Text>
              <Text className="text-softWhite/60 font-dmSans text-xs">Prep</Text>
            </View>
            <View className="w-px h-full bg-softWhite/10" />
            <View className="items-center flex-1">
              <Flame size={20} color="#C47A5C" className="mb-2" />
              <Text className="text-softWhite font-outfit text-lg font-bold">
                {recipe.calories}
              </Text>
              <Text className="text-softWhite/60 font-dmSans text-xs">Kcal</Text>
            </View>
            <View className="w-px h-full bg-softWhite/10" />
            <View className="items-center flex-1">
              <ChefHat size={20} color="#C47A5C" className="mb-2" />
              <Text className="text-softWhite font-outfit text-lg font-bold">
                {recipe.difficulty}
              </Text>
              <Text className="text-softWhite/60 font-dmSans text-xs">Level</Text>
            </View>
          </View>

          {/* Missing Ingredients Warning */}
          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <View className="bg-terracotta/10 border border-terracotta/30 p-5 rounded-3xl mb-10 shadow-sm">
              <Text className="text-terracotta font-outfit text-lg font-bold mb-2">
                Missing Ingredients
              </Text>
              <Text className="text-terracotta/80 font-dmSans text-base mb-4 leading-relaxed">
                {recipe.missingIngredients.join(" • ")}
              </Text>
              <Pressable 
                onPress={handleAddMissingItems}
                className="bg-terracotta/20 border border-terracotta/30 flex-row items-center justify-center py-3.5 rounded-full gap-2 active:bg-terracotta/30"
              >
                <Plus size={18} color="#C47A5C" strokeWidth={3} />
                <Text className="text-terracotta font-dmSans font-bold">
                  Add to Shopping List
                </Text>
              </Pressable>
            </View>
          )}

          {/* Step by Step Overview */}
          <View className="flex-row justify-between items-end mb-6">
            <Text className="text-softWhite font-outfit text-2xl font-bold">
              Steps Overview
            </Text>

            {/* Mock Circular Timer Graphic */}
            <View className="w-10 h-10 bg-softWhite/10 rounded-full border border-softWhite/20 items-center justify-center relative shadow-lg">
             <Animated.View 
                style={{
                  ...StyleSheet.absoluteFillObject,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "#C47A5C",
                  transform: [
                    { scale: timerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) },
                  ],
                  opacity: timerAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
                }}
             />
             <Clock size={16} color="#C47A5C" />
            </View>
          </View>

          <View className="mb-24">
            {recipe.steps.map((step, idx) => (
              <StepItem 
                key={idx}
                step={step}
                idx={idx}
                isActive={currentStep === idx}
                onPress={() => setCurrentStep(idx)}
                onSpeech={handleSpeech}
                isPlaying={isPlaying}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Persistent "Start Cooking" FAB */}
      <View className="absolute bottom-6 left-6 right-6 shadow-lg z-50">
        <Pressable 
          onPress={startCooking}
          className="bg-terracotta w-full py-5 rounded-3xl flex-row items-center justify-center gap-2 active:opacity-90 shadow-lg shadow-terracotta/40"
        >
          <Play size={22} color="#F5F5F5" fill="#F5F5F5" />
          <Text className="text-softWhite font-outfit text-xl font-bold tracking-wide">
            Start Cooking
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
