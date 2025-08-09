import React, { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { addItem } from "../../firestoreHelpers";
import { serverTimestamp } from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function ProductForm({ onClose }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!name.trim() || !qty.trim() || !type.trim() || !price.trim()) {
      setError("All fields are required.");
      return;
    }
    try {
      await addItem({
        name: name.trim(),
        qty,
        type: type.trim(),
        price,
        created: serverTimestamp(),
      });
      setName("");
      setQty("");
      setType("");
      setPrice("");
      setError("");

      onClose(); 
    } catch (err) {
      setError("Error adding item. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.modalBackground}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.boxContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Add New Product</Text>
            <Entypo
              onPress={onClose}
              name="circle-with-cross"
              size={24}
              color="red"
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
            <TextInput
              style={styles.input}
              placeholder="Type"
              value={type}
              onChangeText={setType}
            />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={qty}
            keyboardType="numeric"
            onChangeText={setQty}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            keyboardType="numeric"
            onChangeText={setPrice}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  boxContainer: {
    width: width * 0.92,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
