import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View, Text, Image, StyleSheet } from "react-native";

const RecipeDetails = ({ route, navigation }) => {
  const { recipe } = route.params;
  const { name, image, source, ingredients } = recipe;

  const handleBackToRecipes = () => {
    navigation.goBack();
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          title="Back to Recipes"
          onPress={handleBackToRecipes}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.recipeName}>{name}</Text>
        <Text style={styles.source}>Source: {source}</Text>
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            {ingredient}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  detailsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  source: {
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default RecipeDetails;
