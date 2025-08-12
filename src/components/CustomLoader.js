import React, { useRef, useEffect, useState } from "react";
import { View, Image, Animated, Easing, Dimensions, StyleSheet } from "react-native";
import logo from "../assets/logo.png"; 
// import Colors from "../Common/Colors";

const screenWidth = Dimensions.get("window").width;

const CustomLoader = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loaderContainer}>
      <Animated.View style={[styles.loaderCircle, { transform: [{ rotate: spin }] }]}>
        <View style={styles.loaderInnerCircle} />
      </Animated.View>
      <Image source={logo} style={styles.logoImage} />
    </View>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  loaderContainer: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor:  "#fff",
  zIndex: 999,
},
  loaderCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderTopWidth: 4,
    borderTopColor:"red",
    borderRightWidth: 4,
    borderRightColor: "transparent",
    position: "absolute",
  },
  loaderInnerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    position: "absolute",
    borderBottomWidth: 4,
    borderBottomColor:"green",
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  logoImage: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    zIndex: 10,
  },
});
