import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import SquareCard from "./SquareCard";
import RecipeDetails from "./RecipeDetails";
import EdamamAPI from "../Api/EdamamApi";
import Random from "./Random";
import Categories from "./Categories";

const HomePage = ({ navigation }) => {
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetchRecommendedRecipes();
  }, []);

  const fetchRecommendedRecipes = async () => {
    try {
      const recipes = await EdamamAPI.getRecommendedRecipes(8);
      setRecommendedRecipes(recipes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
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
    <ScrollView>
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
              key={recipe.uri} // Use a unique identifier as the key
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
