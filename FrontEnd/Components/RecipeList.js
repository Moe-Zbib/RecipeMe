import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const backendUrl = "http://192.168.1.6:8000";

const RecipeList = ({ navigation, route }) => {
  const { recipes, query } = route.params;
  const [likedRecipes, setLikedRecipes] = useState([]);

  useEffect(() => {
    fetchLikedRecipes();
  }, []);

  const handleSuccessfulAuth = async (sessionToken) => {
    console.log("Session token:", sessionToken);
    await AsyncStorage.setItem("sessionToken", sessionToken);
    fetchLikedRecipes();
  };

  const fetchLikedRecipes = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      const response = await axios.get(`${backendUrl}/getFavoriteRecipes`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (response.status === 200) {
        const { likedRecipes } = response.data;
        setLikedRecipes(likedRecipes);
      }
    } catch (error) {
      console.error("Failed to fetch liked recipes:", error.message);
    }
  };

  const handleRecipeSelect = (recipe) => {
    navigation.navigate("RecipeDetails", { recipe });
  };

  const handleAddToFavorites = async (recipe) => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      const isFavorited = likedRecipes.some(
        (likedRecipe) => likedRecipe.recipeId === recipe.uri
      );

      let response;
      if (isFavorited) {
        // If the recipe is already favorited, remove it from favorites
        response = await axios.delete(`${backendUrl}/removeFavoriteRecipe`, {
          data: {
            recipeId: recipe.uri,
          },
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
      } else {
        // If the recipe is not favorited, add it to favorites
        response = await axios.post(
          `${backendUrl}/addFavoriteRecipe`,
          {
            recipeId: recipe.uri,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
      }

      if (response.status === 200) {
        if (isFavorited) {
          console.log("Recipe removed from favorites:", recipe.label);
          setLikedRecipes((prevLikedRecipes) =>
            prevLikedRecipes.filter(
              (likedRecipe) => likedRecipe.recipeId !== recipe.uri
            )
          );
        } else {
          console.log("Recipe added to favorites:", recipe.label);
          setLikedRecipes((prevLikedRecipes) => [
            ...prevLikedRecipes,
            {
              recipeId: recipe.uri,
              recipeName: recipe.label,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Failed to add/remove recipe to favorites:", error.message);
    }
  };

  const renderRecipeItem = ({ item }) => {
    const { name, image, source, uniqueId } = item;
    const isFavorited = likedRecipes.some(
      (likedRecipe) => likedRecipe.recipeId === item.uri
    );

    return (
      <TouchableOpacity
        style={styles.recipeItem}
        key={item.recipeId}
        onPress={() => handleRecipeSelect(item)}>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.recipeDetailsContainer}>
          {name && <Text style={styles.recipeTitle}>{name}</Text>}
          {uniqueId && (
            <Text style={styles.recipeUniqueId}>ID: {uniqueId}</Text>
          )}
          {source && <Text style={styles.recipeSource}>{source}</Text>}
          <TouchableOpacity
            onPress={() => handleAddToFavorites(item)}
            style={styles.favoriteButton}>
            <FontAwesome
              name={isFavorited ? "heart" : "heart-o"}
              size={24}
              color={isFavorited ? "red" : "black"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {recipes && recipes.length > 0 ? (
          <FlatList
            data={recipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
          />
        ) : (
          <Text>No recipes found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default RecipeList;

const { width } = Dimensions.get("window");
const itemWidth = (width - 30) / 2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f6",
    padding: 10,
  },
  contentContainer: {
    alignItems: "center",
  },
  recipeItem: {
    width: itemWidth - 10,
    overflow: "hidden",
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
    margin: 8,
  },
  image: {
    width: itemWidth,
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
});
