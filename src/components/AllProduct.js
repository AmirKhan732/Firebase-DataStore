import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { decreaseQty, subscribeItems } from "../../firestoreHelpers";
import ProductCard from "./ProductCard";
import CustomLoader from "./CustomLoader";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function AllProduct() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = subscribeItems((data) => {
      const sorted = [...data].sort((a, b) => {
        if (a.createdAt?.seconds && b.createdAt?.seconds) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      });
      setItems(sorted);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredItems = items.filter((item) => {
    if (!searchText.trim()) return true;
    const lowerText = searchText.toLowerCase();
    return (
      item.name?.toLowerCase().includes(lowerText) ||
      item.type?.toLowerCase().includes(lowerText)
    );
  });

  const handleDecreaseQuantity = (id, qty) => {
    if (qty > 0) {
      Alert.alert(
        "Confirm Decrease",
        "Are you sure you want to decrease the quantity?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes, Decrease", onPress: () => decreaseQty(id) },
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
            onChangeText={setSearchText}
            style={styles.searchInput}
            activeOutlineColor="#326935ff"
          />

          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
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
            ListEmptyComponent={<CustomLoader text="No products found" small />}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchInput: { margin: 16 },
});
