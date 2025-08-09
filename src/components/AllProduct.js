import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  subscribeItems,
  deleteAllItems,
  decreaseQty,
} from "../../firestoreHelpers";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function AllProduct() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = subscribeItems(setItems);
    return () => unsub();
  }, []);

  const handleDeleteAll = () => {
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
          },
        },
      ]
    );
  };

  const handleDecreaseQuantity = (id, qty) => {
    Alert.alert(
      "Confirm Decrease",
      "Are you sure you want to decrease this product's quantity?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Decrease",
          style: "destructive",
          onPress: async () => {
            if (qty > 0) {
              await decreaseQty(id);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={{flexDirection:"row",}}>
          <TouchableOpacity
            style={styles.minusButton}
            onPress={() => handleDecreaseQuantity(item.id, item.qty)}
          >
            <FontAwesome name="minus-square" size={24} color="black" />
          </TouchableOpacity>
          <MaterialCommunityIcons name="dots-vertical-circle-outline" size={24} color="black" />
        </View>
      </View>
      <Text style={styles.detail}>Type: {item.type}</Text>
      <View style={styles.row}>
        <Text style={styles.detail}>
          Quantity: <Text style={styles.PriceColor}>{item.qty}</Text>
        </Text>
        <Text>
          PKR: <Text style={styles.PriceColor}>{item.price}</Text>
        </Text>
      </View>

      <Text style={styles.date}>
        Created:{" "}
        {item.created?.toDate
          ? item.created.toDate().toLocaleString()
          : item.created || "N/A"}
      </Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ margin: 16 }}>
        <Button
          title="Delete All Products"
          color="red"
          onPress={handleDeleteAll}
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 4, color: "#353839" },
  detail: { fontSize: 16, color: "#333", marginBottom: 4 },
  date: { fontSize: 12, color: "#999" },
  PriceColor: {
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  minusButton: {
    marginRight: 10,
  },
  minusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
