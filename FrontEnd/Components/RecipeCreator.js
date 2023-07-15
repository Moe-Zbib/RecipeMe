import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import axios from "axios";

const RecipeCreator = () => {
  const [ingredients, setIngredients] = useState("");
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const backendURL = "http://192.168.1.5:8000"; // Replace with your backend server URL

  const handleSuggestRecipes = () => {
    axios
      .post(`${backendURL}/suggest-recipes`, {
        ingredients: ingredients.split(","),
      })
      .then((response) => {
        const { suggestedRecipes } = response.data;
        setSuggestedRecipes(suggestedRecipes);
      })
      .catch((error) => {
        console.error("Error suggesting recipes:", error);
      });
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Enter ingredients (comma-separated)"
        value={ingredients}
        onChangeText={setIngredients}
      />
      <Button title="Suggest Recipes" onPress={handleSuggestRecipes} />
      <Text style={styles.title}>Suggested Recipes:</Text>
      {suggestedRecipes.map((recipe, index) => (
        <Text key={index}>{recipe}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default RecipeCreator;
