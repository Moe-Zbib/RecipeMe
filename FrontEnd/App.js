import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from @expo/vector-icons
import AuthScreen from "./Components/Playground/AuthScreen";
import HomePage from "./Components/HomePage";
import SearchHeader from "./Components/SearchHeader";
import RecipeDetails from "./Components/RecipeDetails";
import RecipeListScreen from "./Components/RecipeList";
import RecipeCreator from "./Components/RecipeCreator";
import FavoriteRecipes from "./Components/FavoriteRecipes";
import LoadingScreen from "./Components/Playground/LoadingScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      AsyncStorage.getItem("sessionToken")
        .then((token) => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to retrieve session token:", error.message);
          setIsLoading(false);
        });
    }, 2000);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="AuthScreen"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RecipeList"
          component={RecipeListScreen}
          options={({ route }) => ({
            header: (props) => <SearchHeader {...props} />,
            title: `Recipes for "${route.params.query}"`,
          })}
        />
        <Stack.Screen
          name="RecipeDetails"
          component={RecipeDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        header: (props) => <SearchHeader {...props} />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "FavoriteRecipes") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "RecipeCreator") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }

          // Return the Ionicons component with the corresponding icon name
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: "", // Set tabBarLabel to an empty string
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="FavoriteRecipes" component={FavoriteRecipes} />
      <Tab.Screen name="RecipeCreator" component={RecipeCreator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default App;
