import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import theme from '@/core/theme/theme';
import { useAppTheme } from '@/core/theme/ThemeProvider';

const rutinas = [
  {
    nombre: 'Rutina Básica 1',
    ejercicios: [
      { src: require('../../../assets/basic.png'), repeticiones: 'x16', name: 'Flexiones' },
      { src: require('../../../assets/intermediate.png'), repeticiones: 'x20', name: 'Trote' },
      { src: require('../../../assets/tip-icon.jpg'), repeticiones: 'x16', name: 'Abdomen' },
      { src: require('../../../assets/customLock.png'), repeticiones: 'x16', name: 'Espalda' },
      { src: require('../../../assets/advanced.png'), repeticiones: 'x10', name: 'Fuerza' },
      { src: require('../../../assets/basic.png'), repeticiones: 'x16', name: 'Pecho' },
      { src: require('../../../assets/intermediate.png'), repeticiones: 'x20', name: 'Piernas' },
    ],
  },
  {
    nombre: "Rutina Básica 2",
    ejercicios: [
      { src: require('../../../assets/basic.png'), repeticiones: 'x16', name: 'Flexiones' },
      { src: require('../../../assets/intermediate.png'), repeticiones: 'x20', name: 'Trote' },
      { src: require('../../../assets/tip-icon.jpg'), repeticiones: 'x16', name: 'Abdomen' },
      { src: require('../../../assets/customLock.png'), repeticiones: 'x16', name: 'Espalda' },
      { src: require('../../../assets/advanced.png'), repeticiones: 'x10', name: 'Fuerza' },
    ]
  }
];

export default function RutinaMobile() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const router = useRouter();
  const { title } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  if (!title) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontró la rutina seleccionada.</Text>
          <TouchableOpacity onPress={() => router.push('/screen/Rutines')} style={styles.backBtnWrapper}>
            <Text style={styles.backBtnText}>Volver a rutinas</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const headerTitle = typeof title === 'string' ? title.toUpperCase() : 'RUTINA';

  return (
    <View style={styles.container}>
      {/* Navbar Superior */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/screen/Rutines')} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>{headerTitle}</Text>
        
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
          <MaterialIcons name="filter-list" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.pageInfo}>
           <Text style={styles.pageSubtitle}>Serie estructurada de ejercicios guiados</Text>
        </View>

        {rutinas.map((rutina, idx) => (
          <View key={idx} style={styles.routineBlock}>
             <Text style={styles.routineBlockTitle}>{rutina.nombre}</Text>
             
             <ScrollView 
               horizontal 
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.exercisesScroll}
             >
                {rutina.ejercicios.map((ejercicio, exIdx) => (
                   <View key={exIdx} style={styles.exerciseCard}>
                      <View style={styles.exerciseImgWrapper}>
                        <Image source={ejercicio.src} style={styles.exerciseImg} resizeMode="cover" />
                      </View>
                      <View style={styles.exerciseFooter}>
                         <Text style={styles.exerciseName} numberOfLines={1}>{ejercicio.name}</Text>
                         <View style={styles.repsBadge}>
                            <Text style={styles.repsText}>{ejercicio.repeticiones}</Text>
                         </View>
                      </View>
                   </View>
                ))}
             </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* Widget de Progreso Inferior */}
      <View style={[styles.progressContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
         <View style={styles.progressHeader}>
            <Ionicons name="stats-chart" size={20} color="#fff" />
            <Text style={styles.progressTitle}>TU PROGRESO</Text>
         </View>
         
         <View style={styles.progressMetrics}>
            <View style={styles.metricBlock}>
               <Text style={styles.metricLabel}>Días activos</Text>
               <Text style={styles.metricValue}>19</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBlock}>
               <Text style={styles.metricLabel}>Condición</Text>
               <Text style={styles.metricValue}>Óptima</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBlock}>
               <Text style={styles.metricLabel}>Agua</Text>
               <Text style={styles.metricValue}>Frecuente</Text>
            </View>
         </View>
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.sm,
  },
  headerTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 180, // espacio para el progreso fijo
  },
  pageInfo: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  pageSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: colors.textMuted,
  },
  routineBlock: {
    marginBottom: 40,
  },
  routineBlockTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textDark,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  exercisesScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  exerciseCard: {
    width: 120,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colors.primary}15`,
    overflow: 'hidden',
    ...theme.shadow.sm,
    marginRight: 16,
  },
  exerciseImgWrapper: {
    height: 80,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: `${colors.primary}10`,
  },
  exerciseImg: {
    width: 50,
    height: 50,
  },
  exerciseFooter: {
    padding: 10,
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
  },
  repsBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  repsText: {
    color: '#fff',
    fontSize: theme.fontSizes.xs,
    fontWeight: 'bold',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    ...theme.shadow.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  progressTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: theme.fontSizes.base,
    letterSpacing: 1,
  },
  progressMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  metricBlock: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 8,
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    color: '#fff',
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: theme.fontSizes.lg,
    color: colors.textMuted,
    marginBottom: 20,
    textAlign: 'center',
  },
  backBtnWrapper: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
