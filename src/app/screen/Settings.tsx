import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import OptionsSettings from '@/features/settings/components/OptionsSettings';
import theme from '@/core/theme/theme';
import { useAppTheme } from '@/core/theme/ThemeProvider';

export default function Settings() {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Configuración</Text>
      </View>
      <View style={styles.content}>
        <OptionsSettings
          isEnabled={isEnabled}
          darkMode={isDark}
          toggleDarkMode={toggleTheme}
          toggleSwitch={toggleSwitch}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.medium,
  },
});
