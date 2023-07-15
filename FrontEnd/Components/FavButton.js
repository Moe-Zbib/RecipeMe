import React, { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import axios from "axios";

const backendUrl = "http://192.168.1.6:8000";

class FavoriteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likedRecipes: [],
    };
  }

  componentDidMount() {
    this.fetchLikedRecipes();
  }

  handleSuccessfulAuth = async (sessionToken) => {
    console.log("Session token:", sessionToken);
    await AsyncStorage.setItem("sessionToken", sessionToken);
    this.fetchLikedRecipes();
  };

  fetchLikedRecipes = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      const response = await axios.get(`${backendUrl}/getFavoriteRecipes`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (response.status === 200) {
        const { likedRecipes } = response.data;
        this.setState({ likedRecipes });
      }
    } catch (error) {
      console.error("Failed to fetch liked recipes:", error.message);
    }
  };

  handleAddToFavorites = async (recipe) => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      const { likedRecipes } = this.state;
      const isFavorited = likedRecipes.some(
        (likedRecipe) => likedRecipe.recipeId === recipe.uri
      );

      let response;
      if (isFavorited) {
        response = await axios.delete(`${backendUrl}/removeFavoriteRecipes`, {
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
          `${backendUrl}/saveFavoriteRecipes`,
          {
            recipe: {
              recipeId: recipe.uri,
              recipeName: recipe.label,
            },
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
          this.setState({
            likedRecipes: likedRecipes.filter(
              (likedRecipe) => likedRecipe.recipeId !== recipe.uri
            ),
          });
        } else {
          console.log("Recipe added to favorites:", recipe.label);
          this.setState({
            likedRecipes: [
              ...likedRecipes,
              {
                recipeId: recipe.uri,
                recipeName: recipe.label,
              },
            ],
          });
        }

        this.props.onFavoriteToggle(); // Call the parent component's callback function
      }
    } catch (error) {
      console.error("Failed to add/remove recipe to favorites:", error.message);
    }
  };

  render() {
    const { likedRecipes } = this.state;
    const { recipe } = this.props;
    const isFavorited = likedRecipes.some(
      (likedRecipe) => likedRecipe.recipeId === recipe.uri
    );
  }
}

export default FavoriteButton;
