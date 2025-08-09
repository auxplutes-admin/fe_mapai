// MapPage.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  useMap,
  LayersControl,
  GeoJSON,
  Marker,
} from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';
import 'leaflet/dist/leaflet.css';
import ChatPlayground from '../../components/Chat/ChatPlayground';
import L, { LatLngExpression, PathOptions } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import DRC_CONGO from '@/pages/MapJSON/DRC_CONGO.json';
import { getAllRegions } from '@/api';
import './Map.css';
import drcFlag from '@/assets/Flag-of-Congo-09.png';

// ---------- THEME ----------
const THEME = '#450275';       // global purple (backdrop + accents)
const THEME_2 = '#F357A8';      // global Detail map color (backdrop + accents)
const PANEL = '#2e014a';       // panel surface (split card background)
const BORDER_GREY = '#9AA0A6'; // province border

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Region {
  id: number;
  created_at: number;
  region_name: string;
  region_id: string;
  province_name?: string;
  lat?: string;
  long?: string;
  summary?: string;
}

/* ---------------- Map controller for main map ---------------- */
const MapController: React.FC<{ isSplit: boolean }> = ({ isSplit }) => {
  const map = useMap();
  
  useEffect(() => {
    if (isSplit) {
      // When split, transform to mini-map mode
      const southWest = L.latLng(-13.5, 12.0);
      const northEast = L.latLng(5.5, 31.5);
      map.fitBounds(L.latLngBounds(southWest, northEast), { padding: [30, 30] });
      
      // Lock the map
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      
      // Hide controls
      const container = (map as any)._controlContainer;
      if (container) {
        container.style.display = 'none';
      }
    } else {
      // Re-enable interactions for full map
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      
      // Show controls
      const container = (map as any)._controlContainer;
      if (container) {
        container.style.display = 'block';
      }
      
      // Set bounds for full map
      const southWest = L.latLng(-13.5, 12.0);
      const northEast = L.latLng(5.5, 31.5);
      map.setMaxBounds(L.latLngBounds(southWest, northEast));
      map.setMinZoom(5);
    }
  }, [map, isSplit]);
  
  return null;
};

