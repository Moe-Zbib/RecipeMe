import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const Random = () => {
  return (
    <View
      style={{
        backgroundColor: "#2f2f2f",
        margin: 10,
        flexDirection: "row",
        borderRadius: 20,
        height: 200,
        justifyContent: "space-between",
      }}>
      <View
        style={{
          width: "50%",
          padding: 20,

          justifyContent: "center",
        }}>
        <Text
          style={{
            color: "#ffcb74",
            fontSize: 34,
            fontWeight: "bold",
          }}>
          Burgers?
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 30,
            fontWeight: "bold",
          }}>
          Right on!
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",

          padding: 10,
        }}>
        <Image
          source={require("./Pictures/Food/Pizza.png")}
          style={{
            width: 170,
            height: 170,
          }}
        />
      </View>
    </View>
  );
};

export default Random;

const styles = StyleSheet.create({});
