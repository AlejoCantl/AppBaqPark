import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  Image,
  ScrollView,
  Platform,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated"
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import MapComponent from '@/features/maps/components/MapComponent'
import { StatusBar } from "expo-status-bar"
import { ActivityIndicator, MD2Colors, Button, IconButton, Chip, Searchbar } from "react-native-paper"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import theme from '@/core/theme/theme'
import AccountButton from '@/features/auth/components/AccountButton'
import { InfoParks } from '@/features/maps/components/InfoParks'
import { tips } from '@/core/constants/messages'
import {
  operationPoints,
  operationRequestLocation,
  operationHaverSineDistance,
  operationFindNearestPark,
  operationFetchRouter,
  operationHandleNearestParkPress,
  operationGetParques,
} from '@/shared/utils/functions'
import { DRAWER_MIN_HEIGHT, DRAWER_MAX_HEIGHT } from '@/core/constants/constants'
import { SkeletonItem } from '@/features/maps/components/SkeletonItem'
import { ParkInfoModal } from '@/features/maps/components/ParkInfoModal'
import { useAppTheme } from '@/core/theme/ThemeProvider'

interface Park {
  id: number
  column2: string
  column3: string
  column4: string
  column5: string | number
  latitude: string | number
  longitude: string | number
}

const sectorOptions = [
  { id: "RIOMAR", label: "Riomar", color: "#4CAF50" },
  { id: "METROPOLITANA", label: "Metropolitana", color: "#2196F3" },
  { id: "SUROCCIDENTE", label: "Suroccidente", color: "#FF9800" },
  { id: "SURORIENTE", label: "Suroriente", color: "#9C27B0" },
  { id: "NORTE CENTRO HISTORICO", label: "Norte Centro Histórico", color: "#F44336" },
]

