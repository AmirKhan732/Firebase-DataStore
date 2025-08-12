import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  decreaseQty,
  searchItems,
  subscribeItems,
  deleteAllItems,
  deleteSingleItem,
} from "../../firestoreHelpers";
import { db } from "../../firebaseConfig";
import { TextInput } from "react-native-paper";
import EditProductModal from "./EditProductModal";
import { doc, updateDoc } from "firebase/firestore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomLoader from "./CustomLoader";
import DeleteAllProduct from "./DeleteAllProduct";

export default function AllProduct() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeItems((items) => {
      setFilteredItems(items);
      setLoading(false); // stop loader after data fetch
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsub = subscribeItems((data) => {
      // Sort latest first
      const sorted = [...data].sort((a, b) => {
        if (a.createdAt?.seconds && b.createdAt?.seconds) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      });
      setItems(sorted);
      setFilteredItems(sorted);
    });
    return () => unsub();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredItems(items);
    } else {
      const lowerText = text.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(lowerText) ||
          item.type?.toLowerCase().includes(lowerText)
      );
      setFilteredItems(filtered);
    }
  };

  useEffect(() => {
    const unsub = subscribeItems(setItems);
    return () => unsub();
  }, []);

  // const handleDeleteAll = () => {
  //   Alert.alert("Confirm Delete", "Delete all products?", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Delete",
  //       style: "destructive",
  //       onPress: async () => {
  //         await deleteAllItems();
  //       },
  //     },
  //   ]);
  // };

  const handleDeleteSingle = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete Product",
          onPress: async () => {
            await deleteSingleItem(id);
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const handleDecreaseQuantity = (id, qty) => {
    if (qty > 0) {
      Alert.alert(
        "Confirm Decrease",
        "Are you sure you want to decrease the quantity?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Decrease",
            onPress: () => decreaseQty(id),
          },
        ]
      );
    }
  };

  const handleSaveChanges = async () => {
    if (!editItem) return;
    const docRef = doc(db, "items", editItem.id);
    await updateDoc(docRef, {
      name: editItem.name,
      type: editItem.type,
      qty: Number(editItem.qty),
      price: Number(editItem.price),
    });
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => handleDecreaseQuantity(item.id, item.qty)}
          >
            <FontAwesome name="minus-square" size={24} color="#ef5350" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setEditItem(item);
              setModalVisible(true);
            }}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.detail}>Type: {item.type}</Text>
      <View style={styles.row}>
        <Text style={styles.detail}>
          Quantity: <Text style={styles.PriceColor}>{item.qty}</Text>
        </Text>
        <Text style={styles.detail}>
          PKR: <Text style={styles.PriceColor}>{item.price}</Text>
        </Text>
      </View>
      <Text style={styles.date}>
        Created:
        <Text style={{ fontWeight: "bold" }}> {item.created || "N/A"}</Text>
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <CustomLoader />
      ) : (
        <>
          {/* <View style={{ margin: 16 }}>
        <Button
          title="Delete All Products"
          color="red"
          onPress={handleDeleteAll}
        />
      </View> */}
      {/* <DeleteAllProduct /> */}
          <TextInput
            label="Search"
            mode="outlined"
            value={searchText}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
          <EditProductModal
            visible={modalVisible}
            product={editItem}
            onClose={() => setModalVisible(false)}
            onSave={handleSaveChanges}
            onDelete={handleDeleteSingle}
            setProduct={setEditItem}
          />
        </>
      )}
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
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 18, fontWeight: "bold" },
  detail: { fontSize: 14, color: "#777", marginTop: 5, fontWeight: "bold" },
  date: { fontSize: 12, color: "#777", marginTop: 5 },
  PriceColor: { color: "green", fontWeight: "bold", fontSize: 18 },
  iconButton: { marginLeft: 10 },
  searchInput: {
    margin: 16,
  },
});
