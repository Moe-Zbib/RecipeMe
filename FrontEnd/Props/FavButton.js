import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const FavoriteButton = ({ isFavorited, onPress }) => {
  return (
    <TouchableOpacity style={styles.favoriteButton} onPress={onPress}>
      <Text
        style={
          isFavorited
            ? styles.favoriteButtonTextActive
            : styles.favoriteButtonText
        }>
        {isFavorited ? "Unfavorite" : "Favorite"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  favoriteButton: {
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  favoriteButtonText: {
    fontSize: 12,
    color: "gray",
  },
  favoriteButtonTextActive: {
    fontSize: 12,
    fontWeight: "bold",
    color: "red",
  },
});

export default FavoriteButton;
