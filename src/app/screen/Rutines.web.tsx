import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import AccountButton from '@/features/auth/components/AccountButton';
import { useAuthentication } from '@/features/auth/context/AuthenticationContext';
import { Ionicons } from '@expo/vector-icons';
import { useModalContext } from '@/features/auth/context/userModalDisplayContext';
import RutineItem from '@/features/routines/components/RutineItem';
import theme from '@/core/theme/theme';
import { useAppTheme } from '@/core/theme/ThemeProvider';

const routineTypes = [
  { title: 'Rutinas Básicas', image: require('../../../assets/basic.png') },
  { title: 'Rutinas Intermedias', image: require('../../../assets/intermediate.png') },
  { title: 'Rutinas Avanzadas', image: require('../../../assets/advanced.png') },
  { title: 'Rutinas Personalizadas', image: require('../../../assets/customLock.png') },
];

export default function RutinesWeb() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const { open } = useModalContext();
  const { session } = useAuthentication();
  const { width } = useWindowDimensions();

  // Cambiar layout a columna si la ventana web es muy estrecha
  const isLargeScreen = width >= 900;

  return (
    <View style={styles.container}>
      <AccountButton />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Rutinas de Ejercicio</Text>
            <Text style={styles.headerSubtitle}>Encuentra el plan perfecto para ti</Text>
        </View>

        <View style={[styles.contentWrapper, isLargeScreen ? styles.rowLayout : styles.columnLayout]}>
          
          {/* Main Content Area (Rutinas) */}
          <View style={styles.mainContent}>
            <View style={styles.routineGrid}>
              {routineTypes.map((routine, index) => (
                <View key={index} style={styles.routineWrapper}>
                  <RutineItem routine={routine} SessionRequired={routine?.title === "Rutinas Personalizadas" ? true : false} />
                </View>
              ))}
            </View>
          </View>

          {/* Sidebar Area for Progress */}
          <View style={[styles.sidebar, isLargeScreen ? { marginLeft: 32 } : { marginTop: 40 }]}>
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                 <Ionicons name="stats-chart" size={26} color={colors.primary} />
                 <Text style={styles.progressTitle}>TU PROGRESO</Text>
              </View>
              
              {!session ? (
                 <View style={styles.lockedState}>
                    <View style={styles.lockIconWrapper}>
                        <Ionicons name="lock-closed" size={32} color={colors.textMuted} />
                    </View>
                    <Text style={styles.lockedText}>Inicia sesión para registrar y visualizar tu progreso de forma automática a medida que completas rutinas.</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={open} activeOpacity={0.8}>
                       <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                 </View>
              ) : (
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailCard}>
                      <Text style={styles.detailCardValue}>19</Text>
                      <Text style={styles.detailCardLabel}>Días activos</Text>
                    </View>
                    <View style={styles.detailCard}>
                      <Text style={styles.detailCardValue}>10</Text>
                      <Text style={styles.detailCardLabel}>Días descanso</Text>
                    </View>
                  </View>
                  
                  <View style={styles.infoList}>
                    <View style={styles.infoListItem}>
                      <View style={styles.infoIconBox}>
                        <Ionicons name="water-outline" size={20} color={colors.primary} />
                      </View>
                      <View>
                        <Text style={styles.infoLabel}>Consumo de agua</Text>
                        <Text style={styles.detailText}>Frecuente</Text>
                      </View>
                    </View>
                    <View style={styles.infoListItem}>
                      <View style={styles.infoIconBox}>
                        <Ionicons name="flame-outline" size={20} color={colors.error} />
                      </View>
                      <View>
                        <Text style={styles.infoLabel}>Promedio Calorías</Text>
                        <Text style={styles.detailText}>340-200 Kcal/día</Text>
                      </View>
                    </View>
                    <View style={styles.infoListItem}>
                      <View style={styles.infoIconBox}>
                        <Ionicons name="fitness-outline" size={20} color={colors.secondary} />
                      </View>
                      <View>
                        <Text style={styles.infoLabel}>Condición física</Text>
                        <Text style={styles.detailText}>Óptima</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: theme.fontSizes.base,
    color: colors.textMuted,
  },
  contentWrapper: {
    flex: 1,
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  columnLayout: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mainContent: {
    flex: 2,
    minWidth: 300,
    width: '100%',
  },
  routineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  routineWrapper: {
    width: '45%',
    minWidth: 260,
    maxWidth: 350,
  },
  sidebar: {
    flex: 1,
    minWidth: 320,
    maxWidth: 400,
    width: '100%',
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    ...theme.shadow.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 16,
  },
  progressTitle: {
    color: colors.textDark,
    fontWeight: '800',
    fontSize: theme.fontSizes.lg,
    letterSpacing: 1,
  },
  lockedState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  lockIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lockedText: {
    textAlign: 'center',
    fontSize: theme.fontSizes.sm,
    color: colors.textMuted,
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    ...theme.shadow.sm,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: theme.fontSizes.base,
  },
  detailsContainer: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  detailCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  detailCardValue: {
    color: colors.primary,
    fontSize: theme.fontSizes.xxxl,
    fontWeight: '900',
  },
  detailCardLabel: {
    color: colors.textMuted,
    fontSize: theme.fontSizes.sm,
    marginTop: 6,
    fontWeight: '500',
  },
  infoList: {
    gap: 16,
  },
  infoListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    padding: 8,
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: theme.fontSizes.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailText: {
    color: colors.textDark,
    fontSize: theme.fontSizes.base,
    fontWeight: '700',
  },
});
