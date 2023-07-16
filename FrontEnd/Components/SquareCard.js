import React, { useState } from "react";
import { TouchableOpacity, Image, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FavoriteButton from "./FavButton";
import { useNavigation } from "@react-navigation/native";

const SquareCard = ({ recipe }) => {
  const { name, image, uniqueId } = recipe;
  const [isFavorited, setIsFavorited] = useState(false);

  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("RecipeDetails", { recipe });
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <TouchableOpacity style={styles.square} onPress={handlePress}>
      <View>
        <Image source={{ uri: image }} style={styles.squareImage} />
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0)"]}
          start={{ x: 0, y: 1.8 }}
          end={{ x: 0, y: 0 }}
          style={styles.overlayContainer}>
          <View style={styles.favoriteButtonContainer}>
            <FavoriteButton
              recipeId={uniqueId}
              isFavorited={isFavorited}
              onToggleFavorite={handleToggleFavorite}
            />
          </View>
          <Text style={styles.overlayText}>{name}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    width: 320,
    height: 350,
    margin: 8,
    marginLeft: 10,
    marginRight: 5,
    borderRadius: 15,
    overflow: "hidden",
  },
  squareImage: {
    height: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  overlayContainer: {
    position: "absolute",
    justifyContent: "space-between",
    display: "flex",
    flex: 1,
    padding: 25,
    height: "100%",
    width: "100%",
    borderRadius: 15,
  },
  favoriteButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  overlayText: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#ffffff",
    textAlign: "center",
    textAlign: "left",
  },
});

export default SquareCard;
