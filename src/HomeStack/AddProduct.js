import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";
import { TextInput, Button } from "react-native-paper";
import { addItem } from "../../firestoreHelpers";

export default function ProductForm({ navigation }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [purchaseRate, setPurchaseRate] = useState("");
  const [purchaseShop, setPurchaseShop] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkIfToday = () => {
    const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
    const staticDate = "2025-08-20"; // static test date
    return today === staticDate;
  };

  // Pick an image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      console.log("Picked image:", result.assets[0].uri);
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
    ) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const item = await addItem({
        name: name.trim(),
        qty,
        type: type.trim(),
        price,
        description: description.trim(),
        purchase_rate: purchaseRate.trim(),
        purchase_shop: purchaseShop.trim(),
        imageUri,
      });
      // console.log("Item saved in Firestore:", item);
      setName("");
      setQty("");
      setType("");
      setPrice("");
      setDescription("");
      setPurchaseRate("");
      setPurchaseShop("");
      setImageUri(null);
      setError("");

      navigation.goBack();
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Error adding item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Entypo
            name="arrow-left"
            size={30}
            color="#ef5350"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Add New Product</Text>
        </View>
        <TouchableOpacity style={styles.bgImagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.uploadedImage}
              resizeMode="cover"
            />
          ) : (
            <>
              <Image
                source={require("../assets/upload.png")}
                style={styles.uploadPlaceholder}
                resizeMode="contain"
              />
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                Uploaod Image
              </Text>
            </>
          )}
        </TouchableOpacity>
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

        <View style={styles.row}>
          <TextInput
            label="Purchase Rate"
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            value={purchaseRate}
            keyboardType="numeric"
            onChangeText={setPurchaseRate}
            activeOutlineColor="#326935c3"
          />
          <TextInput
            label="Purchase Shop"
            mode="outlined"
            style={[styles.input, styles.halfInput]}
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

        {/* Button */}
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
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  bgImagePicker: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  uploadedImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  uploadPlaceholder: {
    width: 80,
    height: 80,
    opacity: 0.6,
  },
  input: {
    marginBottom: 12,
  },
  addButton: {
    marginTop: 15,
    backgroundColor: "#3a2c34ff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
});
