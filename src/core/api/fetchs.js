import axios from "axios";
import { supabase } from "./supabase";
import { Platform } from "react-native";

export const peticion = async (startCoords, endCoords, GOOGLE_MAPS_APIKEY, setRouteCoordinates, decodePolyline) => {
    try {
        if (Platform.OS === 'web') {
            const response = await axios.get(
                `https://router.project-osrm.org/route/v1/walking/${startCoords.longitude},${startCoords.latitude};${endCoords.longitude},${endCoords.latitude}?overview=full&geometries=polyline`
            );
            if (response.data && response.data.routes && response.data.routes.length > 0) {
                const points = decodePolyline(response.data.routes[0].geometry);
                setRouteCoordinates(points);
            } else {
                console.warn("No routes found from OSRM");
                setRouteCoordinates([]);
            }
        } else {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords.latitude},${startCoords.longitude}&destination=${endCoords.latitude},${endCoords.longitude}&key=${GOOGLE_MAPS_APIKEY}`
            );
            if (response.data && response.data.routes && response.data.routes.length > 0) {
                const points = decodePolyline(
                    response.data.routes[0].overview_polyline.points
                );
                setRouteCoordinates(points);
            } else {
                console.warn("No routes found from Google Maps");
                setRouteCoordinates([]);
            }
        }
    } catch (error) {
        console.error("Error al obtener la ruta:", error);
    }
}

export const fetchParques = async (setParques) => {
    try {
        // 1. Traer los parques con sus barrios
        const { data: parquesData, error: errorParques } = await supabase.from('vista_parques').select('*');
        if (errorParques) throw errorParques;
        //console.log("Parques:", parquesData);
        setParques(parquesData);
    } catch (error) {
        console.error("Error fetching parques:", error);
    }
};
