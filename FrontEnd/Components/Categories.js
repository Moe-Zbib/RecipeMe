import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";

const Categories = () => {
  const categories = [
    { name: "Drinks", icon: "md-ice-cream" },
    { name: "Savory", icon: "md-restaurant" },
    { name: "Morning", icon: "md-sunny" },
    { name: "Beverages", icon: "md-beer" },
    { name: "Spicy", icon: "md-flame" },
    { name: "Healthy", icon: "md-heart" },
    { name: "Comfort Food", icon: "md-pizza" },
  ];

  const navigation = useNavigation();

  const handleCategorySelect = async (category) => {
    try {
      const response = await axios.post(
        "http://192.168.1.6:8000/searchRecipes",
        {
          query: category,
        }
      );

      const recipes = response.data;
      navigation.navigate("RecipeList", { recipes, query: category });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {categories.map((category) => (
          <View style={styles.subcontainer} key={category.name}>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => handleCategorySelect(category.name)}>
              <Ionicons name={category.icon} size={35} color="#1a2626" />
            </TouchableOpacity>
            <Text style={styles.categoryButtonText}>{category.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9E9E9",
    paddingVertical: 25,
    paddingHorizontal: 22,
    borderRadius: 50,
    marginBottom: 10,
  },
  categoryButtonText: {
    color: "#1a2626",
    fontSize: 12,
  },
  subcontainer: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginRight: 15,
    marginLeft: 10,
  },
});
