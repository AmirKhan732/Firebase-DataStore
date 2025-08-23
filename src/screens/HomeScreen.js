import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  BackHandler,
  ScrollView,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductCard from "../components/ProductCard";
import { useNavigation } from "@react-navigation/native";
import LoadingComponent from "../components/LoadingComponent";
import { decreaseQty, subscribeItems } from "../../firestoreHelpers";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
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
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
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
      <StatusBar barStyle="light-content" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingComponent />
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              ref={inputRef}
              label="Search by Name or Type"
              mode="outlined"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              activeOutlineColor="#3a2c34ff"
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
              ListEmptyComponent={
                <LoadingComponent text="No products found" small />
              }
            />
          </ScrollView>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate("AddProduct")}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: { margin: 16 },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#326935cb",
    borderRadius: 50,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
});
