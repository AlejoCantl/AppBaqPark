import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View } from 'react-native';

// ─── SSR-Safe: No npm leaflet imports at all. ───────────────────────────────
// Leaflet is loaded via CDN inside a sandboxed <iframe> so it never
// touches Node/SSR where `window` does not exist.
const MapComponentWeb = forwardRef((props: any, ref) => {
  const {
    style,
    initialRegion,
    parques,
    routeCoordinates,
    selectedButton,
    theme,
    handleMarkerPress,
    getMarkerColor,
  } = props;

  const iframeRef = useRef<any>(null);

  // Expose the same imperative API as react-native-maps MapView
  useImperativeHandle(ref, () => ({
    animateToRegion: (region: any) => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'flyTo', lat: region.latitude, lng: region.longitude },
        '*'
      );
    },
    fitToCoordinates: (coordinates: any[]) => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'fitBounds', coords: coordinates },
        '*'
      );
    },
  }));

  // Listen for marker clicks coming back from the iframe via postMessage
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'markerClick') {
        const park = (parques || []).find((p: any) => p.id === e.data.id);
        if (park) handleMarkerPress(park);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [parques, handleMarkerPress]);

  // Send route updates into the iframe whenever they change
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'setRoute',
          coords: routeCoordinates || [],
          active: selectedButton === 'cercano' || selectedButton === 'custom',
          color: theme?.colors?.secondary || '#4CAF50',
        },
        '*'
      );
    }
  }, [routeCoordinates, selectedButton]);

  // Build serialisable marker list (computed in parent React context, not in iframe)
  const markerData = (parques || [])
    .map((p: any) => ({
      id: p.id,
      lat: parseFloat(String(p.latitude)),
      lng: parseFloat(String(p.longitude)),
      title: p.column2 || '',
      sector: p.column3 || '',
      color: getMarkerColor(p),
    }))
    .filter((m: any) => !isNaN(m.lat) && !isNaN(m.lng));

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
    .custom-popup .leaflet-popup-content-wrapper {
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map').setView([${initialRegion.latitude}, ${initialRegion.longitude}], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // User location indicator
    L.circleMarker([${initialRegion.latitude}, ${initialRegion.longitude}], {
      radius: 10, color: '#fff', fillColor: '#2196F3',
      fillOpacity: 1, weight: 3
    }).addTo(map).bindPopup('<b>Mi ubicación</b>');

    // Park markers from parent data
    var markersData = ${JSON.stringify(markerData)};
    markersData.forEach(function(m) {
      var icon = L.divIcon({
        html: '<div style="width:20px;height:20px;border-radius:50%;background:' + m.color + ';border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);cursor:pointer;"></div>',
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -14]
      });
      L.marker([m.lat, m.lng], { icon: icon })
        .addTo(map)
        .bindPopup('<b>' + m.title + '</b><br><span style="color:#888">' + m.sector + '</span>', { className: 'custom-popup' })
        .on('click', function() {
          window.parent.postMessage({ type: 'markerClick', id: m.id }, '*');
        });
    });

    var routeLayer = null;

    // Handle messages from the React parent
    window.addEventListener('message', function(e) {
      var d = e.data;
      if (!d || !d.type) return;
      if (d.type === 'flyTo') {
        map.setView([d.lat, d.lng], 16, { animate: true, duration: 0.8 });
      }
      if (d.type === 'fitBounds' && d.coords && d.coords.length > 0) {
        var bounds = d.coords.map(function(c) { return [c.latitude, c.longitude]; });
        map.fitBounds(bounds, { padding: [40, 40], animate: true });
      }
      if (d.type === 'setRoute') {
        if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
        if (d.active && d.coords && d.coords.length > 0) {
          var latlngs = d.coords.map(function(c) { return [c.latitude, c.longitude]; });
          routeLayer = L.polyline(latlngs, { color: d.color || '#4CAF50', weight: 5, opacity: 0.85 }).addTo(map);
        }
      }
    });
  </script>
</body>
</html>`;

  return (
    <View style={style}>
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        style={{ width: '100%', height: '100%', border: 'none' } as any}
        title="BaqPark Map"
        sandbox="allow-scripts allow-same-origin"
      />
    </View>
  );
});

export default MapComponentWeb;
