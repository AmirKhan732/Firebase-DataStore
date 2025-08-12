import React, { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Modal } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { TextInput, Button } from "react-native-paper";
import { addItem } from "../../firestoreHelpers";
import { serverTimestamp } from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function ProductForm({ visible, onClose }) {
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
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Product</Text>
            <Entypo
              onPress={onClose}
              name="circle-with-cross"
              size={26}
              color="#ef5350"
              style={styles.closeButton}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
              label="Name"
              mode="outlined"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              label="Type"
              mode="outlined"
              style={styles.input}
              value={type}
              onChangeText={setType}
            />
            <TextInput
              label="Quantity"
              mode="outlined"
              style={styles.input}
              value={qty}
              keyboardType="numeric"
              onChangeText={setQty}
            />
            <TextInput
              label="Price"
              mode="outlined"
              style={styles.input}
              value={price}
              keyboardType="numeric"
              onChangeText={setPrice}
            />
            <Button
              mode="contained"
              style={styles.addButton}
              onPress={handleAdd}
            >
              Add Item
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
   backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    position: "relative",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 15,
  },
});
