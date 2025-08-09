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
// NOTE: ideally serve this from /public and import via a relative URL
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
  region_name: string;     // e.g., "Kimpangu"
  region_id: string;
  province_name?: string;  // e.g., "Kongo-Central"
  lat?: string;
  long?: string;
  summary?: string;
}

/* ---------------- Map controller: bounds + min zoom ---------------- */
const MapController: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const southWest = L.latLng(-13.5, 12.0);
    const northEast = L.latLng(5.5, 31.5);
    map.setMaxBounds(L.latLngBounds(southWest, northEast));
    map.setMinZoom(5);
  }, [map]);
  return null;
};

/* ---------------- Mini map (white country, selected province purple) ---------------- */
const MiniDRC: React.FC<{ selectedName?: string }> = ({ selectedName }) => {
  const map = useMap();

  const style = (feature: any): PathOptions => {
    // Use adm1_name by default (works with your current data)
    const name =
      feature?.properties?.adm1_name ??
      feature?.properties?.NAME_1 ??
      feature?.properties?.name ??
      '';
    const isSel =
      selectedName &&
      name &&
      name.toLowerCase() === selectedName.toLowerCase();
    return {
      weight: 1,
      color: '#d9cfee',
      fillColor: isSel ? THEME_2 : '#ffffff', // mini map color
      fillOpacity: 1,
    };
  };

  useEffect(() => {
    const southWest = L.latLng(-13.5, 12.0);
    const northEast = L.latLng(5.5, 31.5);
    map.fitBounds(L.latLngBounds(southWest, northEast), { padding: [10, 10] });
    // lock the mini map
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    // hide controls
    (map as any)._controlContainer?.classList.add('hidden');
  }, [map]);

  return <GeoJSON data={DRC_CONGO as any} style={style} />;
};

