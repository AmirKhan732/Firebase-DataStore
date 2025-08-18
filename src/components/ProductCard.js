import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ProductCard({
  item,
  expanded,
  onToggleExpand,
  onDecreaseQuantity,
  onEdit,
}) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const config = (toValue, duration) => ({
      toValue,
      duration,
      useNativeDriver: false,
    });

    if (expanded) {
      Animated.parallel([
        Animated.timing(heightAnim, config(contentHeight, 250)),
        Animated.timing(opacityAnim, config(1, 250)),
        Animated.timing(rotateAnim, config(1, 250)),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(heightAnim, config(0, 200)),
        Animated.timing(opacityAnim, config(0, 200)),
        Animated.timing(rotateAnim, config(0, 200)),
      ]).start();
    }
  }, [expanded, contentHeight]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => onDecreaseQuantity(item.id, item.qty)}
          >
            <FontAwesome name="minus-square" size={24} color="#ef5350" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onEdit(item)}
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
          Quantity: <Text style={styles.price}>{item.qty}</Text>
        </Text>
        <Text style={styles.detail}>
          PKR: <Text style={styles.price}>{item.price}</Text>
        </Text>
      </View>
      {item.description?.trim() ? (
        <TouchableOpacity style={styles.iconButton} onPress={onToggleExpand}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <AntDesign name="downsquare" size={24} color="black" />
          </Animated.View>
        </TouchableOpacity>
      ) : null}
      {item.description?.trim() ? (
        <>
          <Animated.View
            style={[
              styles.animatedContent,
              { height: heightAnim, opacity: opacityAnim },
            ]}
          >
            <View
              style={styles.absoluteFill}
              onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
            >
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </Animated.View>
          {!expanded && <View style={styles.dashedLine} />}
        </>
      ) : null}
      <Text style={styles.date}>
        Created: <Text style={styles.bold}>{item.created || "N/A"}</Text>
      </Text>
      {item.editedAt?.toDate && (
        <Text style={styles.date}>
          Last edited:{" "}
          <Text style={styles.bold}>
            {item.editedAt.toDate().toLocaleString()}
          </Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
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
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: -10,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  detail: { fontSize: 14, color: "#777", marginTop: 5, fontWeight: "bold" },
  date: { fontSize: 12, color: "#777", marginTop: 10 },
  price: { color: "green", fontWeight: "bold", fontSize: 18 },
  iconButton: { marginHorizontal: 8 },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "dashed",
    padding: 5,
    borderRadius: 5,
  },
  animatedContent: { overflow: "hidden" },
  absoluteFill: { position: "absolute", top: 0, left: 0, right: 0 },
  dashedLine: {
    borderBottomWidth: 1,
    borderColor: "black",
    borderStyle: "dashed",
    marginTop: 5,
    width: "100%",
  },
  bold: { fontWeight: "bold" },
});
