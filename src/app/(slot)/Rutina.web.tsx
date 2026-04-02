import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import theme from '@/core/theme/theme';
import { useAppTheme } from '@/core/theme/ThemeProvider';
import AccountButton from '@/features/auth/components/AccountButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const rutinas = [
  {
    nombre: 'Rutina Básica 1',
    ejercicios: [
      { src: require('../../../assets/basic.png'), repeticiones: 'x16', title: 'Flexiones' },
      { src: require('../../../assets/intermediate.png'), repeticiones: 'x20', title: 'Trote' },
      { src: require('../../../assets/tip-icon.jpg'), repeticiones: 'x16', title: 'Abdomen' },
      { src: require('../../../assets/customLock.png'), repeticiones: 'x16', title: 'Espalda' },
      { src: require('../../../assets/advanced.png'), repeticiones: 'x10', title: 'Fuerza' },
      { src: require('../../../assets/basic.png'), repeticiones: 'x16', title: 'Flexiones' },
      { src: require('../../../assets/intermediate.png'), repeticiones: 'x20', title: 'Trote' },
    ],
  },
  {
    nombre: "Rutina Basica 2",
    ejercicios: [
      { src: require('../../../assets/basic.png'), repeticiones: 'x16', title: 'Flexiones' },
      { src: require('../../../assets/intermediate.png'), repeticiones: 'x20', title: 'Trote' },
      { src: require('../../../assets/tip-icon.jpg'), repeticiones: 'x16', title: 'Abdomen' },
      { src: require('../../../assets/customLock.png'), repeticiones: 'x16', title: 'Espalda' },
      { src: require('../../../assets/advanced.png'), repeticiones: 'x10', title: 'Fuerza' },
    ]
  }
];

export default function RutinaWeb() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const router = useRouter();
  const { title } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width >= 900;
  
  if (!title) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyDetail}>
           <Text style={styles.emptyText}>No se encontró la rutina seleccionada.</Text>
           <TouchableOpacity onPress={() => router.push('/screen/Rutines')} style={styles.backBtnWrapper}>
              <Text style={styles.backBtnText}>Volver a rutinas</Text>
           </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AccountButton />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Superior */}
        <View style={styles.pageHeader}>
           <View style={styles.pageHeaderMain}>
             <TouchableOpacity style={styles.btnBackHeader} onPress={() => router.push('/screen/Rutines')} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={24} color={colors.textDark} />
             </TouchableOpacity>
             <View>
               <Text style={styles.pageTitle}>{typeof title === 'string' ? title.toUpperCase() : 'RUTINA'}</Text>
               <Text style={styles.pageSubtitle}>Serie completa de ejercicios guiados</Text>
             </View>
           </View>
           <TouchableOpacity style={styles.btnFilter} activeOpacity={0.8}>
               <MaterialIcons name="filter-list" size={20} color="#fff" />
               <Text style={styles.btnFilterText}>Filtrar Rutinas</Text>
           </TouchableOpacity>
        </View>

        <View style={[styles.mainLayout, isLargeScreen ? styles.rowLayout : styles.columnLayout]}>
          
          {/* Columna Izquierda: Ejercicios */}
          <View style={styles.contentCol}>
            {rutinas.map((rutina, idx) => (
              <View key={idx} style={styles.routineBlock}>
                 <Text style={styles.routineBlockTitle}>{rutina.nombre}</Text>
                 <View style={styles.exercisesGrid}>
                    {rutina.ejercicios.map((ejercicio, exIdx) => (
                       <View key={exIdx} style={styles.exerciseCard}>
                          <View style={styles.exerciseImgWrapper}>
                            <Image source={ejercicio.src} style={styles.exerciseImg} resizeMode="cover" />
                          </View>
                          <View style={styles.exerciseFooter}>
                             <Text style={styles.exerciseTitle} numberOfLines={1}>{ejercicio.title}</Text>
                             <View style={styles.repsBadge}>
                                <Text style={styles.repsText}>{ejercicio.repeticiones}</Text>
                             </View>
                          </View>
                       </View>
                    ))}
                 </View>
              </View>
            ))}
          </View>

          {/* Columna Derecha: Sidebar Progreso */}
          <View style={[styles.sidebarCol, isLargeScreen ? { marginLeft: 32 } : { marginTop: 40 }]}>
             <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                   <Ionicons name="stats-chart" size={26} color={colors.primary} />
                   <Text style={styles.progressTitle}>TU PROGRESO</Text>
                </View>
                
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
                        <Text style={styles.detailText}>140-200 Kcal/día</Text>
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
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
    flexWrap: 'wrap',
    gap: 16,
  },
  pageHeaderMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  btnBackHeader: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.sm,
  },
  pageTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: '900',
    color: colors.primary,
  },
  pageSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: colors.textMuted,
    marginTop: 4,
  },
  btnFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    ...theme.shadow.sm,
  },
  btnFilterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: theme.fontSizes.base,
  },
  mainLayout: {
    flex: 1,
  },
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  columnLayout: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  contentCol: {
    flex: 2,
    minWidth: 300,
    width: '100%',
  },
  routineBlock: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
    ...theme.shadow.sm,
  },
  routineBlockTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  exerciseCard: {
    width: 140,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
    overflow: 'hidden',
  },
  exerciseImgWrapper: {
    height: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: `${colors.primary}10`,
  },
  exerciseImg: {
    width: 70,
    height: 70,
  },
  exerciseFooter: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  exerciseTitle: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 8,
  },
  repsBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  repsText: {
    color: '#fff',
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
  },
  sidebarCol: {
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
    position: 'sticky' as any,
    top: 40,
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
  emptyDetail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: theme.fontSizes.lg,
    marginBottom: 20,
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
