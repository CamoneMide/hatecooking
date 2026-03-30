import React from "react";
import { View, ViewProps, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Typography } from "./Typography";

type CardProps = ViewProps & {
  title?: string;
  subtitle?: string;
  onPress?: (e: any) => void;
  variant?: "default" | "outline" | "elevated";
  padding?: boolean;
};

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  subtitle, 
  onPress, 
  variant = "default", 
  padding = true,
  className,
  ...props 
}) => {
  const Container = onPress ? TouchableOpacity : View;
  
  const getVariantStyle = () => {
    switch (variant) {
      case "default":
        return "bg-softWhite/5 border-softWhite/10 border";
      case "outline":
        return "bg-transparent border-softWhite/20 border";
      case "elevated":
        return "bg-softWhite/10 border-softWhite/20 border shadow-2xl";
    }
  };

  return (
    <Container
      activeOpacity={0.9}
      className={`rounded-3xl overflow-hidden ${getVariantStyle()} ${className}`}
      onPress={onPress}
      {...props}
    >
      {padding ? (
        <View className="p-5">
          {(title || subtitle) && (
            <View className="mb-4">
              {title && <Typography variant="h3">{title}</Typography>}
              {subtitle && <Typography variant="caption" className="mt-1">{subtitle}</Typography>}
            </View>
          )}
          {children}
        </View>
      ) : (
        children
      )}
    </Container>
  );
};
