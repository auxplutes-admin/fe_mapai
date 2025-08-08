import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl, GeoJSON, Marker, Popup } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';
import 'leaflet/dist/leaflet.css';
import ChatPlayground from '../../components/Chat/ChatPlayground';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import DRC_CONGO from '@/pages/MapJSON/DRC_CONGO.json';
import {getAllRegions} from '@/api';
import './Map.css';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapPoint {
  id: string;
  position: [number, number];
  title: string;
  summary?: string;
}

interface Region {
  id: number;
  created_at: number;
  region_name: string;
  region_id: string;
  lat?: string;
  long?: string;
  summary?: string;
}

// Component to handle map interactions
const MapController = () => {
  const map = useMap();

  useEffect(() => {
    // Set max bounds to DRC coordinates
    const southWest = L.latLng(-13.5, 12.0);
    const northEast = L.latLng(5.5,42.5);
    const bounds = L.latLngBounds(southWest, northEast);
    map.setMaxBounds(bounds);
    map.setMinZoom(5);
  }, [map]);

  return null;
};

// Provinces layer for Democratic Republic of the Congo (DRC)
const DRCProvincesLayer: React.FC<{ onProvinceClick: (name: string, regionId: string, summary?: string) => void }> = ({ onProvinceClick }) => {
  const map = useMap();
  const [data, setData] = useState<any | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const geoJsonLayerRef = useRef<L.GeoJSON<any> | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionsData = await getAllRegions();
        setRegions(regionsData);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };
    fetchRegions();
  }, []);

  // Distinct color palette (30+ colors)
  const palette = useMemo(
    () => [
      '#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69',
      '#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f','#1f78b4','#33a02c',
      '#e31a1c','#ff7f00','#6a3d9a','#a6cee3','#b2df8a','#fb9a99','#fdbf6f',
      '#cab2d6','#ffff99','#b15928','#7fc97f','#fdc086','#ffff99','#386cb0',
      '#f0027f','#bf5b17'
    ],
    []
  );

  useEffect(() => {
    // attach palette color deterministically
    const geojson = DRC_CONGO as any;
    geojson.features.forEach((f: any, i: number) => {
      f.properties._fillColour = palette[i % palette.length];
    });
    setData(geojson);
  }, [palette]);

  const style = (feature: any): L.PathOptions => ({
    weight: 1,
    color: '#333',
    fillColor: feature?.properties?._fillColour ?? '#cccccc',
    fillOpacity: 0.75,
  });

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const name = feature?.properties?.adm1_name || 'Province';

    // Find matching region
    const region = regions.find(r => r.region_name.toLowerCase() === name.toLowerCase());
    const regionId = region?.region_id || name.toLowerCase();
    const summary = region?.summary;

    // Create a label for the region
    const center = (layer as L.Polygon).getBounds().getCenter();
    const label = L.divIcon({
      className: 'region-label',
      html: `<div>${name}</div>`,
      iconSize: [100, 40],
      iconAnchor: [50, 20]
    });
    L.marker(center, { icon: label, interactive: false }).addTo(map);

    // Create popup content with summary and Ask More button
    const popupContent = `
      <div class="region-popup">
        <h3 class="text-xl font-semibold mb-2">${name}</h3>
        ${summary ? `
          <p class="text-gray-600 mb-4 leading-relaxed">${summary}</p>
        ` : ''}
        <div class="flex flex-col gap-3">
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            onclick="window.openRegionChat('${name}', '${regionId}', ${JSON.stringify(summary)}); window.closeRegionPopup && window.closeRegionPopup();"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              <span>Ask About This Region</span>
            </div>
          </button>
          <div class="text-xs text-gray-500 text-center">
            Click to start a conversation about ${name}
          </div>
        </div>
      </div>
    `;

    // Bind popup to layer
    layer.bindPopup(popupContent);

    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({ weight: 2, fillOpacity: 0.9 });
      },
      mouseout: (e: any) => {
        if (geoJsonLayerRef.current) {
          geoJsonLayerRef.current.resetStyle(e.target);
        }
      },
      click: (e: any) => {
        const bounds = e.target.getBounds();
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 18
        });
        e.target.openPopup();
      }
    });
  };

  useEffect(() => {
    if (!data) return;
    // After data changes and layer mounted, fit bounds
    const id = setTimeout(() => {
      if (geoJsonLayerRef.current) {
        try {
          const b = geoJsonLayerRef.current.getBounds();
          if (b && b.isValid()) {
            map.fitBounds(b, { padding: [20, 20] });
          }
        } catch {
          // ignore
        }
      }
    }, 0);
    return () => clearTimeout(id);
  }, [data, map]);

  // Build a world mask that leaves holes for DRC provinces so only DRC shows
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
        for (const ring of f.geometry.coordinates) {
          holes.push([...ring].reverse());
        }
      } else if (f.geometry.type === 'MultiPolygon') {
        for (const poly of f.geometry.coordinates) {
          for (const ring of poly) {
            holes.push([...ring].reverse());
          }
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
          style={{ fillColor: '#f0f2f5', color: '#f0f2f5', weight: 0, fillOpacity: 1 }}
          interactive={false}
        />
      )}
      <GeoJSON
        ref={geoJsonLayerRef as any}
        data={data as any}
        style={style}
        onEachFeature={onEachFeature}
      />
      {regions.map(region => {
        if (region.lat && region.long) {
          return (
            <Marker 
              key={region.id}
              position={[parseFloat(region.lat), parseFloat(region.long)]}
              eventHandlers={{
                click: (e) => {
                  map.setView(e.latlng, 8);  // Zoom to level 8 when clicking a marker
                }
              }}
            >
              <Popup>
                <div className="region-popup">
                  <h3 className="text-xl font-semibold mb-3">{region.region_name}</h3>
                  {region.summary && (
                    <div className="max-h-[200px] overflow-y-auto">
                      <p className="text-gray-600 mb-5 text-base leading-relaxed">
                        {region.summary}
                      </p>
                    </div>
                  )}
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={() => {
                      onProvinceClick(region.region_name, region.region_id, region.summary);
                      try { map.closePopup(); } catch {}
                    }}
                  >
                    Ask More
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </>
  );
};

const MapPage:React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize session ID from localStorage or create new one
  useEffect(() => {
    let storedSessionId = localStorage.getItem('chat_session_id');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('chat_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedPoint(null);
    // Clear session ID from both state and localStorage
    setSessionId(null);
    localStorage.removeItem('chat_session_id');
  };

  // Add this useEffect to handle the popup button click
  useEffect(() => {
    // Add the global function to handle popup button click
    (window as any).openRegionChat = (name: string, regionId: string, summary?: string) => {
      handleProvinceClick(name, regionId, summary);
    };

    // Cleanup
    return () => {
      delete (window as any).openRegionChat;
    };
  }, []);

  const handleProvinceClick = (provinceName: string, regionId: string, summary?: string) => {
    // Create new session ID when opening chat
    const newSessionId = uuidv4();
    localStorage.setItem('chat_session_id', newSessionId);
    setSessionId(newSessionId);
    
    setSelectedPoint({
      id: regionId,
      position: [0, 0],
      title: provinceName,
      summary
    });
    setIsChatOpen(true);
  };

  return (
    <div className="flex h-screen">
      <div className={`flex-1 relative ${isChatOpen ? 'w-2/3' : 'w-full'}`}>
        <MapContainer
          center={[-2.5, 23.5] as L.LatLngExpression}
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
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                bounds={[[-13.5, 12.0], [5.5, 31.5]]}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                bounds={[[-13.5, 12.0], [5.5, 31.5]]}
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          {/* DRC provinces colored layer */}
          <DRCProvincesLayer onProvinceClick={handleProvinceClick} />
        </MapContainer>
      </div>

      {isChatOpen && (
        <Card className="w-1/3 h-screen flex flex-col rounded-none">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Chat - {selectedPoint?.title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseChat}
            >
              Close
            </Button>
          </div>
          <div className="flex-1">
            <ChatPlayground 
              regionId={selectedPoint?.id} 
              sessionId={sessionId || undefined} 
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default MapPage;