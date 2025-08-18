// components/ImagePickerField.js
import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "../services/uploadToCloudinary"; // <-- your helper
import { MaterialIcons } from "@expo/vector-icons";

export default function ImagePickerField({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  // Pick an image from device
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setUploading(true);

      try {
        const uploaded = await uploadToCloudinary(localUri, "items"); // upload to cloudinary
        const imageData = {
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height,
          format: uploaded.format,
        };

        onChange(imageData); // pass uploaded image object back to parent
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.wrapper} onPress={pickImage}>
      {uploading ? (
        <ActivityIndicator size="large" color="#326935c3" />
      ) : value?.url ? (
        <Image source={{ uri: value.url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <MaterialIcons name="cloud-upload" size={40} color="#aaa" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 180,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
