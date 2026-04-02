import React from "react";
import { useModalContext } from "@/features/auth/context/userModalDisplayContext";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import theme from '@/core/theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AccountButton() {
  const { open } = useModalContext();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <View style={[
      styles.container,
      { top: Math.max(insets.top + 10, 20) },
      isWeb ? { right: 16 } : { left: 16 }
    ]}>
      <TouchableOpacity style={styles.accountButton} onPress={open} activeOpacity={0.8}>
        <Ionicons
          style={styles.iconAccount}
          name="person"
          size={24}
          color={theme.colors.secondary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
  },
  accountButton: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadow.md,
  },
  iconAccount: {
    color: theme.colors.secondary,
  },
});
