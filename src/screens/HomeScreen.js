import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AllProduct from "../components/AllProduct";
import ProductForm from "../components/ProductForm";

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
      <View style={{}}>
        <ProductForm
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
  fab: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#356558c5",
    borderRadius: 50,
    padding: 16,
    elevation: 5,
  },
});
