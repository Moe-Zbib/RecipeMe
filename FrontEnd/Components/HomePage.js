import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  RefreshControl,
} from "react-native";
import SquareCard from "./SquareCard";

import RecipeDetails from "./RecipeDetails";
import axios from "axios";

import Categories from "./Categories";
import Random from "./Random";

const backendUrl = "http://192.168.1.6:8000";

const HomePage = ({ navigation }) => {
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRecommendedRecipes();
  }, []);

  const fetchRecommendedRecipes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/getRandomRecipes/6`);
      if (response.status === 200) {
        setRecommendedRecipes(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendedRecipes();
    setRefreshing(false);
  };

  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View style={styles.container}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Categories />
        </View>
        <View
          style={{
            alignItems: "flex-start",
            width: "95%",
          }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: "#2f2f2f",
              paddingLeft: 10,
            }}>
            Recommended
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.squareContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {recommendedRecipes.map((recipe) => (
            <SquareCard
              key={recipe.uniqueId} // Use a unique identifier as the key
              recipe={recipe}
              onSelect={handleRecipeSelect}
            />
          ))}
        </ScrollView>

        <View>
          <Random />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    justifyContent: "flex-start",
    padding: 0,
    backgroundColor: "#F4F4F4",
  },
  squareContainer: {
    flexDirection: "row",
    marginTop: 1,
  },
});

export default HomePage;
