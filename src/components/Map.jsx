import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import myTrips from '../data/trips.json';

export default function Map({ onSelectCity }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const [geoData, setGeoData] = useState(null);

  // 1. Fetch from OpenDataSoft Public Portal (WGS84 GPS coords, All 342 Dutch Municipalities)
  useEffect(() => {
    const URL =
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-netherlands-gemeente/exports/geojson';

    fetch(URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('✅ Loaded municipalities:', data.features.length);
        console.log('Sample city name:', data.features[0].properties.gem_name);
        setGeoData(data);
      })
      .catch((err) => console.error('Error loading GeoJSON:', err));
  }, []);

  // 2. Initialize the Base Map
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
      maxBoundsViscosity: 1.0
    });

    // L.tileLayer(
    //   'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=cb1_3piw_1_6aee0f1b3b3753139433bab3',
    //   {
    //     attribution: '&copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap',
    //     maxZoom: 20
    //   }
    // ).addTo(map);
    // Clean Dark Canvas: Oceans & coastlines, but ZERO roads!
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

  // 3. Draw & Color Municipalities
  // 3. Draw & Color Municipalities
  useEffect(() => {
    if (!mapInstanceRef.current || !geoData) return;

    // Helper: Safely unwraps the city name whether it's an Array or a String
    const getCityName = (feature) => {
      const prop = feature.properties.gem_name;
      if (!prop) return 'Unknown';
      return Array.isArray(prop) ? prop[0] : String(prop);
    };

    // Check if visited
    const isVisited = (feature) => {
      const prop = feature.properties.gem_name;
      if (!prop) return false;
      const names = Array.isArray(prop) ? prop : [prop];

      return myTrips.some((trip) =>
        names.some((name) => name.toLowerCase() === trip.municipality.toLowerCase())
      );
    };

    geoJsonLayerRef.current = L.geoJSON(geoData, {
      style: (feature) => {
        const visited = isVisited(feature);

        return {
          fillColor: visited ? '#ff7700' : '#1e1e24', // Dutch Orange vs Dark Slate
          weight: visited ? 2 : 0.8,
          opacity: 0.9,
          color: visited ? '#ffaa40' : '#444450',
          fillOpacity: visited ? 0.5 : 0.2
        };
      },
      onEachFeature: (feature, layer) => {
        const cityName = getCityName(feature);
        const visited = isVisited(feature);
        

        // Tooltip on hover
        layer.bindTooltip(
          `<strong>${cityName}</strong>${visited ? ' 🍊 (Visited)' : ''}`,
          { direction: 'top', sticky: true }
        );

        // Hover animations
        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ weight: 3, color: '#ffffff', fillOpacity: 0.9 });
            l.bringToFront();
          },
          mouseout: (e) => {
            geoJsonLayerRef.current.resetStyle(e.target);
          }
        });
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
         onSelectCity(cityName); // <--- Triggers the drawer!
       }
     });

      }
    }).addTo(mapInstanceRef.current);
  }, [geoData]);

  return <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />;
}