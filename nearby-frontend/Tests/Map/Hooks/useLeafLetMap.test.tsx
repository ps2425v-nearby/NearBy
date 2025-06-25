/*
import {renderHook} from '@testing-library/react';
import {useLeafletMap} from '../../../src/components/Map/Hooks/useLeaftLetMap';
import {act} from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import * as L from 'leaflet';
import {GeoSearchControl} from 'leaflet-geosearch';

const mapMock = {
    setView: jest.fn().mockReturnThis(),
    addLayer: jest.fn().mockReturnThis(),
    removeLayer: jest.fn(),
    panTo: jest.fn(),
    getSize: jest.fn(() => ({x: 1000, y: 800})),
    latLngToContainerPoint: jest.fn(() => ({add: jest.fn(() => ({x: 250, y: 400}))})),
    containerPointToLatLng: jest.fn(() => ({lat: 38.7489, lng: -9.1004})),
    on: jest.fn(),
    remove: jest.fn(),
};

const tileLayerMock = {
    addTo: jest.fn(),
};

const markerMock = {
    addTo: jest.fn().mockReturnThis(),
    on: jest.fn(),
};

const circleMock = {
    addTo: jest.fn().mockReturnThis(),
};

const featureGroupMock = {
    addLayer: jest.fn(),
    clearLayers: jest.fn(),
};

const Li = {
    map: jest.fn(() => mapMock),
    tileLayer: jest.fn(() => tileLayerMock),
    marker: jest.fn(() => markerMock),
    circle: jest.fn(() => circleMock),
    FeatureGroup: jest.fn(() => featureGroupMock),
    Control: {Draw: jest.fn(() => ({}))},
    Draw: {
        Event: {
            CREATED: 'draw:created',
            DELETED: 'draw:deleted',
            DRAWSTART: 'draw:drawstart',
            DRAWSTOP: 'draw:drawstop',
        },
    },
    layerGroup: jest.fn(() => ({addTo: jest.fn()})),
    Icon: jest.fn(),
};

// Mock leaflet and geosearch
jest.mock('leaflet');
jest.mock('leaflet-geosearch', () => ({
    GeoSearchControl: jest.fn(),
    OpenStreetMapProvider: jest.fn(),
}));

describe('useLeafletMap hook', () => {
    let container: HTMLDivElement;
    const onPickMock = jest.fn();
    const radius = 500;
    const iconMock = {} as L.Icon;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        jest.clearAllMocks();
    });

    it('initializes the map only once and attaches layers & controls', () => {
        const containerRef = {current: container};

        act(() => {
            renderHook(() => useLeafletMap(containerRef, onPickMock, radius, iconMock));
        });

        expect(Li.map).toHaveBeenCalledWith(container);
        expect(Li.tileLayer).toHaveBeenCalled();
        expect(Li.FeatureGroup).toHaveBeenCalled();
        expect(GeoSearchControl).toHaveBeenCalled();
    });

    it('calls onPick and pans map when a marker is added programmatically', () => {
        const containerRef = {current: container};
        const {result} = renderHook(() => useLeafletMap(containerRef, onPickMock, radius, iconMock));

        act(() => {
            result.current.addMarkerAt(38.7489, -9.1004, radius);
        });

        expect(onPickMock).toHaveBeenCalledWith(38.7489, -9.1004, radius);
    });

    it('sets view correctly using setViewAt', () => {
        const containerRef = {current: container};
        const {result} = renderHook(() => useLeafletMap(containerRef, onPickMock, radius, iconMock));

        act(() => {
            result.current.setViewAt(38.7489, -9.1004);
        });

        expect(Li.map().panTo).toHaveBeenCalled();
    });
});
*/
