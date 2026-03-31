import React from "react";
import { useModalContext } from "@/features/auth/context/userModalDisplayContext";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { UserModal } from "./userModal";
import theme from '@/core/theme/theme';

export default function AccountButton() {
  const { open } = useModalContext();

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.accountButton} onPress={open} activeOpacity={0.8}>
          <Ionicons
            style={styles.iconAccount}
            name="person"
            size={24}
            color={theme.colors.secondary}
          />
        </TouchableOpacity>
      </View>
      <UserModal />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    top: Platform.OS === "ios" ? 50 : 30,
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
