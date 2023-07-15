import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const RecipeItem = ({
  item,
  isFavorited,
  handleRecipeSelect,
  handleAddToFavorites,
}) => {
  const { label, image, id, source } = item;

  const buttonStyle = [
    styles.addToFavoritesButton,
    isFavorited ? styles.favoritedButton : styles.notFavoritedButton,
    !isFavorited && styles.outlineButton,
  ];

  return (
    <TouchableOpacity
      style={styles.recipeItem}
      key={id}
      onPress={() => handleRecipeSelect(item)}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.recipeDetailsContainer}>
        {label && <Text style={styles.recipeTitle}>{label}</Text>}
        {source && <Text style={styles.recipeSource}>Source: {source}</Text>}
        <TouchableOpacity
          onPress={() => handleAddToFavorites(item)}
          style={buttonStyle}>
          <FontAwesome5
            name={isFavorited ? "heart" : "heart"}
            solid={isFavorited}
            color={isFavorited ? "#F16D35" : "black"}
            size={20}
            style={styles.heartIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recipeItem: {
    width: "100%",
    overflow: "hidden",
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
    margin: 8,
  },
  image: {
    width: "100%",
    height: 150,
    marginBottom: 7,
  },
  recipeDetailsContainer: {
    flex: 1,
    width: "100%",
    padding: 10,
    textAlign: "left",
    justifyContent: "flex-start",
  },
  recipeTitle: {
    fontSize: 14,
    textAlignVertical: "center",
    fontWeight: "bold",
  },
  recipeSource: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  addToFavoritesButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  notFavoritedButton: {
    backgroundColor: "transparent",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "transparent",
  },
  heartIcon: {
    marginRight: 5,
  },
});

export default RecipeItem;