/* ---------------- Provinces Layer ---------------- */
const DRCProvincesLayer: React.FC<{
  onOpenDetail: (
    title: string,
    selectedProvince: string,
    regionId: string,
    summary?: string
  ) => void;
  isSplit: boolean;
  selectedProvince?: string;
}> = ({ onOpenDetail, isSplit, selectedProvince }) => {
  const map = useMap();
  const [data, setData] = useState<any | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const geoJsonLayerRef = useRef<L.GeoJSON<any> | null>(null);
  const labelMarkersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const rs = await getAllRegions();
        setRegions(rs);
      } catch (e) {
        console.error('Error fetching regions:', e);
      }
    })();
  }, []);

  // Color palette for normal view
  const greys = useMemo(() => {
    const steps = 30;
    const arr: string[] = [];
    for (let i = 0; i < steps; i++) {
      const v = 245 - Math.round((i / (steps - 1)) * 120);
      arr.push(`rgb(${v},${v},${v})`);
    }
    return arr;
  }, []);

  useEffect(() => {
    const geojson = DRC_CONGO as any;
    geojson.features.forEach((f: any, i: number) => {
      f.properties._fillColour = greys[i % greys.length];
    });
    setData(geojson);
  }, [greys]);

  // Style function changes based on split mode
  const style = (feature: any): PathOptions => {
    const provinceName =
      feature?.properties?.adm1_name ??
      feature?.properties?.NAME_1 ??
      feature?.properties?.name ??
      '';
    
    if (isSplit) {
      // Mini-map style: white with selected province highlighted
      const isSelected = selectedProvince && 
        provinceName.toLowerCase() === selectedProvince.toLowerCase();
      
      return {
        weight: 1,
        color: '#d9cfee',
        fillColor: isSelected ? THEME_2 : '#ffffff',
        fillOpacity: 1,
      };
    } else {
      // Normal map style
      return {
        weight: 1,
        color: BORDER_GREY,
        className: 'province-stroke',
        fillColor: feature?.properties?._fillColour ?? '#d9d9d9',
        fillOpacity: 0.9,
      };
    }
  };

  // Clear/add labels based on split mode
  useEffect(() => {
    // Clear existing labels
    labelMarkersRef.current.forEach(marker => marker.remove());
    labelMarkersRef.current = [];

    if (!isSplit && geoJsonLayerRef.current) {
      // Add labels only in normal mode
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        const feature = layer.feature;
        const provinceName =
          feature?.properties?.adm1_name ??
          feature?.properties?.NAME_1 ??
          feature?.properties?.name ??
          'Province';
        
        const center = layer.getBounds().getCenter();
        const label = L.divIcon({
          className: 'region-label',
          html: `<div>${provinceName}</div>`,
          iconSize: [100, 40],
          iconAnchor: [50, 20],
        });
        const labelMarker = L.marker(center, { icon: label, interactive: false }).addTo(map);
        labelMarkersRef.current.push(labelMarker);
      });
    }
  }, [isSplit, map, data]);

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (isSplit) return; // No interactions in split mode
    
    const provinceName =
      feature?.properties?.adm1_name ??
      feature?.properties?.NAME_1 ??
      feature?.properties?.name ??
      'Province';

    const region = regions.find(
      (r) => r.province_name && r.province_name.toLowerCase() === provinceName.toLowerCase()
    );

    const regionId = region?.region_id || provinceName.toLowerCase();
    const summary = region?.summary;

    layer.on({
      mouseover: (e: any) => e.target.setStyle({ weight: 2, fillOpacity: 1 }),
      mouseout: (e: any) => geoJsonLayerRef.current?.resetStyle(e.target),
      click: () => {
        onOpenDetail(
          provinceName,
          provinceName,
          regionId,
          summary
        );
      },
    });
  };

  // Fit bounds on mount (only for normal mode)
  useEffect(() => {
    if (!data || isSplit) return;
    setTimeout(() => {
      try {
        const b = (geoJsonLayerRef.current as any)?.getBounds?.();
        if (b?.isValid()) map.fitBounds(b, { padding: [20, 20] });
      } catch { }
    }, 0);
  }, [data, map, isSplit]);

  // World mask
  const maskData = useMemo(() => {
    if (!data) return null;
    const worldRing = [
      [-360, -180],
      [360, -180],
      [360, 180],
      [-360, 180],
      [-360, -180],
    ];
    const holes: number[][][] = [];
    for (const f of data.features) {
      if (!f?.geometry) continue;
      if (f.geometry.type === 'Polygon') {
        for (const ring of f.geometry.coordinates) holes.push([...ring].reverse());
      } else if (f.geometry.type === 'MultiPolygon') {
        for (const poly of f.geometry.coordinates) {
          for (const ring of poly) holes.push([...ring].reverse());
        }
      }
    }
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [worldRing, ...holes] },
    } as any;
  }, [data]);

  if (!data) return null;

  return (
    <>
      {maskData && (
        <GeoJSON
          data={maskData}
          style={{ 
            fillColor: THEME,
            color: THEME, 
            weight: 0, 
            fillOpacity: 1 
          }}
          interactive={false}
        />
      )}
      <GeoJSON
        ref={geoJsonLayerRef as any}
        key={`geojson-${isSplit}-${selectedProvince}`} // Force re-render on state change
        data={data as any}
        style={style}
        onEachFeature={onEachFeature}
      />
      {/* Region markers - only show in normal mode */}
      {!isSplit && regions.map((region) => {
        if (region.lat && region.long) {
          const drcFlagIcon = L.icon({
            iconUrl: drcFlag,
            iconSize: [64, 40],
            iconAnchor: [32, 40],
            popupAnchor: [0, -10],
          });

          const provinceName = region.province_name || '';
          const displayTitle = provinceName
            ? `${region.region_name} - ${provinceName}`
            : region.region_name;

          return (
            <Marker
              key={region.id}
              position={[parseFloat(region.lat), parseFloat(region.long)]}
              icon={drcFlagIcon}
              eventHandlers={{
                click: () => {
                  onOpenDetail(
                    displayTitle,
                    provinceName,
                    region.region_id,
                    region.summary
                  );
                },
              }}
            />
          );
        }
        return null;
      })}
    </>
  );
};

