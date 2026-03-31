import React from 'react';
import MapView, { PROVIDER_DEFAULT, Marker, Polyline } from 'react-native-maps';

interface Park {
  id: number;
  column2: string;
  column3: string;
  column4: string;
  column5: string | number;
  latitude: string | number;
  longitude: string | number;
}

interface MapComponentProps {
  mapRef: any;
  style: any;
  initialRegion: any;
  parques: Park[];
  routeCoordinates: any[];
  selectedButton: string | null;
  theme: any;
  handleMarkerPress: (park: Park) => void;
  getMarkerColor: (park: Park) => string;
}

export default function MapComponent({
  mapRef,
  style,
  initialRegion,
  parques,
  routeCoordinates,
  selectedButton,
  theme,
  handleMarkerPress,
  getMarkerColor,
}: MapComponentProps) {
  return (
    <MapView
      ref={mapRef}
      style={style}
      showsUserLocation={true}
      provider={PROVIDER_DEFAULT}
      initialRegion={initialRegion}
    >
      {parques.map((parque, index) => {
        const { latitude, longitude, column2, column3 } = parque;
        if (!isNaN(parseFloat(String(latitude))) && !isNaN(parseFloat(String(longitude)))) {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(String(latitude)),
                longitude: parseFloat(String(longitude)),
              }}
              title={column2}
              description={column3}
              onPress={() => handleMarkerPress(parque)}
              pinColor={getMarkerColor(parque)}
            />
          );
        }
        return null;
      })}
      {routeCoordinates.length > 0 && (selectedButton === 'cercano' || selectedButton === 'custom') && (
        <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor={theme.colors.secondary} />
      )}
    </MapView>
  );
}
