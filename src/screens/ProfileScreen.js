import React from "react";
import { StyleSheet, Text, View } from "react-native";
import DeleteAllProduct from "../components/DeleteAllProduct";


const Profilescreen = () => {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <DeleteAllProduct />
    </View>
  );
};

export default Profilescreen;

const styles = StyleSheet.create({});