/* ---------------- Right Panel Component ---------------- */
const RightPanel: React.FC<{
  title?: string;
  summary?: string;
  showChat: boolean;
  regionId?: string;
  sessionId?: string;
  onBack: () => void;
  onAskMore: () => void;
}> = ({
  title,
  summary,
  showChat,
  regionId,
  sessionId,
  onBack,
  onAskMore,
}) => {
  return (
    <div className="right-panel" style={{ background: PANEL }}>
      <div className="panel-header">
        <div className="panel-title">{title}</div>
        <button className="panel-btn secondary" onClick={onBack}>Back</button>
      </div>
      
      {!showChat ? (
        <>
          <div className="panel-body">
            {summary || 'No summary available for this region yet.'}
          </div>
          <div className="panel-footer">
            <button className="panel-btn panel-btn-primary" onClick={onAskMore}>
              Ask More
            </button>
          </div>
        </>
      ) : (
        <div className="panel-chat-container">
          <ChatPlayground regionId={regionId} sessionId={sessionId} />
        </div>
      )}
    </div>
  );
};

/* ---------------- Main Map Page ---------------- */
const MapPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSplit, setIsSplit] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [detail, setDetail] = useState<{
    title?: string;
    selectedProvince?: string;
    id?: string;
    summary?: string;
  }>({});

  // Session init
  useEffect(() => {
    let stored = localStorage.getItem('chat_session_id');
    if (!stored) {
      stored = uuidv4();
      localStorage.setItem('chat_session_id', stored);
    }
    setSessionId(stored);
  }, []);

  const openDetail = (
    title: string,
    selectedProvince: string,
    regionId: string,
    summary?: string
  ) => {
    setDetail({ title, selectedProvince, id: regionId, summary });
    setIsSplit(true);
    setShowChat(false);
  };

  const openChatInPanel = () => {
    const newSessionId = uuidv4();
    localStorage.setItem('chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setShowChat(true);
  };

  const handleBackToMap = () => {
    setIsSplit(false);
    setShowChat(false);
    setDetail({});
  };

  return (
    <div className="map-page-root" style={{ background: THEME }}>
      {/* Map Container - slides left when split */}
      <div className={`map-container ${isSplit ? 'is-split' : ''}`}>
        {/* Hint badge - only show when not split */}
        {!isSplit && (
          <div className="map-hint">
            <p>Click any region to learn more</p>
          </div>
        )}

        <MapContainer
          center={[-2.5, 23.5] as LatLngExpression}
          zoom={5}
          style={{ 
            height: '100vh', 
            width: '100%',
            background: isSplit ? PANEL : 'transparent'
          }}
          maxBounds={[[-13.5, 12.0], [5.5, 31.5]]}
          minZoom={5}
          maxZoom={10}
          dragging={true}
          zoomControl={true}
          doubleClickZoom={true}
          scrollWheelZoom={true}
          attributionControl={true}
          zoomSnap={0.5}
        >
          <MapController isSplit={isSplit} />
          
          {!isSplit && (
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Dark Matter">
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution="&copy; CARTO & OpenStreetMap contributors"
                  bounds={[[-13.5, 12.0], [5.5, 31.5]]}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                  bounds={[[-13.5, 12.0], [5.5, 31.5]]}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="&copy; Esri"
                  bounds={[[-13.5, 12.0], [5.5, 31.5]]}
                />
              </LayersControl.BaseLayer>
            </LayersControl>
          )}

          <DRCProvincesLayer 
            onOpenDetail={openDetail}
            isSplit={isSplit}
            selectedProvince={detail.selectedProvince}
          />
        </MapContainer>
      </div>

      {/* Right Panel - slides in when split */}
      {isSplit && (
        <div className="right-panel-container">
          <RightPanel
            title={detail.title}
            summary={detail.summary}
            showChat={showChat}
            regionId={detail.id}
            sessionId={sessionId || undefined}
            onBack={handleBackToMap}
            onAskMore={openChatInPanel}
          />
        </div>
      )}
    </div>
  );
};

export default MapPage;