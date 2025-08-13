import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, SafeAreaView } from "react-native";
import {
  decreaseQty,
  subscribeItems,
  deleteSingleItem,
} from "../../firestoreHelpers";
import ProductCard from "./ProductCard";
import { db } from "../../firebaseConfig";
import CustomLoader from "./CustomLoader";
import { TextInput } from "react-native-paper";
import EditProductModal from "./EditProductModal";
import { doc, updateDoc } from "firebase/firestore";

export default function AllProduct() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false); // ✅ Loader for modal actions

  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeItems((items) => {
      setFilteredItems(items);
      setLoading(false);
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

  const handleDeleteSingle = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete Product",
          onPress: async () => {
            try {
              setModalLoading(true); // ✅ Start loader
              await deleteSingleItem(id);
              setModalVisible(false);
            } finally {
              setModalLoading(false); // ✅ Stop loader
            }
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
    try {
      setModalLoading(true); 
      const docRef = doc(db, "items", editItem.id);
      await updateDoc(docRef, {
        name: editItem.name,
        type: editItem.type,
        qty: Number(editItem.qty),
        price: Number(editItem.price),
        description: editItem.description,
      });
      setModalVisible(false);
    } finally {
      setModalLoading(false); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <CustomLoader />
      ) : (
        <>
          <TextInput
            label="Search"
            mode="outlined"
            value={searchText}
            onChangeText={handleSearch}
            style={styles.searchInput}
            activeOutlineColor="#326935ff"
          />
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                expanded={expandedId === item.id}
                onToggleExpand={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
                onDecreaseQuantity={handleDecreaseQuantity}
                onEdit={(product) => {
                  setEditItem(product);
                  setModalVisible(true);
                }}
              />
            )}
          />
          <EditProductModal
            visible={modalVisible}
            product={editItem}
            onClose={() => setModalVisible(false)}
            onSave={handleSaveChanges}
            onDelete={handleDeleteSingle}
            setProduct={setEditItem}
            loading={modalLoading} // ✅ Pass down
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchInput: {
    margin: 16,
  },
});
