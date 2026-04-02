import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from '@/core/theme/ThemeProvider';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM_ANDROID, TAB_BAR_BOTTOM_IOS } from '@/core/constants/constants';

const TAB_BAR_BOTTOM = Platform.OS === "ios" ? TAB_BAR_BOTTOM_IOS : TAB_BAR_BOTTOM_ANDROID;

// ─── Mapa de íconos por nombre de ruta ───────────────────────────────────────
const ROUTE_ICONS: Record<string, { active: string; inactive: string }> = {
  SearchMaps: { active: "earth", inactive: "earth-outline" },
  Rutines:    { active: "barbell", inactive: "barbell-outline" },
  MachineInfo:{ active: "bicycle", inactive: "bicycle-outline" },
  Settings:   { active: "settings", inactive: "settings-outline" },
};

// ─── Barra flotante animada completamente personalizada ────────────────────────
function CustomTabBar({ state, navigation }: any) {
  const { colors } = useAppTheme();
  const translateY = useSharedValue(TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animación de entrada: slide desde abajo + fade in
    translateY.value = withDelay(300, withSpring(0, { damping: 18, stiffness: 110 }));
    opacity.value = withDelay(300, withTiming(1, { duration: 500 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[
      styles.floatingBar, 
      animStyle, 
      { 
        backgroundColor: colors.card,
        shadowColor: colors.primary,
        borderColor: `${colors.secondary}40`
      }
    ]}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const icons = ROUTE_ICONS[route.name] ?? { active: "help-circle", inactive: "help-circle-outline" };

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
            style={styles.tabTouchable}
            activeOpacity={0.75}
          >
            <View style={[
              styles.iconPill, 
              focused && [styles.iconPillActive, { backgroundColor: colors.primary, shadowColor: colors.primary }]
            ]}>
              <Ionicons
                name={(focused ? icons.active : icons.inactive) as any}
                size={22}
                color={focused ? "#fff" : colors.textMuted}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

export default function TabsBar() {
  return (
    <Tabs
      detachInactiveScreens={false}
      initialRouteName="SearchMaps"
      backBehavior="initialRoute"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="SearchMaps" options={{ title: "Parques" }} />
      <Tabs.Screen name="Rutines"    options={{ title: "Rutinas" }} />
      <Tabs.Screen name="MachineInfo" options={{ title: "Máquinas" }} />
      <Tabs.Screen name="Settings"  options={{ title: "Ajustes" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingBar: {
    position: 'absolute',
    bottom: TAB_BAR_BOTTOM,
    left: 16,
    right: 16,
    height: TAB_BAR_HEIGHT,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 10,
    elevation: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    borderWidth: 1.5,
  },
  tabTouchable: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPill: {
    width: 48,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',        
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconPillActive: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
});