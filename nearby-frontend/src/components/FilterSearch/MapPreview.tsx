import React from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import { MapCenter, Amenity } from '@/types/FilterTypes';
import { customMarkerIcon } from '@/utils/leafletConfig';

interface MapPreviewProps {
    /**
     * Coordinates for the center of the map.
     * If null, the map is not rendered.
     */
    mapCenter: MapCenter | null;

    /**
     * Radius in meters to display a circle around the map center.
     */
    radius: number;

    /**
     * Array of amenities to show as markers on the map.
     */
    amenities: Amenity[];
}

const MapPreview: React.FC<MapPreviewProps> = ({ mapCenter, radius, amenities }) => {
    /**
     * Determines the zoom level based on the radius value.
     * Smaller radius means higher zoom.
     * @param radius radius in meters
     * @returns zoom level number
     */
    const getZoomLevel = (radius: number) => {
        if (radius <= 1000) return 15;
        if (radius <= 3000) return 14;
        if (radius <= 5000) return 13;
        return 12;
    };

    // If no map center provided, don't render the map
    if (!mapCenter) return null;

    return (
        /**
         * Motion container for fade and scale animation on mount.
         */
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-96 w-full rounded-lg overflow-hidden shadow-lg"
        >
            {/**
             * Leaflet map container with controls disabled for preview mode.
             */}
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
                {/**
                 * Tile layer using OpenStreetMap tiles.
                 */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/**
                 * Marker indicating the center of the map.
                 */}
                <Marker position={[mapCenter.lat, mapCenter.lon]} />
                {/**
                 * Circle overlay representing the radius around the center.
                 */}
                <Circle
                    center={[mapCenter.lat, mapCenter.lon]}
                    radius={radius}
                    pathOptions={{ color: 'blue', fillOpacity: 0.2 }}
                />
                {/**
                 * Markers for amenities, limited to 10 items to avoid clutter.
                 * Uses a custom marker icon.
                 */}
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
