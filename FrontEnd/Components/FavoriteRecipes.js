import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

const backendUrl = "http://192.168.1.6:8000";

const LikedRecipesScreen = () => {
  const isFocused = useIsFocused();
  const [likedRecipes, setLikedRecipes] = useState([]);

  useEffect(() => {
    if (isFocused) {
      fetchLikedRecipes();
    }
  }, [isFocused]);

  const fetchLikedRecipes = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      const response = await axios.get(`${backendUrl}/getFavoriteRecipes`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (response.status === 200) {
        setLikedRecipes(response.data.likedRecipes);
      }
    } catch (error) {
      console.error("Failed to fetch liked recipes:", error.message);
    }
  };

  const renderRecipeItem = ({ item }) => {
    const { name, image, source } = item;

    return (
      <View style={styles.recipeItem}>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <Text style={styles.recipeTitle}>{name}</Text>
        <Text style={styles.recipeSource}>{source}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={likedRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.uniqueId}
        ListEmptyComponent={<Text>No liked recipes found.</Text>}
      />
    </View>
  );
};

export default LikedRecipesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  recipeItem: {
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recipeSource: {
    fontSize: 14,
    color: "gray",
  },
});
