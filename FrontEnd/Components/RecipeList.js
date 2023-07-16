import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FavoriteButton from "./FavButton";

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
        setLikedRecipes(response.data.likedRecipes);
      }
    } catch (error) {
      console.error("Failed to fetch liked recipes:", error.message);
    }
  };

  const handleRecipeSelect = (recipe) => {
    navigation.navigate("RecipeDetails", { recipe });
  };

  // ...

  const isRecipeFavorited = (recipe) => {
    return likedRecipes.some(
      (likedRecipe) => likedRecipe.uniqueId === recipe.uniqueId
    );
  };

  const renderRecipeItem = ({ item }) => {
    const { name, image, source, uniqueId } = item;
    const isFavorited = isRecipeFavorited(item);

    return (
      <View style={styles.recipeItem}>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.recipeDetailsContainer}>
          {name && <Text style={styles.recipeTitle}>{name}</Text>}
          {source && <Text style={styles.recipeSource}>{source}</Text>}
          {/* Render the FavoriteButton component and pass the recipeId */}
          <FavoriteButton recipeId={uniqueId} />
        </View>
      </View>
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
