import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  addSimpleItem,
  subscribeSimpleItems,
  deleteOldSimpleItems,
} from "../services/simpleListHelpers";

export default function PurchaseList() {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    deleteOldSimpleItems();

    const unsubscribe = subscribeSimpleItems(setItems);
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!name || !qty) return;
    await addSimpleItem({ name, qty });
    setName("");
    setQty("");
  };

  const generatePDF = async () => {
    if (items.length === 0) {
      Alert.alert("No items", "There are no items to download.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Product List (${today})</h1>
          <table>
            <tr>
              <th>Product To Purchase</th>
              <th>Quantity</th>
            </tr>
            ${items
              .map(
                (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.qty}</td>
                </tr>
              `
              )
              .join("")}
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html,
      fileName: `ProductList-${today}.pdf`,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("PDF saved", `Saved to: ${uri}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchase Product List</Text>

      <TextInput
        label="Product Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Quantity"
        mode="outlined"
        value={qty}
        onChangeText={setQty}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button mode="contained" style={styles.button} onPress={handleAdd}>
        Add Item
      </Button>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 1 }]}>Product</Text>
            <Button
              mode="contained"
              style={{ backgroundColor: "#326935c3" }}
              onPress={generatePDF}
            >
              Download PDF
            </Button>
            <Text style={[styles.headerText, { flex: 1, textAlign: "right" }]}>
              Quantity
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 1 }]}>{item.name}</Text>
            <Text style={[styles.cell, { flex: 1, textAlign: "right" }]}>
              {item.qty}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  input: { marginBottom: 5, borderRadius: 5, height: 40 },
  button: { borderRadius: 15, width: "80%", alignSelf: "center" },

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#333",
    paddingVertical: 6,
    marginBottom: 4,
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },
  cell: {
    fontSize: 15,
  },
});