// Web map placeholder was removed because MapComponent.web.tsx handles it now
export default function SearchMaps() {
  const { colors } = useAppTheme()
  const styles = useMemo(() => getStyles(colors), [colors])

  const [showInfoContainer, setShowInfoContainer] = useState(false)
  const [location, setLocation] = useState(null)
  const [nearestPark, setNearestPark] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedButton, setSelectedButton] = useState(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)
  const [currentTip, setCurrentTip] = useState("")
  const [parques, setParques] = useState<Park[]>([])
  const [selectedPark, setSelectedPark] = useState<Park | null>(null)
  const [showParkModal, setShowParkModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false)
  const [activeSectorFilter, setActiveSectorFilter] = useState<string | null>(null)
  const mapRef = useRef(null)
  const parquesLoadedRef = useRef(false)

  // ─── Drawer animation via Reanimated (replaces PanResponder) ─────────────────
  const drawerHeight = useSharedValue(DRAWER_MIN_HEIGHT)

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    height: drawerHeight.value,
  }))

  const detailOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      drawerHeight.value,
      [DRAWER_MIN_HEIGHT, (DRAWER_MIN_HEIGHT + DRAWER_MAX_HEIGHT) / 2, DRAWER_MAX_HEIGHT],
      [0, 0.3, 1],
      Extrapolation.CLAMP
    ),
  }))

  const toggleDrawer = useCallback(() => {
    const newExpanded = !isDrawerExpanded
    setIsDrawerExpanded(newExpanded)
    drawerHeight.value = withSpring(newExpanded ? DRAWER_MAX_HEIGHT : DRAWER_MIN_HEIGHT, {
      damping: 22,
      stiffness: 180,
    })
  }, [isDrawerExpanded])

  const minimizeDrawer = useCallback(() => {
    setIsDrawerExpanded(false)
    drawerHeight.value = withSpring(DRAWER_MIN_HEIGHT, { damping: 22, stiffness: 180 })
  }, [])

  const ctxStartY = useSharedValue(0)

  const panGesture = Gesture.Pan()
    // Sólo activa el gesto en eje Y para no bloquear el ScrollView horizontal de sectores
    .activeOffsetY([-12, 12])
    .failOffsetX([-12, 12])
    .onStart(() => {
      ctxStartY.value = drawerHeight.value
      runOnJS(setIsDrawerExpanded)(true)
    })
    .onUpdate((event) => {
      const newHeight = ctxStartY.value - event.translationY
      drawerHeight.value = Math.max(DRAWER_MIN_HEIGHT, Math.min(newHeight, DRAWER_MAX_HEIGHT + 50))
    })
    .onEnd((event) => {
      if (event.translationY < -50 || event.velocityY < -500) {
        drawerHeight.value = withSpring(DRAWER_MAX_HEIGHT, { damping: 22, stiffness: 180 })
        runOnJS(setIsDrawerExpanded)(true)
      } else if (event.translationY > 50 || event.velocityY > 500) {
        drawerHeight.value = withSpring(DRAWER_MIN_HEIGHT, { damping: 22, stiffness: 180 })
        runOnJS(setIsDrawerExpanded)(false)
      } else {
        const snapToMax = drawerHeight.value > (DRAWER_MAX_HEIGHT + DRAWER_MIN_HEIGHT) / 2
        drawerHeight.value = withSpring(snapToMax ? DRAWER_MAX_HEIGHT : DRAWER_MIN_HEIGHT, { damping: 22, stiffness: 180 })
        runOnJS(setIsDrawerExpanded)(snapToMax)
      }
    })

  const handlGetParques = useCallback(() => {
    operationGetParques(setParques)
  }, [])

  const haversineDistance = useCallback(
    (coords1, coords2) => operationHaverSineDistance(coords1, coords2),
    []
  )

  const memorizedParques = useMemo(() => {
    if (!location?.coords || !parques) return []
    return parques.filter((parque) => {
      const { latitude, longitude } = parque
      if (isNaN(Number.parseFloat(String(latitude))) || isNaN(Number.parseFloat(String(longitude))))
        return false
      if (activeSectorFilter && parque.column3 !== activeSectorFilter) return false
      const distance = haversineDistance(location.coords, {
        latitude: Number.parseFloat(String(latitude)),
        longitude: Number.parseFloat(String(longitude)),
      })
      return distance <= 5
    })
  }, [location, parques, activeSectorFilter, haversineDistance])

  const filteredParks = useMemo(() => {
    if (!parques || parques.length === 0) return []
    return parques.filter((park) => {
      if (isNaN(Number.parseFloat(String(park.latitude))) || isNaN(Number.parseFloat(String(park.longitude))))
        return false
      const matchesSearch =
        searchQuery === "" || (park.column2 && park.column2.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesSector = !activeSectorFilter || park.column3 === activeSectorFilter
      return matchesSearch && matchesSector
    })
  }, [parques, searchQuery, activeSectorFilter])

  const findNearestPark = useCallback(
    (userCoords, parks) => operationFindNearestPark(userCoords, parks, haversineDistance),
    [haversineDistance]
  )

  const fetchRoute = useCallback(async (startCoords, park) => {
    operationFetchRouter(startCoords, park, setRouteCoordinates, decodePolyline)
  }, [])

  const decodePolyline = useCallback(operationPoints, [])

  // Carga parques y ubicación una única vez en el mount del componente.
  // detachInactiveScreens=false garantiza que este efecto no corre de nuevo al navegar.
  useEffect(() => {
    // Siempre solicitar ubicación (puede estar desactuali­za)
    operationRequestLocation(setErrorMsg, setLocation, setIsLoading)

    // Cargar parques sólo si aún no se han cargado
    if (!parquesLoadedRef.current) {
      parquesLoadedRef.current = true
      operationGetParques((data) => {
        setParques(data ?? [])
        setIsLoading(false)   // garantiza que el spinner pare aunque la ubicación tarde
      })
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const centerMapOnPark = useCallback(
    (park: Park) => {
      if (mapRef.current && park) {
        const latitude = Number.parseFloat(String(park.latitude))
        const longitude = Number.parseFloat(String(park.longitude))
        if (!isNaN(latitude) && !isNaN(longitude)) {
          mapRef.current.animateToRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500)
        }
      }
    },
    [mapRef]
  )

  const handleParkPress = useCallback(
    (park: Park) => {
      minimizeDrawer()
      setTimeout(() => {
        centerMapOnPark(park)
        setTimeout(() => {
          setSelectedPark(park)
          setShowParkModal(true)
        }, 300)
      }, 300)
    },
    [minimizeDrawer, centerMapOnPark]
  )

  const handleMarkerPress = useCallback((park: Park) => {
    setSelectedPark(park)
    setShowParkModal(true)
  }, [])

  const renderParkItem = useCallback(
    ({ item }) => {
      if (isLoading || !item?.id) return <SkeletonItem />
      return (
        <TouchableOpacity onPress={() => handleParkPress(item)} activeOpacity={0.7}>
          <View style={styles.parkItem}>
            <View style={styles.parkIconBadge}>
              <MaterialIcons name="park" size={22} color={colors.secondary} />
            </View>
            <View style={styles.parkInfo}>
              <Text style={styles.parkName} numberOfLines={1}>{item.column2}</Text>
              <Text style={styles.parkDescription} numberOfLines={1}>{item.column3}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.secondary} />
          </View>
        </TouchableOpacity>
      )
    },
    [isLoading, handleParkPress]
  )

  const handleNearestParkPress = useCallback(() => {
    operationHandleNearestParkPress(
      selectedButton,
      setSelectedButton,
      setNearestPark,
      setRouteCoordinates,
      findNearestPark,
      location,
      memorizedParques,
      fetchRoute
    )
  }, [location, memorizedParques, findNearestPark, fetchRoute, selectedButton])

  const handleOptimalParkPress = useCallback(() => {
    if (selectedButton === "optimo") {
      setSelectedButton(null)
    } else {
      setSelectedButton("optimo")
      setNearestPark(null)
      setRouteCoordinates([])
      Alert.alert("Parque Óptimo", "Esta función aún no está implementada.", [{ text: "OK" }])
    }
  }, [selectedButton])

  const handleTipPress = useCallback(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setCurrentTip(randomTip)
    setShowTipModal(true)
  }, [])

  const toggleSectorFilter = useCallback((sectorId: string) => {
    setActiveSectorFilter((prev) => (prev === sectorId ? null : sectorId))
  }, [])

  const clearFilters = useCallback(() => {
    setActiveSectorFilter(null)
    setSearchQuery("")
  }, [])

  const handleShowRoute = useCallback(
    (park) => {
      if (location && park) {
        setShowParkModal(false)
        setSelectedButton("custom")
        fetchRoute(
          { latitude: location.coords.latitude, longitude: location.coords.longitude },
          {
            latitude: Number.parseFloat(String(park.latitude)),
            longitude: Number.parseFloat(String(park.longitude)),
          }
        )
        mapRef.current?.fitToCoordinates(
          [
            { latitude: location.coords.latitude, longitude: location.coords.longitude },
            {
              latitude: Number.parseFloat(String(park.latitude)),
              longitude: Number.parseFloat(String(park.longitude)),
            },
          ],
          { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
        )
      }
    },
    [location, fetchRoute, mapRef]
  )

  const getMarkerColor = useCallback((park: Park) => {
    const sector = sectorOptions.find((s) => s.id === park.column3)
    return sector ? sector.color : "#4CAF50"
  }, [])

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={80} color={colors.secondary} />
        <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
      </View>
    )
  }

  const initialRegion = { ...location.coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <InfoParks setShowInfoContainer={setShowInfoContainer} showInfoContainer={showInfoContainer} />
      <AccountButton />

      {/* ─── Map Component (Cross Platform) ─────────────────────────── */}
      <MapComponent
        mapRef={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        parques={memorizedParques}
        routeCoordinates={routeCoordinates}
        selectedButton={selectedButton}
        theme={theme}
        handleMarkerPress={handleMarkerPress}
        getMarkerColor={getMarkerColor}
      />

      {/* ─── Tip button ─────────────────────────────────────── */}
      <TouchableOpacity style={styles.tipButton} onPress={handleTipPress} activeOpacity={0.8}>
        <Image source={require("../../../assets/tip-icon.jpg")} style={styles.tipIcon} />
      </TouchableOpacity>

      {/* ─── Animated Drawer (Reanimated) ───────────────────── */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
          {/* Handle */}
          <TouchableOpacity onPress={toggleDrawer} style={styles.drawerHandle} activeOpacity={0.7}>
            <View style={styles.handle} />
          </TouchableOpacity>

          {/* Drawer header */}
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Parques Cercanos</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionBtn, selectedButton === "cercano" && styles.actionBtnActive]}
                onPress={handleNearestParkPress}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="place"
                  size={16}
                  color={selectedButton === "cercano" ? "#fff" : colors.secondary}
                />
                <Text style={[styles.actionBtnText, selectedButton === "cercano" && styles.actionBtnTextActive]}>
                  Cercano
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, selectedButton === "optimo" && styles.actionBtnActive]}
                onPress={handleOptimalParkPress}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="star"
                  size={16}
                  color={selectedButton === "optimo" ? "#fff" : colors.secondary}
                />
                <Text style={[styles.actionBtnText, selectedButton === "optimo" && styles.actionBtnTextActive]}>
                  Óptimo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.infoBtn}
                onPress={() => setShowInfoModal(true)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="info-outline" size={20} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Expanded content (search + filters) */}
          <Animated.View style={[styles.searchFilterContainer, detailOpacity, !isDrawerExpanded && { display: 'none' }]}>
            <Searchbar
              placeholder="Buscar parque..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              inputStyle={styles.searchInput}
              icon={() => <MaterialIcons name="search" size={20} color={colors.secondary} />}
              clearIcon={() => <MaterialIcons name="clear" size={20} color={colors.secondary} />}
            />
            <Text style={styles.filterLabel}>Sectores</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
              {sectorOptions.map((sector) => (
                <TouchableOpacity
                  key={sector.id}
                  onPress={() => toggleSectorFilter(sector.id)}
                  style={[
                    styles.sectorPill,
                    activeSectorFilter === sector.id && { backgroundColor: sector.color },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.sectorPillText,
                      activeSectorFilter === sector.id && styles.sectorPillTextActive,
                    ]}
                  >
                    {sector.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsCount}>
                {`${filteredParks.length} ${filteredParks.length === 1 ? 'parque' : 'parques'} encontrados`}
              </Text>
              {Boolean(activeSectorFilter || searchQuery) && (
                <TouchableOpacity onPress={clearFilters} style={styles.clearBtn} activeOpacity={0.8}>
                  <MaterialIcons name="refresh" size={14} color="#fff" />
                  <Text style={styles.clearBtnText}>Limpiar</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

        <FlatList
          data={isLoading ? Array(8).fill({}) : filteredParks.length > 0 ? filteredParks : memorizedParques}
          renderItem={renderParkItem}
          keyExtractor={(item, index) => (item?.id ? String(item.id) : `placeholder-${index}`)}
          contentContainerStyle={styles.parkList}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          showsVerticalScrollIndicator={false}
        />
        </Animated.View>
      </GestureDetector>

      {/* ─── Modals ──────────────────────────────────────────── */}
      <ParkInfoModal
        visible={showParkModal}
        park={selectedPark}
        onClose={() => setShowParkModal(false)}
        onShowRoute={handleShowRoute}
      />

      <Modal animationType="slide" transparent={true} visible={showInfoModal} onRequestClose={() => setShowInfoModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Tipos de búsqueda</Text>
            <View style={styles.modalInfoRow}>
              <MaterialIcons name="place" size={24} color={colors.secondary} />
              <Text style={styles.modalInfoText}>
                <Text style={{ fontWeight: "bold" }}>{"Cercano: "}</Text>
                <Text>{"El parque más próximo a tu ubicación actual."}</Text>
              </Text>
            </View>
            <View style={styles.modalInfoRow}>
              <MaterialIcons name="star" size={24} color={colors.secondary} />
              <Text style={styles.modalInfoText}>
                <Text style={{ fontWeight: "bold" }}>{"\u00d3ptimo: "}</Text>
                <Text>{"Parque sugerido según preferencias (próximamente)."}</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowInfoModal(false)} activeOpacity={0.8}>
              <Text style={styles.modalCloseBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={showTipModal} onRequestClose={() => setShowTipModal(false)}>
        <View style={styles.tipModalOverlay}>
          <View style={styles.tipModalCard}>
            <View style={styles.tipModalHeader}>
              <Image source={require("../../../assets/tip-icon.jpg")} style={styles.tipModalIcon} />
              <Text style={styles.tipModalTitle}>Consejo del día</Text>
            </View>
            <Text style={styles.tipText}>{currentTip}</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowTipModal(false)} activeOpacity={0.8}>
              <Text style={styles.modalCloseBtnText}>¡Entendido!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, gap: 16 },
  loadingText: { color: colors.textMuted, fontSize: theme.fontSizes.base },
  map: { width: "100%", height: "100%", zIndex: 0 },
  // Web map placeholder
  webMapPlaceholder: {
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  webMapIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadow.md,
  },
  webMapTitle: { fontSize: theme.fontSizes.xl, fontWeight: "bold", color: colors.primary, textAlign: "center", marginTop: 8 },
  webMapSubtitle: { fontSize: theme.fontSizes.base, color: colors.textMuted, textAlign: "center" },
  webMapHint: { fontSize: theme.fontSizes.sm, color: colors.secondary, textAlign: "center", fontWeight: "500" },
  // Tip button
  tipButton: {
    position: "absolute",
    // Queda sobre el drawer en estado colapsado (DRAWER_MIN_HEIGHT + 16)
    bottom: DRAWER_MIN_HEIGHT + 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
    zIndex: 5,
    ...theme.shadow.md,
  },
  tipIcon: { width: 40, height: 40, borderRadius: 20 },
  // Drawer
  drawer: {
    position: "absolute",
    // bottom: 0 — queda debajo del TabBar flotante (zIndex: 10)
    // El contenido visible asoma por encima gracias a DRAWER_MIN_HEIGHT >= 190
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 9,
    ...theme.shadow.lg,
  },
  drawerHandle: { alignItems: "center", paddingVertical: 10 },
  handle: { width: 36, height: 4, backgroundColor: "#d0d0d0", borderRadius: 2 },
  drawerHeader: { marginBottom: 10 },
  drawerTitle: { fontSize: theme.fontSizes.lg, fontWeight: "700", color: colors.primary, marginBottom: 10 },
  buttonRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    backgroundColor: "#fff",
  },
  actionBtnActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  actionBtnText: { fontSize: theme.fontSizes.sm, color: colors.secondary, fontWeight: "600" },
  actionBtnTextActive: { color: "#fff" },
  infoBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  // Search & filters
  searchFilterContainer: { marginBottom: 10 },
  searchBar: {
    marginBottom: 8,
    elevation: 0,
    backgroundColor: "#f0f5ec",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { fontSize: theme.fontSizes.sm },
  filterLabel: { fontSize: theme.fontSizes.xs, fontWeight: "600", color: colors.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  filtersRow: { paddingBottom: 6, gap: 8 },
  sectorPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  sectorPillText: { fontSize: theme.fontSizes.xs, color: "#555", fontWeight: "500" },
  sectorPillTextActive: { color: "#fff", fontWeight: "700" },
  resultsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  resultsCount: { fontSize: theme.fontSizes.xs, color: colors.textMuted },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearBtnText: { color: "#fff", fontSize: theme.fontSizes.xs, fontWeight: "600" },
  // Park list
  parkList: { paddingBottom: 24 },
  parkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  parkIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  parkInfo: { flex: 1 },
  parkName: { fontSize: theme.fontSizes.base, fontWeight: "700", color: colors.textDark },
  parkDescription: { fontSize: theme.fontSizes.sm, color: colors.textMuted, marginTop: 2 },
  // Modals
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: { width: 36, height: 4, backgroundColor: "#d0d0d0", borderRadius: 2, alignSelf: "center", marginBottom: 20 },
  modalTitle: { fontSize: theme.fontSizes.lg, fontWeight: "700", color: colors.primary, marginBottom: 20 },
  modalInfoRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 16 },
  modalInfoText: { flex: 1, fontSize: theme.fontSizes.base, color: "#333", lineHeight: 22 },
  modalCloseBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  modalCloseBtnText: { color: "#fff", fontWeight: "700", fontSize: theme.fontSizes.base },
  // Tip modal
  tipModalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 },
  tipModalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 380,
    ...theme.shadow.lg,
  },
  tipModalHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  tipModalIcon: { width: 44, height: 44, borderRadius: 22 },
  tipModalTitle: { fontSize: theme.fontSizes.lg, fontWeight: "700", color: colors.primary },
  tipText: { fontSize: theme.fontSizes.base, color: "#444", lineHeight: 24 },
})
