import React from "react";
import { Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { deleteAllItems } from "../../firestoreHelpers";

export default function DeleteAllProduct() {
    
  const handleDeleteAll = () => {
    Alert.alert("Confirm Delete", "Delete all products?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteAllItems();
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleDeleteAll}>
      <Text style={styles.buttonText}>Delete All Products</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
