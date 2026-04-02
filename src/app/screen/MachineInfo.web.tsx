import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from '@/core/theme/ThemeProvider';
import AccountButton from '@/features/auth/components/AccountButton';
import theme from '@/core/theme/theme';

const machines = [
  {
    id: 1,
    name: "BARRAS",
    image: require("../../../assets/machineimages/barras.png"),
    function: "Desarrollo de la fuerza y flexibilidad de los miembros superiores, musculatura de hombros y pectorales. Mejora de la condición muscular de abdomen y espalda.",
    usage: "Sujete las barras con las manos, extienda los brazos totalmente y realice flexiones.",
    note: "Se trata de un ejercicio de fuerza que debe realizarse de forma no violenta. En caso de dolor articular, suspender la realización del mismo.",
  },
  {
    id: 2,
    name: "BANCA ABDOMINAL",
    image: require("../../../assets/machineimages/bancaabdominal.png"),
    function: "Fortalecimiento de la musculatura abdominal y lumbar. Aumenta la eliminación de grasa abdominal, obteniendo una mejor figura.",
    usage: "La postura correcta de los brazos es o bien sobre el pecho o detrás de la cabeza, pero nunca deben ejercer fuerza sobre el cuello ni la nuca. Una vez bien colocado sobre el banco, las repeticiones tienen que ser constantes y controladas.",
    note: "Una mala postura afectaría tu zona lumbar, debes ser cuidadoso.",
  },
  {
    id: 3,
    name: "REMO",
    image: require("../../../assets/machineimages/remo.png"),
    function: "Fortalece la musculatura de brazos, piernas, cintura, abdomen, espalda y pecho, permitiendo un completo movimiento de las extremidades. Mejora la capacidad cardio-pulmonar y la coordinación entre los miembros superior e inferior.",
    usage: "Colóquese sobre el asiento, agarre las asas con ambas manos y empuje los pedales hacia delante llegando a una posición de espalda derecha. El movimiento debe ser acompasado.",
    note: "Se trata de un ejercicio de fuerza en extremidades superiores e inferiores. Si nota alguna molestia, pare el ejercicio.",
  },
  {
    id: 4,
    name: "TIMÓN O VOLANTE",
    image: require("../../../assets/machineimages/timon.png"),
    function: "Potencia, desarrolla y mejora la musculación de los hombros. Mejora la flexibilidad general de las articulaciones de hombros, muñecas, codos y clavículas.",
    usage: "Sujete cada manilla con una mano y gire la rueda en el sentido de las agujas del reloj. Cambie de sentido en cada serie.",
    note: "Se trata de un movimiento completo de la articulación del hombro, por lo que su realización debe ser pausada, prestando atención al ejercicio y a la colocación del cuerpo respecto al aparato.",
  },
  {
    id: 5,
    name: "CAMINADOR AÉREO",
    image: require("../../../assets/machineimages/caminador.png"),
    function: "Mejora la movilidad, flexibilidad y coordinación de los miembros inferiores. Aumenta la capacidad cardiaca y pulmonar, reforzando la musculatura de piernas y glúteos.",
    usage: "Agarre el asa y colóquese sobre los pedales. Ajuste su centro de gravedad y realice el movimiento de andar con la espalda recta, moviendo los pedales hacia delante y hacia atrás sin forzar el movimiento.",
    note: "Agarre el asa con fuerza para evitar accidentes y no se baje del aparato hasta que los dos pedales estén en paralelo y parados.",
  },
  {
    id: 6,
    name: "CINTURA O GIRO",
    image: require("../../../assets/machineimages/cintura.png"),
    function: "Ejercita la cintura y ayuda a relajar los músculos de cintura, cadera y espalda. Refuerzo de la musculatura abdominal y lumbar.",
    usage: "Tome las manillas con ambas manos, mantenga el equilibrio y gire la cadera de lado a lado sin mover los hombros y de forma acompasada.",
    note: "No fuerce el giro de la cadera, la medida de la amplitud es llevar los pies, sin mover los hombros, de manilla a manilla. No suelte la manilla hasta el final del ejercicio.",
  },
  {
    id: 7,
    name: "PRESS DE PIERNA",
    image: require("../../../assets/machineimages/presspierna.png"),
    function: "Desarrolla y refuerza la musculatura de piernas y cintura, en concreto de cuadriceps, gemelos, glúteos y músculos abdominales inferiores.",
    usage: "Colóquese sobre el asiento con la espalda perfectamente apoyada y doble ambas piernas. Sitúe las manos en las rodillas y empuje con las piernas sobre los pedales, hasta estirar completamente las piernas.",
    note: "Se trata de un ejercicio de fuerza, en caso de problemas articulares no se debe forzar.",
  },
  {
    id: 8,
    name: "SURF",
    image: require("../../../assets/machineimages/surf.png"),
    function: "Refuerza la musculatura de la cintura, mejora la flexibilidad y coordinación del cuerpo. Recomendado para personas de todas las edades. Ejercita la columna y la cadera.",
    usage: "Agarre las asas con ambas manos, coloque sus pies sobre el pedal y realice movimientos oscilantes de un lado a otro, sin realizar grandes amplitudes en el balanceo.",
    note: "Se trata de un ejercicio que requiere un estado de forma de la cadera adecuado. Si tiene problemas de articulaciones de cadera o espalda, consulte al médico antes de realizarlo.",
  },
  {
    id: 9,
    name: "PRESS DE PECHO",
    image: require("../../../assets/machineimages/presspecho.png"),
    function: "Desarrollo de la musculatura de los miembros superiores, pecho, hombros y espalda. Mejora de la flexibilidad y agilidad de la articulación de hombro y codo. Mejora la capacidad cardio-pulmonar.",
    usage: "Colóquese en el asiento con la espalda apoyada en el respaldo y agarre las asas con ambas manos, tirando de ellas y volviendo a la posición inicial.",
    note: "Se trata de un ejercicio de fuerza que debe realizarse de forma no violenta y acompasada. En caso de notar alguna molestia, interrumpir el ejercicio.",
  },
  {
    id: 10,
    name: "ELÍPTICA O ESQUÍ DE FONDO",
    image: require("../../../assets/machineimages/eliptica.png"),
    function: "Refuerzo de la musculatura abdominal y lumbar. Mejora la flexibilidad y agilidad de la columna vertebral y de la cadera. Mejora la movilidad de los miembros superiores e inferiores.",
    usage: "Subido en los estribos y sujetándose a las manillas, mueva las piernas y los brazos como si estuviese caminando. Al disponer el aparato de partes móviles, tenga mucho cuidado al subir y bajar del mismo.",
    note: "Al disponer el aparato de partes móviles, tenga mucho cuidado al subir y bajar del mismo.",
  },
  {
    id: 11,
    name: "BARRA PARALELA",
    image: require("../../../assets/machineimages/barraparalela.png"),
    function: "Proporcionan un entrenamiento completo para el cuerpo: brazos, pecho, espalda, músculos estabilizadores del tronco, etc. Utilizando sólo el peso corporal.",
    usage: "Sujete las barras con las manos, extienda los brazos totalmente y luego dóblelos para realizar las flexiones.",
    note: "Se trata de un ejercicio de fuerza que debe realizarse de forma no violenta. En caso de dolor articular, suspender la realización del mismo.",
  },
];

