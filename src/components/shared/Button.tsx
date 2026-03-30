import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Typography } from "./Typography";
import { Colors } from "../../constants/colors";

type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = "primary", 
  size = "medium", 
  icon, 
  onPress, 
  className,
  ...props 
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return "bg-terracotta border-terracotta";
      case "secondary":
        return "bg-softWhite border-softWhite";
      case "outline":
        return "bg-transparent border-softWhite/20 border";
      case "ghost":
        return "bg-transparent border-transparent";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary": return "#F5F5F5";
      case "secondary": return "#0A0A0A";
      case "outline": return "#F5F5F5";
      case "ghost": return "#F5F5F5";
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small": return "px-3 py-2";
      case "medium": return "px-5 py-3.5";
      case "large": return "px-8 py-4";
    }
  };

  const handlePress = (e: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`flex-row items-center justify-center rounded-2xl overflow-hidden ${getVariantStyle()} ${getSizeStyle()} ${className}`}
      onPress={handlePress}
      {...props}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <Typography 
        variant={size === "large" ? "h3" : "body"} 
        weight="bold" 
        color={getTextColor()}
      >
        {title}
      </Typography>
    </TouchableOpacity>
  );
};
