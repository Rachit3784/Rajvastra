import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@react-navigation/elements"; 

// ⭐ Lucide Icons
import {
  Home,
  ShoppingCart,
  User,
  Play, // Restoring User icon for Profile
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// 🎨 Premium Color Palette
const COLORS = {
  ACTIVE_ICON: "#000000", // Black for active icon
  INACTIVE_ICON: "#8e8e93", // Standard Gray for inactive icon
  BAR_BACKGROUND: "#ffffff",
  BORDER: "rgba(0,0,0,0.05)",
};

// ⭐ Icon config - Updated to remove Chat, use Video for Social, and restore Profile
const tabIcons = {
  Home: {
    label: "Home",
    activeIcon: <Home size={24} color={COLORS.ACTIVE_ICON} />,
    inactiveIcon: <Home size={24} color={COLORS.INACTIVE_ICON} />,
  },
  Order: {
    label: "Orders",
    activeIcon: <ShoppingCart size={24} color={COLORS.ACTIVE_ICON} />,
    inactiveIcon: <ShoppingCart size={24} color={COLORS.INACTIVE_ICON} />,
  },
  Social: {
    label: "Social",
    activeIcon: <Play size={24} color={COLORS.ACTIVE_ICON} />, // Video icon
    inactiveIcon: <Play size={24} color={COLORS.INACTIVE_ICON} />,
  },
  Profile: { // Restored Profile tab
    label: "Profile",
    activeIcon: <User size={24} color={COLORS.ACTIVE_ICON} />,
    inactiveIcon: <User size={24} color={COLORS.INACTIVE_ICON} />,
  },
  Chats: { // Restored Profile tab
    label: "Chats",
    activeIcon: <User size={24} color={COLORS.ACTIVE_ICON} />,
    inactiveIcon: <User size={24} color={COLORS.INACTIVE_ICON} />,
  },
};

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
       
      ]}
    >
      <View style={styles.bottomTabBar}>
        {state.routes.map((route, index) => {
          // Check if the route name is in our updated tabIcons list
          const tab = tabIcons[route.name];
          if (!tab) return null; // Skip if tab is not defined (e.g., Chat)

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              {isFocused ? (
                // Active: Only the icon, colored black
                tab.activeIcon
              ) : (
                // Inactive: Only the icon, colored gray
                tab.inactiveIcon
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: COLORS.BAR_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,

    // ⭐ Subtle Shadow (retained for premium feel)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 15, 
  },

  bottomTabBar: {
    flexDirection: "row",
    width: width,
    paddingHorizontal: 15,
    justifyContent: "space-around",
    alignItems: "center",
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12, // Increased vertical padding for taller touch area
    minHeight: 56,
  },
  

});