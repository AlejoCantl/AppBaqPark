/**
 * TabsBar.web.tsx — Navegación superior premium exclusiva para web.
 * Metro bundler resuelve automáticamente este archivo en lugar de TabsBar.tsx
 * cuando el target es web, sin tocar la versión móvil.
 */
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useAppTheme } from "@/core/theme/ThemeProvider";

// ─── Mapa de rutas a label + ícono ───────────────────────────────────────────
const NAV_ITEMS: Record<string, { label: string; active: string; inactive: string }> = {
  SearchMaps:  { label: "Mapa",      active: "earth",     inactive: "earth-outline" },
  Rutines:     { label: "Rutinas",   active: "barbell",   inactive: "barbell-outline" },
  MachineInfo: { label: "Máquinas",  active: "bicycle",   inactive: "bicycle-outline" },
  Settings:    { label: "Ajustes",   active: "settings",  inactive: "settings-outline" },
};

// ─── Barra de navegación superior para web ────────────────────────────────────
function WebTopBar({ state, navigation }: any) {
  const { colors } = useAppTheme();

  return (
    <View style={[
      styles.topBar, 
      { 
        backgroundColor: colors.card,
        shadowColor: colors.primary,
        borderBottomColor: `${colors.secondary}25`
      }
    ]}>
      {/* Brand / Logo */}
      <View style={styles.brand}>
        <View style={[styles.brandIcon, { backgroundColor: colors.primary }]}>
          <Ionicons name="leaf" size={18} color="#fff" />
        </View>
        <Text style={[styles.brandText, { color: colors.primary }]}>BaqPark</Text>
      </View>

      {/* Nav links */}
      <View style={styles.navLinks}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;
          const item = NAV_ITEMS[route.name];
          if (!item) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.navItem, 
                focused && [styles.navItemActive, { backgroundColor: colors.primary }]
              ]}
              activeOpacity={0.75}
            >
              <Ionicons
                name={(focused ? item.active : item.inactive) as any}
                size={18}
                color={focused ? "#fff" : colors.textMuted}
              />
              <Text style={[
                styles.navLabel, 
                { color: colors.textMuted }, 
                focused && { color: "#fff" }
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Tabs exportado ───────────────────────────────────────────────────────────
export default function TabsBar() {
  return (
    <Tabs
      detachInactiveScreens={false}
      initialRouteName="SearchMaps"
      backBehavior="initialRoute"
      tabBar={(props) => <WebTopBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Desplaza el contenido hacia abajo para evitar que quede bajo la navbar
        sceneStyle: { paddingTop: 64 },
      }}
    >
      <Tabs.Screen name="SearchMaps"  options={{ title: "Parques" }} />
      <Tabs.Screen name="Rutines"     options={{ title: "Rutinas" }} />
      <Tabs.Screen name="MachineInfo" options={{ title: "Máquinas" }} />
      <Tabs.Screen name="Settings"    options={{ title: "Ajustes" }} />
    </Tabs>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  topBar: {
    position: "absolute" as any,
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    zIndex: 100,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 8,
    borderBottomWidth: 1,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  navItemActive: {
    // Dynamic color provided in render
  },
  navLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
