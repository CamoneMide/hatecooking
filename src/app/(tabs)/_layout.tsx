import { Tabs } from "expo-router";
import { Camera, ChefHat, ShoppingCart, Bookmark } from "lucide-react-native";


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0A0A0A",
          borderTopColor: "rgba(245, 245, 245, 0.1)",
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#CD7F32",
        tabBarInactiveTintColor: "#52525B",
        tabBarLabelStyle: {
          fontFamily: "DMSans_500Medium",
          fontSize: 12,
          marginTop: 4,
        },
        sceneStyle: {
          backgroundColor: "#0A0A0A",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => (
            <Camera size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <ChefHat size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "My Recipes",
          tabBarIcon: ({ color, size }) => (
            <Bookmark size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: "List",
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}
