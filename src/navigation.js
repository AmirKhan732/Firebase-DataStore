import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Entypo from "@expo/vector-icons/Entypo";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AddProduct from "./HomeStack/AddProduct";
import EditProduct from "./HomeStack/EditProduct";
import DailyReports from "./screens/DailyReports";
import PurchaseList from "./screens/PurchaseList";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeMain">
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// ✅ Custom Drawer
function CustomDrawerContent(props) {
  const { state, descriptors, navigation } = props;

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: "transparent" }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];

        let iconName = "dot-single";
        if (route.name === "Home") iconName = "home";
        if (route.name === "DailyReports") iconName = "calendar";
        if (route.name === "Profile") iconName = "user";
        if (route.name === "PurchaseList") iconName = "list";

        return (
          <DrawerItem
            key={route.key}
            label={() => (
              <Text
                style={{
                  color: "#fff",
                  fontSize: focused ? 16 : 14,
                  textTransform: "capitalize",
                  fontWeight: focused ? "bold" : "normal",
                }}
              >
                {options.title ?? route.name}
              </Text>
            )}
            icon={({ color }) => (
              <Entypo name={iconName} size={focused ? 26 : 20} color="#fff" />
            )}
            focused={focused}
            onPress={() => navigation.navigate(route.name)}
            style={{
              backgroundColor: focused ? "#270c0c5d" : "transparent",
              borderRadius: 15,
              marginVertical: 5,
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
            labelStyle={{ color: "#fff" }}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#3a2c34ff",
          },
          headerTintColor: "#fff",
          drawerStyle: {
            backgroundColor: "#2c292bff",
            borderTopRightRadius: 70,
            borderBottomRightRadius: 70,
            overflow: "hidden",
          },
        }}
      >
        <Drawer.Screen name="Home" component={HomeStack} />
        <Drawer.Screen name="DailyReports" component={DailyReports} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name ="PurchaseList" component={PurchaseList} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
