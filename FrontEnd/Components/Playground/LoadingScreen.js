import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

const LoadingScreen = () => {
  const [logoColor, setLogoColor] = useState("#000000");

  useEffect(() => {
    // Change the logo color every 1 second
    const interval = setInterval(() => {
      setLogoColor((prevColor) =>
        prevColor === "#000000" ? "#FF0000" : "#000000"
      );
    }, 1000);

    // Clean up the interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../Components/Pictures/black-circle-icon-23.png")}
        style={[styles.logo, { tintColor: logoColor }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default LoadingScreen;
