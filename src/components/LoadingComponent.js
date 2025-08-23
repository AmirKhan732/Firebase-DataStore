import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const LoadingComponent = () => {
  const letters = "Loading...".split("");
  const animations = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const createSequence = () => {
      const sequence = letters.map((_, i) =>
        Animated.sequence([
          Animated.timing(animations[i], {
            toValue: -15,
            duration: 130,
            useNativeDriver: true,
          }),
          Animated.timing(animations[i], {
            toValue: 0,
            duration: 130,
            useNativeDriver: true,
          }),
          Animated.delay(100),
        ])
      );
      return Animated.sequence(sequence);
    };

    const loop = Animated.loop(createSequence());
    loop.start();

    return () => loop.stop();
  }, [animations]);

  return (
    <View style={styles.container}>
      {letters.map((letter, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.letter,
            { transform: [{ translateY: animations[i] }] },
          ]}
        >
          {letter}
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  letter: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginHorizontal: 2,
  },
});

export default LoadingComponent;
