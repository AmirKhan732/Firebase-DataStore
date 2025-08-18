import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { addItem } from "../../firestoreHelpers";
import { TextInput, Button } from "react-native-paper";

import * as ImagePicker from "expo-image-picker";

export default function ProductForm({ navigation }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [purchaseRate, setPurchaseRate] = useState("");
  const [purchaseShop, setPurchaseShop] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry we need camera permission");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (
      !name.trim() ||
      !qty.trim() ||
      !type.trim() ||
      !price.trim() ||
      !description.trim() ||
      !purchaseRate.trim()
      //   !purchaseShop.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await addItem({
        name: name.trim(),
        qty,
        type: type.trim(),
        price,
        description: description.trim(),
        purchase_rate: purchaseRate.trim(),
        purchase_shop: purchaseShop.trim(),
      });

      setName("");
      setQty("");
      setType("");
      setPrice("");
      setDescription("");
      setPurchaseRate("");
      setPurchaseShop("");
      setError("");

      navigation.goBack();
    } catch (err) {
      setError("Error adding item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          backgroundColor: "#fff",
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Entypo
            name="arrow-left"
            size={26}
            color="#ef5350"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Add New Product Details</Text>
        </View>
        <View>
          <Button
            style={styles.addButton}
            mode="contained"
            onPress={openCamera}
          >
            Image
          </Button>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200, marginTop: 20 }}
            />
          )}
          <Text>kljkdasgfk</Text>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          label="Name"
          mode="outlined"
          style={styles.input}
          value={name}
          onChangeText={setName}
          activeOutlineColor="#326935c3"
        />
        <TextInput
          label="Type"
          mode="outlined"
          style={styles.input}
          value={type}
          onChangeText={setType}
          activeOutlineColor="#326935c3"
        />
        <TextInput
          label="Quantity"
          mode="outlined"
          style={styles.input}
          value={qty}
          keyboardType="numeric"
          onChangeText={setQty}
          activeOutlineColor="#326935c3"
        />
        <TextInput
          label="Price"
          mode="outlined"
          style={styles.input}
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
          activeOutlineColor="#326935c3"
        />
        <View style={styles.separator}>
          <TextInput
            label="Purchase Rate"
            mode="outlined"
            style={[styles.input, { width: "45%" }]}
            value={purchaseRate}
            keyboardType="numeric"
            onChangeText={setPurchaseRate}
            activeOutlineColor="#326935c3"
          />
          <TextInput
            label="Purchase Shop"
            mode="outlined"
            style={[styles.input, { width: "45%" }]}
            value={purchaseShop}
            onChangeText={setPurchaseShop}
            activeOutlineColor="#326935c3"
          />
        </View>
        <TextInput
          label="Description"
          mode="outlined"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          activeOutlineColor="#326935c3"
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#326935c3"
            style={{ marginTop: 20 }}
          />
        ) : (
          <Button mode="contained" style={styles.addButton} onPress={handleAdd}>
            Add Item
          </Button>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
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
    marginTop: 15,
    backgroundColor: "#326935c3",
  },
  separator: { flexDirection: "row", justifyContent: "space-between" },
});
