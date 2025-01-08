import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Tooltip,
  Marker,
  GeoJSON,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const KarnatakaBounds = ({ geojson }) => {
  const map = useMap();

  useEffect(() => {
    if (geojson) {
      const bounds = L.geoJSON(geojson).getBounds();
      map.fitBounds(bounds);
    }
  }, [geojson, map]);

  return null;
};

const KarnatakaServiceCenterMap = () => {
  const [karnatakaGeoJSON, setKarnatakaGeoJSON] = useState(null);
  const [rtoLocations, setRtoLocations] = useState([]);

  useEffect(() => {
    // Fetch Karnataka GeoJSON
    fetch(
      "https://raw.githubusercontent.com/adarshbiradar/maps-geojson/master/states/karnataka.json"
    )
      .then((response) => response.json())
      .then((data) => setKarnatakaGeoJSON(data));

    // Fetch RTO data from data_rto.json
    fetch("/data_rto.json")
      .then((response) => response.json())
      .then((data) => setRtoLocations(data))
      .catch((error) => console.error("Error loading RTO data:", error));
  }, []);

  const center = [15.3173, 75.7139];

  const districtStyle = {
    fillColor: "transparent",
    weight: 2,
    opacity: 1,
    color: "black",
    dashArray: "3",
  };

  const calculateServiceCenters = (vehicles) => {
    const minVehicles = 30000;
    const maxVehicles = 50000;
    const avgVehicles = (minVehicles + maxVehicles) / 2;
    return Math.max(1, Math.ceil(vehicles / avgVehicles));
  };

  const calculateRadius = (vehicles, serviceCenters) => {
    if (vehicles <= 0 || serviceCenters <= 0) {
      console.warn(
        `Invalid data: vehicles=${vehicles}, serviceCenters=${serviceCenters}`
      );
      return 1000; // Return a default radius of 1km
    }
    const baseRadius = 5000; // 5km base radius
    return Math.max(
      1000,
      (Math.sqrt(vehicles / serviceCenters) * baseRadius) / 100
    );
  };

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {karnatakaGeoJSON && (
          <>
            <GeoJSON data={karnatakaGeoJSON} style={districtStyle} />
            <KarnatakaBounds geojson={karnatakaGeoJSON} />
          </>
        )}
        {rtoLocations.map((rto) => {
          const serviceCenters = calculateServiceCenters(rto.vehicles);
          const radius = calculateRadius(rto.vehicles, serviceCenters);
          return (
            <React.Fragment key={rto.name}>
              <Circle
                center={[rto.lat, rto.lon]}
                radius={radius}
                pathOptions={{
                  fillColor: "#fcbf49",
                  fillOpacity: 0.3,
                  color: "#003049",
                  weight: 1,
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -20]}
                  opacity={1}
                  permanent
                >
                  {`${rto.name}: ${serviceCenters} center${
                    serviceCenters > 1 ? "s" : ""
                  }`}
                </Tooltip>
              </Circle>
              <Marker
                position={[rto.lat, rto.lon]}
                icon={L.divIcon({ className: "rto-marker" })}
              >
                <Tooltip>
                  {`${rto.name} (${rto.vehicles.toLocaleString()} vehicles)`}
                </Tooltip>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
      <style jsx global>{`
        .rto-marker {
          background: none;
          border: none;
        }
        .leaflet-tooltip {
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          padding: 4px 8px;
          font-size: 12px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default KarnatakaServiceCenterMap;
