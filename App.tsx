import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./navigation/RootNavigator";
import MyContextProvider from "./store/MyContext"
import { NavigationContainer } from "@react-navigation/native";
import 'react-native-reanimated';

export default function App() {
  const isDark = useColorScheme() === "dark";

  return (
    <MyContextProvider>
      <SafeAreaProvider>

      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent"
        translucent
      />

      <NavigationContainer>
        <RootNavigator/>
      </NavigationContainer>

    </SafeAreaProvider>
    </MyContextProvider>
  );
}
