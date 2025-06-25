import L from 'leaflet';

/**
 * Configures the default Leaflet marker icons by overriding
 * the default icon URLs with custom CDN-hosted URLs.
 *
 * This fixes issues where the default marker icons might not load properly
 * (e.g., in some build setups or environments).
 */
export const configureLeafletIcons = () => {
    // Remove the existing private _getIconUrl method to avoid conflicts
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    // Merge custom icon URLs into Leaflet's default icon options
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
};

/**
 * Creates a custom Leaflet marker icon with specified size and anchor.
 *
 * This can be used to display map markers with consistent sizing
 * and positioning relative to the map coordinates.
 */
export const customMarkerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [20, 32],      // width: 20px, height: 32px
    iconAnchor: [10, 32],    // point of the icon which will correspond to marker's location (center bottom)
});
