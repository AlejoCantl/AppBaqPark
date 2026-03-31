import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Platform } from "react-native";
import { UserModalProvider } from "@/features/auth/context/userModalDisplayContext";
import theme from '@/core/theme/theme';

function TabBarIcon({ focused, name, label }) {
  return (
    <View style={styles.iconContainer}>
      <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
        <Ionicons name={name} size={24} color={focused ? "#fff" : theme.colors.textMuted} />
      </View>
      <Text style={[styles.iconLabel, focused && styles.iconLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsBar() {
  return (
    <UserModalProvider>
      <Tabs
        detachInactiveScreens={true}
        initialRouteName="SearchMaps"
        backBehavior="initialRoute"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="SearchMaps"
          options={{
            title: "Parques",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name={focused ? "earth" : "earth-outline"} label="Mapa" />
            ),
          }}
        />
        <Tabs.Screen
          name="Rutines"
          options={{
            title: "Rutinas",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name={focused ? "barbell" : "barbell-outline"} label="Rutinas" />
            ),
          }}
        />
        <Tabs.Screen
          name="MachineInfo"
          options={{
            title: "Máquinas",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name={focused ? "bicycle" : "bicycle-outline"} label="Máquinas" />
            ),
          }}
        />
        <Tabs.Screen
          name="Settings"
          options={{
            title: "Ajustes",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name={focused ? "settings" : "settings-outline"} label="Ajustes" />
            ),
          }}
        />
      </Tabs>
    </UserModalProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: Platform.OS === "ios" ? 85 : 70,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    paddingTop: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconWrapperActive: {
    backgroundColor: theme.colors.secondary,
  },
  iconLabel: {
    fontSize: 10,
    marginTop: 4,
    color: theme.colors.textMuted,
    fontWeight: "500",
  },
  iconLabelActive: {
    color: theme.colors.secondary,
    fontWeight: "700",
  },
});