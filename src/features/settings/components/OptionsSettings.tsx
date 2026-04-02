import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import ButtonsSettings from "./ButtonsSettings";
import { useAppTheme } from '@/core/theme/ThemeProvider';
import theme from '@/core/theme/theme'; // used for static constants like radius

export default function OptionsSettings({
  isEnabled,
  darkMode,
  toggleDarkMode,
  toggleSwitch,
}) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.setting}>
          <Text style={[styles.subTitle, { color: colors.textDark }]}>Notificaciones</Text>
          <Switch
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={"#fff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.setting}>
          <Text style={[styles.subTitle, { color: colors.textDark }]}>Modo Oscuro</Text>
          <Switch
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={"#fff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={darkMode}
          />
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.setting}>
          <Text style={[styles.subTitle, { color: colors.textDark }]}>Sincronización Automática</Text>
          <Switch
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={"#fff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={()=>{}}
            value={true}
          />
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.setting}>
          <Text style={[styles.subTitle, { color: colors.textDark }]}>Actualizaciones en segundo plano</Text>
          <Switch
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={"#fff"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={()=>{}}
            value={false}
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
  },
  subTitle: {
    fontSize: theme.fontSizes.base,
    fontWeight: "500",
  },
});
