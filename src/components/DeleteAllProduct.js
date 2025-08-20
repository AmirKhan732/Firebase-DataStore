import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { deleteAllItems } from "../../firestoreHelpers";
import { useNavigation } from "@react-navigation/native";

const DeleteAllProduct = () => {
  const [code, setCode] = useState("");
  const STATIC_CODE = "DELETE123";
  const navigation = useNavigation();
  const handleDelete = async () => {
    if (code !== STATIC_CODE) {
      Alert.alert(
        "Invalid Code",
        "Please enter the correct verification code."
      );
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all products?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAllItems();
            setCode("");
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Enter Verification Code to Delete All Products:
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Code"
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete All Products</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAllProduct;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
