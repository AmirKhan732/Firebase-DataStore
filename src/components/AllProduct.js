import React, { useEffect, useState } from "react";
import {
  Text,
  Alert,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  decreaseQty,
  subscribeItems,
  deleteSingleItem,
} from "../../firestoreHelpers";
import ProductCard from "./ProductCard";
import { db } from "../../firebaseConfig";
import CustomLoader from "./CustomLoader";
import { Button, TextInput } from "react-native-paper";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function AllProduct() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const navigation = useNavigation();

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
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                expanded={expandedId === item.id}
                onToggleExpand={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
                onDecreaseQuantity={handleDecreaseQuantity}
                onEdit={(product) =>
                  navigation.navigate("EditProduct", { product })
                }
              />
            )}
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