/* ---------------- Detail Modal (title vs. highlight) ---------------- */
const DetailModal: React.FC<{
  open: boolean;
  title?: string;                // e.g., "Kimpangu - Kongo-Central"
  selectedProvince?: string;     // the province to highlight in MiniDRC
  summary?: string;
  showChat: boolean;
  regionId?: string;
  sessionId?: string;
  onBack: () => void;
  onAskMore: () => void;
}> = ({
  open,
  title,
  selectedProvince,
  summary,
  showChat,
  regionId,
  sessionId,
  onBack,
  onAskMore,
}) => {
    if (!open) return null;

    return (
      <div className="detail-backdrop" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className={`detail-card ${showChat ? 'is-chat' : ''}`}>
          {/* Left */}
          <div className="detail-left" style={{ background: PANEL }}>
            <MapContainer
              center={[-2.5, 23.5] as LatLngExpression}
              zoom={5}
              className="mini-map"
              zoomControl={false}
              attributionControl={false}
              style={{ background: PANEL }}
            >
              <MiniDRC selectedName={selectedProvince} />
            </MapContainer>
          </div>

          {/* Right */}
          <div className="detail-right" style={{ background: PANEL }}>
            <div className="detail-header">
              <div className="detail-title">{title}</div>
              <div className="detail-actions">
                <button className="detail-btn secondary" onClick={onBack}>Back</button>
              </div>
            </div>
            {!showChat ? (
              <>
                <div className="detail-body">{summary || 'No summary available for this region yet.'}</div>
                <div className="detail-footer">
                  <button className="detail-btn detail-btn-primary" onClick={onAskMore}>Ask More</button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', borderRadius: 12 }}>
                <ChatPlayground regionId={regionId} sessionId={sessionId} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  

/* ---------------- Provinces Layer ---------------- */
const DRCProvincesLayer: React.FC<{
  onOpenDetail: (
    title: string,
    selectedProvince: string,
    regionId: string,
    summary?: string
  ) => void;
}> = ({ onOpenDetail }) => {
  const map = useMap();
  const [data, setData] = useState<any | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const geoJsonLayerRef = useRef<L.GeoJSON<any> | null>(null);

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

  // greyscale palette
  const greys = useMemo(() => {
    const steps = 30;
    const arr: string[] = [];
    for (let i = 0; i < steps; i++) {
      const v = 245 - Math.round((i / (steps - 1)) * 120); // 245 → 125
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

  const style = (feature: any): PathOptions => ({
    weight: 1,
    color: BORDER_GREY,
    className: 'province-stroke',
    fillColor: feature?.properties?._fillColour ?? '#d9d9d9',
    fillOpacity: 0.9,
  });

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const provinceName =
      feature?.properties?.adm1_name ??
      feature?.properties?.NAME_1 ??
      feature?.properties?.name ??
      'Province';

    // find matching region record if any (optional, for summary/regionId)
    const region = regions.find(
      (r) => r.province_name && r.province_name.toLowerCase() === provinceName.toLowerCase()
    );

    const regionId = region?.region_id || provinceName.toLowerCase();
    const summary = region?.summary;

    // add map label
    const center = (layer as L.Polygon).getBounds().getCenter();
    const label = L.divIcon({
      className: 'region-label',
      html: `<div>${provinceName}</div>`,
      iconSize: [100, 40],
      iconAnchor: [50, 20],
    });
    const labelMarker = L.marker(center, { icon: label, interactive: false }).addTo(map);
    (layer as any)._labelMarker = labelMarker;

    layer.on({
      mouseover: (e: any) => e.target.setStyle({ weight: 2, fillOpacity: 1 }),
      mouseout: (e: any) => geoJsonLayerRef.current?.resetStyle(e.target),
      click: (e: any) => {
        // restore all styles
        (geoJsonLayerRef.current as any)?.setStyle?.((f: any) => ({
          weight: 1,
          color: BORDER_GREY,
          fillColor: f?.properties?._fillColour ?? '#d9d9d9',
          fillOpacity: 0.9,
        }));
        // highlight selected
        (e.target as any).setStyle({
          fillColor: THEME,
          color: BORDER_GREY,
          weight: 2,
          fillOpacity: 1,
        });

        // For polygons, title = province, highlight = province
        onOpenDetail(
          provinceName,
          provinceName,
          regionId,
          summary
        );
      },
    });
  };

  // fit to DRC on mount
  useEffect(() => {
    if (!data) return;
    setTimeout(() => {
      try {
        const b = (geoJsonLayerRef.current as any)?.getBounds?.();
        if (b?.isValid()) map.fitBounds(b, { padding: [20, 20] });
      } catch { }
    }, 0);
  }, [data, map]);

  // World mask in theme color (hides world outside DRC)
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
           fillColor: THEME, // Reference gradient
           //fillColor: 'linear-gradient(90deg, #160041 0%, #450275 50%, #F357A8 100%)', 
           color: THEME, 
            weight: 0, 
            fillOpacity: 1 }}
          interactive={false}
        />
      )}
      <GeoJSON
        ref={geoJsonLayerRef as any}
        data={data as any}
        style={style}
        onEachFeature={onEachFeature}
      />
      {/* Region flag markers → open detail modal (locality + province) */}
      {regions.map((region) => {
        if (region.lat && region.long) {
          const drcFlagIcon = L.icon({
            iconUrl: drcFlag,
            iconSize: [64, 40],
            iconAnchor: [32, 40],
            popupAnchor: [0, -10],
          });

          const provinceName = region.province_name || ''; // REQUIRED in your API now
          const displayTitle = provinceName
            ? `${region.region_name} - ${provinceName}`
            : region.region_name;

          return (
            <Marker
              key={region.id}
              position={[parseFloat(region.lat), parseFloat(region.long)]}
              icon={drcFlagIcon}
              eventHandlers={{
                click: (e) => {
                  // For markers, title = "<locality> - <province>", highlight = province
                  onOpenDetail(
                    displayTitle,
                    provinceName,
                    region.region_id,
                    region.summary
                  );
                  map.setView(e.latlng, 8);
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

/* ---------------- Page ---------------- */
const MapPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  // selection + modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [detail, setDetail] = useState<{
    title?: string;
    selectedProvince?: string;
    id?: string;
    summary?: string;
  }>({});

  // session init
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
    setDetailOpen(true);
    setShowChat(false); // start in summary mode
  };

  const openChatInModal = () => {
    const newSessionId = uuidv4();
    localStorage.setItem('chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setShowChat(true); // swap right pane to chat
  };

  const handleBackToMap = () => {
    setDetailOpen(false);
    setShowChat(false);
    setDetail({});
  };

  return (
    <div className="flex h-screen ">
      <div className="relative w-full map-root">
        {/* Top-left hint badge (always visible, sits below +/-) */}
        <div className="map-hint mt-50 ml-20" style={{ backgroundColor: '#fccfe6', padding: '12px', borderRadius: '8px' }}>
          <p className='text-white/90 font-medium text-lg'
          style={{ color: 'black' }}>Click any region to learn more</p>
        </div>

        <MapContainer
          center={[-2.5, 23.5] as LatLngExpression}
          zoom={5}
          style={{ height: '100vh', width: '100%' }}
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
          <MapController />
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

          {/* Provinces + mask + markers */}
          <DRCProvincesLayer onOpenDetail={openDetail} />
        </MapContainer>

        {/* Split-screen modal (summary or chat on the right) */}
        <DetailModal
          open={detailOpen}
          title={detail.title}
          selectedProvince={detail.selectedProvince}
          summary={detail.summary}
          showChat={showChat}
          regionId={detail.id}
          sessionId={sessionId || undefined}
          onBack={handleBackToMap}
          onAskMore={openChatInModal}
        />
      </div>
    </div>
  );
};

export default MapPage;
