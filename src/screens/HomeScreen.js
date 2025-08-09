import React, { useState } from "react";
import {
  Modal,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AllProduct from "../components/AllProduct";
import ProductForm from "../components/ProductForm";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <AllProduct />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="fade" transparent>
        <ProductForm onClose={() => setModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(174, 174, 174, 0.5)" },
  fab: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#007bff",
    borderRadius: 50,
    padding: 16,
    elevation: 5,
  },
});
