import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

  .fh-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
  }

  .fh-topbar {
    background: white;
    padding: 0 28px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 1000;
  }

  .fh-topbar-left { display: flex; align-items: center; gap: 12px; }

  .fh-back {
    width: 38px; height: 38px;
    border-radius: 10px; border: 1px solid #eee;
    background: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.2s;
  }
  .fh-back:hover { background: #fff5f5; border-color: #ffcdd2; }

  .fh-title {
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 700; color: #1a1a2e;
  }

  .fh-badge {
    background: #fff5f5; color: #e53935;
    font-size: 12px; font-weight: 700;
    padding: 4px 12px; border-radius: 20px;
    border: 1px solid #ffcdd2;
  }

  .fh-body {
    display: grid;
    grid-template-columns: 380px 1fr;
    height: calc(100vh - 64px);
  }

  /* LEFT PANEL */
  .fh-left {
    background: white;
    border-right: 1px solid #f0f0f0;
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  .fh-search-box {
    padding: 16px;
    border-bottom: 1px solid #f5f5f5;
  }

  .fh-search-wrap {
    display: flex; align-items: center; gap: 10px;
    background: #f8f8f8; border-radius: 12px;
    padding: 10px 14px; border: 1px solid #eee;
    transition: border-color 0.2s;
  }
  .fh-search-wrap:focus-within { border-color: #e53935; background: white; }

  .fh-search-input {
    border: none; background: none; outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #1a1a2e; flex: 1;
  }

  .fh-stats {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 10px; padding: 14px 16px;
    border-bottom: 1px solid #f5f5f5;
  }

  .fh-stat {
    background: #f8f8f8; border-radius: 12px;
    padding: 12px; text-align: center;
  }

  .fh-stat-val {
    font-family: 'Outfit', sans-serif;
    font-size: 20px; font-weight: 800; color: #e53935;
  }

  .fh-stat-label { font-size: 11px; color: #888; margin-top: 2px; }

  .fh-list {
    flex: 1; overflow-y: auto; padding: 12px;
  }

  .fh-list::-webkit-scrollbar { width: 4px; }
  .fh-list::-webkit-scrollbar-thumb { background: #eee; border-radius: 4px; }

  .fh-hospital-card {
    background: white; border: 1px solid #f0f0f0;
    border-radius: 14px; padding: 14px 16px;
    margin-bottom: 10px; cursor: pointer;
    transition: all 0.2s; position: relative;
    overflow: hidden;
  }

  .fh-hospital-card:hover {
    border-color: #ffcdd2;
    box-shadow: 0 4px 16px rgba(229,57,53,0.1);
    transform: translateY(-1px);
  }

  .fh-hospital-card.selected {
    border-color: #e53935;
    background: #fff5f5;
    box-shadow: 0 4px 20px rgba(229,57,53,0.15);
  }

  .fh-hospital-card::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: #e53935;
    border-radius: 3px 0 0 3px;
    opacity: 0; transition: opacity 0.2s;
  }

  .fh-hospital-card.selected::before { opacity: 1; }

  .fh-card-top {
    display: flex; align-items: flex-start; gap: 12px;
  }

  .fh-card-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: #fff5f5;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }

  .fh-card-name {
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 700; color: #1a1a2e;
    margin-bottom: 3px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .fh-card-type {
    font-size: 12px; color: #888;
  }

  .fh-card-bottom {
    display: flex; align-items: center; gap: 8px;
    margin-top: 10px;
  }

  .fh-chip {
    font-size: 11px; font-weight: 600;
    padding: 4px 10px; border-radius: 8px;
  }

  .fh-chip-open { background: #e8f5e9; color: #2e7d32; }
  .fh-chip-dist { background: #e3f2fd; color: #1565c0; }
  .fh-chip-type { background: #f3e5f5; color: #6a1b9a; }

  /* LOADING */
  .fh-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 100%; gap: 16px;
  }

  .fh-spinner {
    width: 48px; height: 48px;
    border: 4px solid #ffcdd2;
    border-top-color: #e53935;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .fh-loading-text {
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 600; color: #1a1a2e;
  }

  .fh-loading-sub { font-size: 13px; color: #888; }

  /* MAP */
  .fh-map-wrap { position: relative; }

  .fh-map-wrap .leaflet-container {
    height: 100%; width: 100%;
  }

  .fh-map-overlay {
    position: absolute; bottom: 20px; right: 20px;
    background: white; border-radius: 14px;
    padding: 14px 18px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    z-index: 999; min-width: 200px;
  }

  .fh-overlay-title {
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 700; color: #1a1a2e;
    margin-bottom: 8px;
  }

  .fh-legend-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: #666; margin-bottom: 5px;
  }

  .fh-legend-dot {
    width: 12px; height: 12px; border-radius: 50%;
  }

  @media (max-width: 768px) {
    .fh-body { grid-template-columns: 1fr; }
    .fh-map-wrap { height: 300px; }
  }
`;
document.head.appendChild(style);

// Custom marker icons
const userIcon = L.divIcon({
  html: `<div style="
    width:36px;height:36px;
    background:linear-gradient(135deg,#e53935,#c62828);
    border-radius:50%;
    border:3px solid white;
    box-shadow:0 4px 12px rgba(229,57,53,0.5);
    display:flex;align-items:center;justify-content:center;
    font-size:16px;
  ">📍</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const hospitalIcon = L.divIcon({
  html: `<div style="
    width:32px;height:32px;
    background:white;
    border-radius:10px;
    border:2px solid #e53935;
    box-shadow:0 3px 10px rgba(0,0,0,0.15);
    display:flex;align-items:center;justify-content:center;
    font-size:16px;
  ">🏥</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const selectedHospitalIcon = L.divIcon({
  html: `<div style="
    width:40px;height:40px;
    background:linear-gradient(135deg,#e53935,#c62828);
    border-radius:12px;
    border:3px solid white;
    box-shadow:0 4px 16px rgba(229,57,53,0.5);
    display:flex;align-items:center;justify-content:center;
    font-size:20px;
  ">🏥</div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
}

function FindHospital() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation([latitude, longitude]);

      const query = `
        [out:json];
        node["amenity"="hospital"](around:5000,${latitude},${longitude});
        out;
      `;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();
      setHospitals(data.elements);
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const filtered = hospitals.filter(h =>
    (h.tags?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const sorted = filtered.sort((a, b) => {
    if (!location) return 0;
    return getDistance(location[0], location[1], a.lat, a.lon) -
           getDistance(location[0], location[1], b.lat, b.lon);
  });

  return (
    <div className="fh-root">

      {/* TOPBAR */}
      <div className="fh-topbar">
        <div className="fh-topbar-left">
          <button className="fh-back" onClick={() => navigate('/dashboard')}>←</button>
          <span className="fh-title">🏥 Find Nearest Hospital</span>
        </div>
        <span className="fh-badge">{hospitals.length} Found</span>
      </div>

      <div className="fh-body">

        {/* LEFT PANEL */}
        <div className="fh-left">

          {/* Search */}
          <div className="fh-search-box">
            <div className="fh-search-wrap">
              <span>🔍</span>
              <input
                className="fh-search-input"
                placeholder="Search hospitals..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Stats */}
          {!loading && location && (
            <div className="fh-stats">
              <div className="fh-stat">
                <div className="fh-stat-val">{hospitals.length}</div>
                <div className="fh-stat-label">Hospitals</div>
              </div>
              <div className="fh-stat">
                <div className="fh-stat-val">5km</div>
                <div className="fh-stat-label">Radius</div>
              </div>
              <div className="fh-stat">
                <div className="fh-stat-val">
                  {hospitals.length > 0 && location
                    ? getDistance(location[0], location[1], hospitals[0].lat, hospitals[0].lon)
                    : '--'}
                </div>
                <div className="fh-stat-label">Nearest km</div>
              </div>
            </div>
          )}

          {/* List */}
          <div className="fh-list">
            {loading ? (
              <div className="fh-loading">
                <div className="fh-spinner" />
                <div className="fh-loading-text">Finding hospitals...</div>
                <div className="fh-loading-sub">Getting your location 📍</div>
              </div>
            ) : sorted.length === 0 ? (
              <div className="fh-loading">
                <div style={{fontSize:40}}>🏥</div>
                <div className="fh-loading-text">No hospitals found</div>
                <div className="fh-loading-sub">Try expanding search radius</div>
              </div>
            ) : (
              sorted.map(h => (
                <div
                  key={h.id}
                  className={`fh-hospital-card ${selected?.id === h.id ? 'selected' : ''}`}
                  onClick={() => setSelected(h)}
                >
                  <div className="fh-card-top">
                    <div className="fh-card-icon" style={{padding:0, overflow:'hidden'}}>
  <img
    src={`https://source.unsplash.com/42x42/?hospital,medical&sig=${h.id}`}
    alt="hospital"
    style={{width:'100%', height:'100%', objectfit:'cover', borderradius:12}}
    onerror={e => { e.target.style.display='none'; e.target.parentelement.innerhtml='🏥'; }}
  />
</div>
                    <div>
                      <div className="fh-card-name">{h.tags?.name || 'Hospital'}</div>
                      <div className="fh-card-type">
                        {h.tags?.['addr:street'] || 'Healthcare Facility'}
                      </div>
                    </div>
                  </div>
                  <div className="fh-card-bottom">
                    <span className="fh-chip fh-chip-open">🟢 Open</span>
                    {location && (
                      <span className="fh-chip fh-chip-dist">
                        📍 {getDistance(location[0], location[1], h.lat, h.lon)} km
                      </span>
                    )}
                    <span className="fh-chip fh-chip-type">🏥 Hospital</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MAP */}
        <div className="fh-map-wrap">
          {location && (
            <>
              <MapContainer
                center={selected ? [selected.lat, selected.lon] : location}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* User location */}
                <Marker position={location} icon={userIcon}>
                  <Popup>
                    <strong>📍 You are here</strong>
                  </Popup>
                </Marker>

                {/* 5km radius circle */}
                <Circle
                  center={location}
                  radius={5000}
                  pathOptions={{ color: '#e53935', fillColor: '#e53935', fillOpacity: 0.04, weight: 1.5, dashArray: '6' }}
                />

                {/* Hospitals */}
                {hospitals.map(h => (
                  <Marker
                    key={h.id}
                    position={[h.lat, h.lon]}
                    icon={selected?.id === h.id ? selectedHospitalIcon : hospitalIcon}
                    eventHandlers={{ click: () => setSelected(h) }}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'Outfit, sans-serif', minWidth: 160 }}>
                        <strong style={{ fontSize: 14 }}>🏥 {h.tags?.name || 'Hospital'}</strong>
                        <br />
                        <span style={{ fontSize: 12, color: '#666' }}>
                          {h.tags?.['addr:street'] || 'Healthcare Facility'}
                        </span>
                        {location && (
                          <div style={{ marginTop: 6, fontSize: 12, color: '#e53935', fontWeight: 600 }}>
                            📍 {getDistance(location[0], location[1], h.lat, h.lon)} km away
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Map Legend */}
              <div className="fh-map-overlay">
                <div className="fh-overlay-title">Map Legend</div>
                <div className="fh-legend-item">
                  <div className="fh-legend-dot" style={{background:'#e53935'}} />
                  Your Location
                </div>
                <div className="fh-legend-item">
                  <div className="fh-legend-dot" style={{background:'#1976d2'}} />
                  Hospital
                </div>
                <div className="fh-legend-item">
                  <div className="fh-legend-dot" style={{background:'#e53935', opacity:0.3, border:'1px dashed #e53935'}} />
                  5km Radius
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindHospital;