import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import ButtonsSettings from "./ButtonsSettings";
import theme from '@/core/theme/theme';

export default function OptionsSettings({
  isEnabled,
  darkMode,
  toggleDarkMode,
  toggleSwitch,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.setting}>
          <Text style={styles.subTitle}>Notificaciones</Text>
          <Switch
            trackColor={{ false: theme.colors.border, true: theme.colors.secondary }}
            thumbColor={"#fff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={styles.divider} />
        
        <View style={styles.setting}>
          <Text style={styles.subTitle}>Modo Oscuro</Text>
          <Switch
            trackColor={{ false: theme.colors.border, true: theme.colors.secondary }}
            thumbColor={"#fff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={darkMode}
          />
        </View>
        <View style={styles.divider} />
        
        <View style={styles.setting}>
          <Text style={styles.subTitle}>Configuración #4</Text>
          <Switch
            trackColor={{ false: theme.colors.border, true: theme.colors.secondary }}
            thumbColor={"#fff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={darkMode}
          />
        </View>
        <View style={styles.divider} />
        
        <View style={styles.setting}>
          <Text style={styles.subTitle}>Configuración #5</Text>
          <Switch
            trackColor={{ false: theme.colors.border, true: theme.colors.secondary }}
            thumbColor={"#fff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={darkMode}
          />
        </View>
        <View style={styles.divider} />
        
        <View style={styles.setting}>
          <Text style={styles.subTitle}>Configuración #6</Text>
          <Switch
            trackColor={{ false: theme.colors.border, true: theme.colors.secondary }}
            thumbColor={"#fff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={darkMode}
          />
        </View>
      </View>
      
      <ButtonsSettings />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.medium,
    ...theme.shadow.sm,
    marginBottom: theme.spacing.large,
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.medium,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  subTitle: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.textDark,
    fontWeight: "500",
  },
});
