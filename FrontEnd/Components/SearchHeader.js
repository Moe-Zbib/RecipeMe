// SearchHeader.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import EdamamAPI from "../Api/EdamamApi";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const SearchHeader = () => {
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  const handleSearch = async () => {
    try {
      console.log("Query:", query);

      const response = await axios.post(
        "http://192.168.1.6:8000/searchRecipes",
        {
          query,
        }
      );

      console.log("Response:", response.data);

      const recipes = response.data;
      const recipeNames = recipes.map((recipe) => recipe.name); // Extract recipe names

      console.log("Recipe Names:", recipeNames);

      navigation.navigate("RecipeList", { recipes, query });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="e.g., chicken, pasta, salad"
          onChangeText={(text) => setQuery(text)}
          style={styles.searchInput}
        />
        <TouchableOpacity
          style={{
            padding: 15,
            borderRadius: 10,
            backgroundColor: "#F16D35",
          }}
          onPress={handleSearch}>
          <MaterialIcons name="search" size={32} color="#F4F4F4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: "#F4F4F4",
    marginTop: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: "#E9E9E9",
    fontSize: 16,
    padding: 15,
  },
});

export default SearchHeader;
