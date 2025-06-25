import React from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import { MapCenter, Amenity } from '@/types/FilterTypes';
import { customMarkerIcon } from '@/utils/leafletConfig';

interface MapPreviewProps {
    mapCenter: MapCenter | null;
    radius: number;
    amenities: Amenity[];
}

const MapPreview: React.FC<MapPreviewProps> = ({ mapCenter, radius, amenities }) => {
    const getZoomLevel = (radius: number) => {
        if (radius <= 1000) return 15;
        if (radius <= 3000) return 14;
        if (radius <= 5000) return 13;
        return 12;
    };

    if (!mapCenter) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-96 w-full rounded-lg overflow-hidden shadow-lg"
        >
            <MapContainer
                center={[mapCenter.lat, mapCenter.lon]}
                zoom={getZoomLevel(radius)}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                dragging={false}
                doubleClickZoom={false}
                zoomControl={false}
                touchZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[mapCenter.lat, mapCenter.lon]} />
                <Circle
                    center={[mapCenter.lat, mapCenter.lon]}
                    radius={radius}
                    pathOptions={{ color: 'blue', fillOpacity: 0.2 }}
                />
                {amenities.slice(0, 10).map((amenity) => (
                    <Marker
                        key={amenity.id}
                        position={[amenity.lat, amenity.lon]}
                        icon={customMarkerIcon}
                    />
                ))}
            </MapContainer>
        </motion.div>
    );
};

export default MapPreview;