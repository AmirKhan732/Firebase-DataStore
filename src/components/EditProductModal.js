import React from "react";
import {
  View,
  Text,
  Modal,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { TextInput, Button } from "react-native-paper";

export default function EditProductModal({
  visible,
  product,
  onClose,
  onSave,
  onDelete,
  setProduct,
}) {
  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Product</Text>
            <TextInput
              label="Name"
              mode="outlined"
              style={styles.input}
              value={product.name}
              onChangeText={(text) => setProduct({ ...product, name: text })}
            />
            <TextInput
              label="Type"
              mode="outlined"
              style={styles.input}
              value={product.type}
              onChangeText={(text) => setProduct({ ...product, type: text })}
            />
            <TextInput
              label="Quantity"
              mode="outlined"
              style={styles.input}
              value={String(product.qty)}
              keyboardType="numeric"
              onChangeText={(text) => setProduct({ ...product, qty: text })}
            />
            <TextInput
              label="Price"
              mode="outlined"
              style={styles.input}
              value={String(product.price)}
              keyboardType="numeric"
              onChangeText={(text) => setProduct({ ...product, price: text })}
            />
            <Button
              mode="contained"
              style={styles.saveButton}
              onPress={onSave}
            >
              Save
            </Button>
            <Button
              mode="contained"
              style={styles.deleteButton}
              onPress={() => onDelete(product.id)}
            >
              Delete Product
            </Button>
            <Entypo
              name="circle-with-cross"
              size={26}
              color="#ef5350"
              style={styles.closeIcon}
              onPress={onClose}
            />
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
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#ef5350",
  },
  closeIcon: {
    position: "absolute",
    top: 20,
    right: 15,
  },
});
