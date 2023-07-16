import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const backendUrl = "http://192.168.1.6:8000";

const FavoriteButton = ({ recipeId }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAddToFavorites = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");

      let endpoint = "";
      if (isFavorited) {
        endpoint = `${backendUrl}/removeFavoriteRecipe`;
      } else {
        endpoint = `${backendUrl}/addFavoriteRecipe`;
      }

      const response = await axios.post(
        endpoint,
        { recipeId },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      if (response.status === 200) {
        setIsFavorited(!isFavorited);
      }
    } catch (error) {
      console.error("Failed to add/remove recipe to favorites:", error.message);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleAddToFavorites}
      style={[
        styles.favoriteButton,
        { borderColor: isFavorited ? "orange" : "gray" },
      ]}>
      <FontAwesome
        name={isFavorited ? "heart" : "heart-o"}
        size={24}
        color={isFavorited ? "orange" : "black"}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  favoriteButton: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    marginVertical: 5,
    alignSelf: "flex-end",
  },
});

export default FavoriteButton;
