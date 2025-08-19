import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  ScrollView,
  BackHandler,
  SafeAreaView,
} from "react-native";
import ProductCard from "./ProductCard";
import CustomLoader from "./CustomLoader";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { decreaseQty, subscribeItems } from "../../firestoreHelpers";

export default function AllProduct() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const navigation = useNavigation();
  const inputRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      if (inputRef.current?.isFocused()) {
        inputRef.current.blur();
        setSearchText("");
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeItems((data) => {
      const sortedByDate = [...data].sort((a, b) => {
        if (a.createdAt?.seconds && b.createdAt?.seconds) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      });
      setItems(sortedByDate);
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

  const sortedFilteredItems = [...filteredItems].sort((a, b) => {
    const priority = (item) => (item.qty < 5 ? 1 : item.qty < 11 ? 2 : 3);
    return priority(a) - priority(b);
  });

  const handleDecreaseQuantity = useCallback((id, qty) => {
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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <CustomLoader />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            ref={inputRef}
            label="Search by name or type"
            mode="outlined"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            activeOutlineColor="#326935ff"
          />
          <FlatList
            data={sortedFilteredItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
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
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchInput: { margin: 16 },
});
