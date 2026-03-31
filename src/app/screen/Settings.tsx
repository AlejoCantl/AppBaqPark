import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import OptionsSettings from '@/features/settings/components/OptionsSettings';
import theme from '@/core/theme/theme';

export default function Settings() {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const toggleDarkMode = () => setDarkMode((previousState) => !previousState);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración</Text>
      </View>
      <View style={styles.content}>
        <OptionsSettings
          isEnabled={isEnabled}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          toggleSwitch={toggleSwitch}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.medium,
  },
});
