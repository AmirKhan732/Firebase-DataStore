import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { deleteOldReports } from "../../firestoreHelpers";
import LoadingComponent from "../components/LoadingComponent";

export default function DailyReports() {
  const [reports, setReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); 

  const fetchReports = async () => {
    try {
      await deleteOldReports;

      const q = query(
        collection(db, "reports"),
        orderBy("date", "desc"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const rawData = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const groupedByDate = {};
      rawData.forEach((item) => {
        const { date, details } = item;
        const name = details?.name || "Unknown";
        const before = details?.before ?? 0;
        const after = details?.after ?? 0;

        const today = new Date();
        const reportDate = new Date(date);
        const diffDays = Math.floor(
          (today - reportDate) / (1000 * 60 * 60 * 24)
        );
        if (diffDays > 7) return;

        if (!groupedByDate[date]) groupedByDate[date] = {};
        if (!groupedByDate[date][name]) {
          groupedByDate[date][name] = { name, totalDecreased: 0 };
        }

        const decreased = before - after;
        if (decreased > 0) {
          groupedByDate[date][name].totalDecreased += decreased;
        }
      });

      const formatted = Object.keys(groupedByDate)
        .sort((a, b) => new Date(b) - new Date(a))
        .map((date) => ({
          date,
          products: Object.values(groupedByDate[date]),
        }));

      setReports(formatted);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  }, []);

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.detail}>
        Decreased Item:{" "}
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {item.totalDecreased}
        </Text>
      </Text>
    </View>
  );

  const renderDay = ({ item }) => (
    <View style={styles.daySection}>
      <Text style={styles.dateHeader}>{item.date}</Text>
      <FlatList
        data={item.products}
        renderItem={renderProduct}
        keyExtractor={(prod) => prod.name}
        scrollEnabled={false}
      />
    </View>
  );

  // ✅ Conditional render
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LoadingComponent />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.date}
        renderItem={renderDay}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={[styles.title, { fontSize: 14 }]}>
            No reports available.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    margin: 16,
    color: "#222",
    textAlign: "center",
  },
  daySection: { marginBottom: 20 },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#326935",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#543948ff",
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    width: "95%",
    alignSelf: "center",
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
    textAlign: "center",
  },
  detail: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    alignItems: "center",
  },
});
