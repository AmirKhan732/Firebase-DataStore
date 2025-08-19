import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { db } from "../../firebaseConfig";
import AntDesign from "@expo/vector-icons/AntDesign";
import { doc, updateDoc } from "firebase/firestore";
import { TextInput, Button } from "react-native-paper";
import { deleteSingleItem } from "../../firestoreHelpers";

export default function EditProduct({ route, navigation }) {
  const { product: initialProduct } = route.params;
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(initialProduct);

  const handleSave = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "items", product.id);
      await updateDoc(docRef, {
        name: product.name,
        type: product.type,
        qty: Number(product.qty),
        price: Number(product.price),
        description: product.description,
        purchase_rate: Number(product.purchase_rate),
        purchase_shop: product.purchase_shop,
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Delete",
        onPress: async () => {
          setLoading(true);
          await deleteSingleItem(product.id);
          setLoading(false);
          navigation.goBack();
        },
      },
    ]);
  };

  const profit =
    Number(product.price || 0) - Number(product.purchase_rate || 0);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* <View style={styles.header}>
            <AntDesign
              name="arrowleft"
              size={24}
              color="#3a2c34ff"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Update Product Details</Text>
          </View> */}

          <View style={styles.header}>
            <AntDesign
              name="arrowleft"
              size={24}
              color="#3a2c34ff"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Edit Product Details</Text>
          </View>

          <Text style={styles.profitText}>
            Profit: {isNaN(profit) ? "0" : profit}
          </Text>

          <TextInput
            label="Name"
            mode="outlined"
            style={styles.input}
            value={product.name}
            activeOutlineColor="#326935c3"
            onChangeText={(text) => setProduct({ ...product, name: text })}
          />
          <TextInput
            label="Type"
            mode="outlined"
            style={styles.input}
            value={product.type}
            activeOutlineColor="#326935c3"
            onChangeText={(text) => setProduct({ ...product, type: text })}
          />
          <TextInput
            label="Quantity"
            mode="outlined"
            style={styles.input}
            value={String(product.qty)}
            keyboardType="numeric"
            activeOutlineColor="#326935c3"
            onChangeText={(text) => setProduct({ ...product, qty: text })}
          />
          <TextInput
            label="Price"
            mode="outlined"
            style={styles.input}
            value={String(product.price)}
            keyboardType="numeric"
            activeOutlineColor="#326935c3"
            onChangeText={(text) => setProduct({ ...product, price: text })}
          />
          <TextInput
            label="Purchase Rate"
            mode="outlined"
            style={styles.input}
            value={String(product.purchase_rate)}
            keyboardType="numeric"
            activeOutlineColor="#326935c3"
            onChangeText={(text) =>
              setProduct({ ...product, purchase_rate: text })
            }
          />
          <TextInput
            label="Purchase Shop"
            mode="outlined"
            style={styles.input}
            value={product.purchase_shop}
            activeOutlineColor="#326935c3"
            onChangeText={(text) =>
              setProduct({ ...product, purchase_shop: text })
            }
          />
          <TextInput
            label="Description"
            mode="outlined"
            style={styles.input}
            value={product.description ?? ""}
            activeOutlineColor="#326935c3"
            onChangeText={(text) =>
              setProduct({ ...product, description: text })
            }
          />

          {loading ? (
            <ActivityIndicator size="large" color="#326935c3" />
          ) : (
            <View style={{ marginBottom: 35 }}>
              <Button
                mode="contained"
                style={styles.saveButton}
                onPress={handleSave}
              >
                Save
              </Button>
              <Button
                mode="contained"
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                Delete Product
              </Button>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#3a2c34ff",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#ef5350",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profitText: {
    fontSize: 30,
    fontWeight: "600",
    color: "#326935c3",
    marginVertical: 10,
  },
});
