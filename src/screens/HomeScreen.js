import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AllProduct from "../components/AllProduct";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <AllProduct />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#326935cb",
    borderRadius: 50,
    padding: 16,
    elevation: 5,
  },
});
