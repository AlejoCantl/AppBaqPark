import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import AccountButton from '@/features/auth/components/AccountButton';
import { useAuthentication } from '@/features/auth/context/AuthenticationContext';
import { Ionicons } from '@expo/vector-icons';
import { useModalContext } from '@/features/auth/context/userModalDisplayContext';
import RutineItem from '@/features/routines/components/RutineItem';
import theme from '@/core/theme/theme';
import { useAppTheme } from '@/core/theme/ThemeProvider';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM_ANDROID, TAB_BAR_BOTTOM_IOS } from '@/core/constants/constants';

const routineTypes = [
  { title: 'Rutinas Básicas', image: require('../../../assets/basic.png') },
  { title: 'Rutinas Intermedias', image: require('../../../assets/intermediate.png') },
  { title: 'Rutinas Avanzadas', image: require('../../../assets/advanced.png') },
  { title: 'Rutinas Personalizadas', image: require('../../../assets/customLock.png') },
];

const { height } = Dimensions.get('window');
const COLLAPSED_HEIGHT = 80;
const EXPANDED_HEIGHT = 300;

export default function Rutines() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const { open } = useModalContext();
  const { session } = useAuthentication();
  const [expanded, setExpanded] = useState<boolean>(false);

  const drawerHeight = useSharedValue(COLLAPSED_HEIGHT);
  const ctxStartY = useSharedValue(0);

  const toggleDrawer = () => {
    if (!session) {
      open();
      return;
    }
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    drawerHeight.value = withSpring(newExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT, {
      damping: 20,
      stiffness: 150,
    });
  };

  // ── Auto-colapsar el drawer cuando se cierra la sesión ───────────────────
  useEffect(() => {
    if (!session) {
      setExpanded(false);
      drawerHeight.value = withSpring(COLLAPSED_HEIGHT, { damping: 20, stiffness: 150 });
    }
  }, [session]);

  const panGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onStart(() => {
      ctxStartY.value = drawerHeight.value;
    })
    .onUpdate((event) => {
      if (!session) return;  // sin sesión no arrastramos
      const newHeight = ctxStartY.value - event.translationY;
      drawerHeight.value = Math.max(COLLAPSED_HEIGHT, Math.min(newHeight, EXPANDED_HEIGHT + 50));
    })
    .onEnd((event) => {
      if (!session) {
        // Arrastre hacia arriba → abrir modal de login
        if (event.translationY < -30 || event.velocityY < -300) {
          runOnJS(open)();
        }
        return;
      }
      // Sesión activa: expandir o colapsar según dirección
      if (event.translationY < -50 || event.velocityY < -500) {
        drawerHeight.value = withSpring(EXPANDED_HEIGHT, { damping: 20, stiffness: 150 });
        runOnJS(setExpanded)(true);
      } else if (event.translationY > 50 || event.velocityY > 500) {
        drawerHeight.value = withSpring(COLLAPSED_HEIGHT, { damping: 20, stiffness: 150 });
        runOnJS(setExpanded)(false);
      } else {
        const snapToMax = drawerHeight.value > (EXPANDED_HEIGHT + COLLAPSED_HEIGHT) / 2;
        drawerHeight.value = withSpring(
          snapToMax ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
          { damping: 20, stiffness: 150 }
        );
        runOnJS(setExpanded)(snapToMax);
      }
    });

  const animatedDrawerStyle = useAnimatedStyle(() => {
    return {
      height: drawerHeight.value,
    };
  });

  const animatedDetailsStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        drawerHeight.value,
        [COLLAPSED_HEIGHT, EXPANDED_HEIGHT - 50],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <AccountButton />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rutinas de Ejercicio</Text>
        <Text style={styles.headerSubtitle}>Encuentra el plan perfecto para ti</Text>
      </View>
      <View style={styles.routineGrid}>
        {routineTypes.map((routine, index) => (
          <RutineItem key={index} routine={routine} SessionRequired={routine?.title === "Rutinas Personalizadas" ? true : false} />
        ))}
      </View>

      {/* Gesto siempre activo: sin sesión dispara login al arrastrar arriba */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.progressContainer, animatedDrawerStyle]}>
          <TouchableOpacity onPress={toggleDrawer} style={{ width: '100%' }} activeOpacity={0.8}>
            <View style={styles.handle} />
            <View style={styles.progressBar}>
              <View style={styles.progressTextContainer}>
                <Ionicons name="stats-chart" size={24} color="#fff" />
                <Text style={styles.progressText}>TU PROGRESO</Text>
              </View>
              {!session && <Ionicons name="lock-closed" size={24} color="rgba(255,255,255,0.7)" />}
              {session && (
                <Ionicons
                  name={expanded ? "chevron-down" : "chevron-up"}
                  size={24}
                  color="rgba(255,255,255,0.8)"
                />
              )}
            </View>
          </TouchableOpacity>

          {session && (
            <Animated.View style={[styles.detailsContainer, animatedDetailsStyle]}>
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
                  <Ionicons name="water-outline" size={20} color="#fff" />
                  <Text style={styles.detailText}>Consumo de agua: Frecuente</Text>
                </View>
                <View style={styles.infoListItem}>
                  <Ionicons name="flame-outline" size={20} color="#fff" />
                  <Text style={styles.detailText}>Promedio Calorías: 340-200 Kcal/día</Text>
                </View>
                <View style={styles.infoListItem}>
                  <Ionicons name="fitness-outline" size={20} color="#fff" />
                  <Text style={styles.detailText}>Condición física: Óptima</Text>
                </View>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: colors.textMuted,
  },
  routineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
    paddingBottom: height * 0.15,
  },
  progressContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios'
      ? TAB_BAR_BOTTOM_IOS + TAB_BAR_HEIGHT
      : TAB_BAR_BOTTOM_ANDROID + TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    ...theme.shadow.lg,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  progressTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressText: {
    color: 'white',
    fontWeight: '800',
    fontSize: theme.fontSizes.lg,
    letterSpacing: 1,
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  detailCardValue: {
    color: '#fff',
    fontSize: theme.fontSizes.xxxl,
    fontWeight: 'bold',
  },
  detailCardLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: theme.fontSizes.sm,
    marginTop: 4,
  },
  infoList: {
    gap: 12,
  },
  infoListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 12,
    borderRadius: 12,
  },
  detailText: {
    color: 'white',
    fontSize: theme.fontSizes.sm,
    fontWeight: '500',
  },
});