export default function MachineInfoWeb() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [selectedMachine, setSelectedMachine] = useState(machines[0]);
  const { width } = useWindowDimensions();

  // Layout responsivo
  const isLargeScreen = width >= 900;

  return (
    <View style={styles.container}>
      <AccountButton />

      <View style={styles.header}>
        <Text style={styles.title}>Máquinas Biosaludables</Text>
        <Text style={styles.subtitle}>Conoce el equipamiento de los parques y su uso correcto</Text>
      </View>

      <View style={[styles.mainContainer, isLargeScreen ? styles.rowLayout : styles.columnLayout]}>

        {/* ListView: Master */}
        <View style={[styles.listContainer, isLargeScreen && { flex: 1, maxWidth: 400 }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollList}
          >
            {machines.map((machine) => {
              const active = selectedMachine.id === machine.id;
              return (
                <TouchableOpacity
                  key={machine.id}
                  style={[styles.machineCard, active && styles.machineCardActive]}
                  onPress={() => setSelectedMachine(machine)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardContent}>
                    <Image style={styles.machineImage} source={machine.image} />
                    <View style={styles.machineInfo}>
                      <Text style={[styles.machineName, active && styles.machineNameActive]}>
                        {machine.name}
                      </Text>
                      <Text style={styles.machinePreview} numberOfLines={2}>
                        {machine.function}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={active ? colors.primary : colors.border}
                      style={styles.arrowIcon}
                    />
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* DetailView: Detail */}
        <View style={[styles.detailContainer, isLargeScreen && { flex: 2, marginLeft: 24 }]}>
          {selectedMachine ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.detailContent}
            >
              <View style={styles.detailCard}>
                <Image
                  style={styles.detailImage}
                  source={selectedMachine.image}
                  resizeMode="contain"
                />
                <Text style={styles.detailTitle}>{selectedMachine.name}</Text>

                <View style={styles.infoSection}>
                  <View style={styles.infoSectionHeader}>
                    <Ionicons name="body-outline" size={24} color={colors.secondary} />
                    <Text style={styles.infoTitle}>Función</Text>
                  </View>
                  <Text style={styles.infoText}>{selectedMachine.function}</Text>
                </View>

                <View style={styles.infoSection}>
                  <View style={styles.infoSectionHeader}>
                    <Ionicons name="construct-outline" size={24} color={colors.secondary} />
                    <Text style={styles.infoTitle}>Uso</Text>
                  </View>
                  <Text style={styles.infoText}>{selectedMachine.usage}</Text>
                </View>

                {selectedMachine.note ? (
                  <View style={[styles.infoSection, styles.noteSection]}>
                    <View style={styles.infoSectionHeader}>
                      <Ionicons name="alert-circle-outline" size={24} color={colors.warning} />
                      <Text style={[styles.infoTitle, { color: colors.warning }]}>
                        Nota Importante
                      </Text>
                    </View>
                    <Text style={[styles.infoText, { color: colors.textDark }]}>
                      {selectedMachine.note}
                    </Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyDetail}>
              <Text style={styles.emptyText}>Selecciona una máquina para ver sus detalles</Text>
            </View>
          )}
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
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: theme.fontSizes.base,
    color: colors.textMuted,
  },
  mainContainer: {
    flex: 1,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  rowLayout: {
    flexDirection: 'row',
  },
  columnLayout: {
    flexDirection: 'column',
  },
  listContainer: {
    width: '100%',
  },
  scrollList: {
    paddingBottom: 40,
  },
  machineCard: {
    backgroundColor: colors.card,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.medium,
    borderWidth: 1,
    borderColor: 'transparent',
    ...theme.shadow.sm,
  },
  machineCardActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.medium,
  },
  machineImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  machineInfo: {
    flex: 1,
    marginLeft: theme.spacing.medium,
  },
  machineName: {
    fontSize: theme.fontSizes.base,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: 4,
  },
  machineNameActive: {
    color: colors.primary,
  },
  machinePreview: {
    fontSize: theme.fontSizes.sm,
    color: colors.textMuted,
  },
  arrowIcon: {
    marginLeft: theme.spacing.small,
  },
  detailContainer: {
    width: '100%',
    height: '100%',
  },
  detailContent: {
    paddingBottom: 40,
  },
  detailCard: {
    backgroundColor: colors.card,
    borderRadius: theme.radius.lg,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.border,
    ...theme.shadow.md,
  },
  detailImage: {
    width: "100%",
    height: 300,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.xl,
    backgroundColor: '#fff',
  },
  detailTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: "900",
    color: colors.textDark,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: colors.background,
    borderRadius: theme.radius.md,
    padding: 24,
    marginBottom: theme.spacing.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteSection: {
    backgroundColor: "#FFF8E1",
    borderColor: colors.warning,
  },
  infoSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.medium,
    gap: 12,
  },
  infoTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: "bold",
    color: colors.secondary,
  },
  infoText: {
    fontSize: theme.fontSizes.base,
    lineHeight: 26,
    color: colors.textMuted,
  },
  emptyDetail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: theme.fontSizes.lg,
  }
});
