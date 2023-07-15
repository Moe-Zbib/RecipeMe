import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import RecipeItem from "./RecipeItem";

const backendUrl = "http://192.168.1.6:8000";

const FavoriteRecipesScreen = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    fetchFavoriteRecipes();
  }, []);

  const fetchFavoriteRecipes = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      const response = await axios.get(`${backendUrl}/getFavoriteRecipes`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (response.status === 200) {
        const { favoriteRecipes } = response.data;
        setFavoriteRecipes(favoriteRecipes);
      }
    } catch (error) {
      console.error("Failed to fetch favorite recipes:", error.message);
    }
  };

  const handleRecipeSelect = (recipe) => {
    // Handle recipe selection as needed
  };

  const handleRemoveFromFavorites = async (recipeId) => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      const response = await axios.delete(
        `${backendUrl}/removeFavoriteRecipes`,
        {
          data: {
            recipeId: recipeId,
          },
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Recipe removed from favorites:", recipeId);
        setFavoriteRecipes((prevFavoriteRecipes) =>
          prevFavoriteRecipes.filter((recipe) => recipe.recipeId !== recipeId)
        );
      }
    } catch (error) {
      console.error("Failed to remove recipe from favorites:", error.message);
    }
  };

  const renderRecipeItem = ({ item }) => (
    <RecipeItem
      item={item}
      isFavorited={true} // Always set isFavorited to true in the favorite recipes screen
      handleRecipeSelect={handleRecipeSelect}
      handleRemoveFromFavorites={handleRemoveFromFavorites}
    />
  );

  return (
    <View style={styles.container}>
      {favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.recipeId}
        />
      ) : (
        <Text>No favorite recipes found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 10,
  },
});

export default FavoriteRecipesScreen;
