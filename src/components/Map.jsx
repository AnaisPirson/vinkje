import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ trips, onSelectCity }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const [geoData, setGeoData] = useState(null);

  // 1. Fetch GeoJSON
  useEffect(() => {
    fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-netherlands-gemeente/exports/geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error('Error loading GeoJSON:', err));
  }, []);

  // 2. Initialize Base Map
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const netherlandsBounds = [
      [50.5, 3.2],
      [53.7, 7.3]
    ];

    const map = L.map(mapContainerRef.current, {
      center: [52.1326, 5.2913],
      zoom: 8,
      minZoom: 7,
      maxZoom: 13,
      maxBounds: netherlandsBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: false // Move zoom control away from header
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 3. Draw & Color Municipalities (Reacts dynamically to trips changes!)
  useEffect(() => {
    if (!mapInstanceRef.current || !geoData) return;

    if (geoJsonLayerRef.current) {
      mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
    }

    const getCityName = (feature) => {
      const prop = feature.properties.gem_name;
      if (!prop) return 'Unknown';
      return Array.isArray(prop) ? prop[0] : String(prop);
    };

    const isVisited = (feature) => {
      const prop = feature.properties.gem_name;
      if (!prop) return false;
      const names = Array.isArray(prop) ? prop : [prop];

      return trips.some((trip) =>
        names.some((name) => name.toLowerCase() === trip.municipality.toLowerCase())
      );
    };

    geoJsonLayerRef.current = L.geoJSON(geoData, {
      style: (feature) => {
        const visited = isVisited(feature);

        return {
          fillColor: visited ? '#ff7700' : '#1e1e24',
          weight: visited ? 1.5 : 0.8,
          opacity: 0.9,
          color: visited ? '#ffaa40' : '#444450',
          fillOpacity: visited ? 0.5 : 0.2
        };
      },
      onEachFeature: (feature, layer) => {
        const cityName = getCityName(feature);
        const visited = isVisited(feature);

        layer.bindTooltip(
          `<strong>${cityName}</strong>${visited ? ' 🍊' : ''}`,
          { direction: 'top', sticky: true }
        );

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ weight: 3, color: '#ffffff', fillOpacity: 0.8 });
            l.bringToFront();
          },
          mouseout: (e) => {
            geoJsonLayerRef.current.resetStyle(e.target);
          },
          click: () => {
            onSelectCity(cityName);
          }
        });
      }
    }).addTo(mapInstanceRef.current);
  }, [geoData, trips]);

  return <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />;
}