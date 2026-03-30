import { Text, TextProps } from "react-native";
import React from "react";

type TypographyProps = TextProps & {
  variant?: 
    | "h1" | "h2" | "h3" 
    | "bodyLarge" | "body" | "bodySmall" 
    | "label" | "caption";
  color?: string;
  weight?: "regular" | "medium" | "bold";
};

/**
 * Premium Typography component using Outfit (Heading) and DM Sans (Body).
 */
export const Typography: React.FC<TypographyProps> = ({ 
  children, 
  variant = "body", 
  style, 
  color = "#F5F5F5", 
  weight = "regular",
  ...props 
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "h1":
        return "text-4xl font-outfit font-bold tracking-tight";
      case "h2":
        return "text-2xl font-outfit font-bold";
      case "h3":
        return "text-xl font-outfit font-bold";
      case "bodyLarge":
        return "text-lg font-dmSans";
      case "body":
        return "text-base font-dmSans";
      case "bodySmall":
        return "text-sm font-dmSans";
      case "label":
        return "text-xs font-dmSans uppercase tracking-widest opacity-60";
      case "caption":
        return "text-xs font-dmSans opacity-50";
      default:
        return "text-base font-dmSans";
    }
  };

  const getWeightFont = () => {
    if (variant.startsWith("h")) {
      return weight === "bold" ? "font-outfit font-bold" : "font-outfit font-normal";
    }
    switch (weight) {
      case "bold": return "font-dmSans font-bold";
      case "medium": return "font-dmSans font-medium";
      default: return "font-dmSans font-normal";
    }
  };

  return (
    <Text 
      className={`${getVariantStyle()} ${getWeightFont()}`} 
      style={[{ color }, style]} 
      {...props}
    >
      {children}
    </Text>
  );
};
