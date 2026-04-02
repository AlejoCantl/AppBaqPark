import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '@/core/theme/theme';
import OptionsSettings from '@/features/settings/components/OptionsSettings';
import AccountButton from '@/features/auth/components/AccountButton';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/core/theme/ThemeProvider';

export default function SettingsWeb() {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previous) => !previous);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Absolute Header (Account) */}
      <AccountButton />

      {/* Main Center Content */}
      <View style={styles.scrollWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Row */}
          <View style={styles.pageHeader}>
             <View style={styles.headerLeft}>
               <View style={[styles.iconWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                 <Ionicons name="settings-outline" size={28} color={colors.primary} />
               </View>
               <View>
                 <Text style={[styles.pageTitle, { color: colors.primary }]}>Ajustes</Text>
                 <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>Preferencias y controles de la aplicación</Text>
               </View>
             </View>
          </View>

          {/* Main Layout Row (Options + Sidebar) */}
          <View style={styles.mainLayoutRow}>
             
             {/* Left Col: Setting options */}
             <View style={styles.optionsCol}>
               <OptionsSettings
                 isEnabled={isEnabled}
                 darkMode={isDark}
                 toggleDarkMode={toggleTheme}
                 toggleSwitch={toggleSwitch}
               />
             </View>

             {/* Right Col: Helper Sidebar */}
             <View style={styles.sidebarCol}>
                <View style={[styles.helperCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                   <Ionicons name="information-circle" size={24} color={colors.secondary} style={{ marginBottom: 12 }} />
                   <Text style={[styles.helperTitle, { color: colors.textDark }]}>Centro de Ayuda</Text>
                   <Text style={[styles.helperDescription, { color: colors.textMuted }]}>
                     Desde este panel puedes controlar las preferencias globales de tu cuenta en Barranquilla Parks.
                     {'\n\n'}
                     Activa el modo oscuro para reducir la fatiga visual.
                   </Text>
                </View>
             </View>

          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 80,
    width: '100%',
    maxWidth: 1400,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 48,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...theme.shadow.sm,
  },
  pageTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: '900',
  },
  pageSubtitle: {
    fontSize: theme.fontSizes.base,
    marginTop: 4,
  },
  mainLayoutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 32,
    flexWrap: 'wrap',
  },
  optionsCol: {
    flex: 2,
    minWidth: 400,
  },
  sidebarCol: {
    flex: 1,
    minWidth: 300,
  },
  helperCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    ...theme.shadow.sm,
  },
  helperTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  helperDescription: {
    fontSize: theme.fontSizes.sm,
    lineHeight: 22,
  }
});
