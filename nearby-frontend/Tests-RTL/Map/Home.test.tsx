import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { NotificationProvider } from '../../src/context/Notifications/NotificationsContext';
import { DarkmodeContext } from '../../src/context/DarkMode/DarkmodeContext';
import { useAuth } from '../../src/AuthContext';
import Home from '../../src/components/Map/Home';
import { useHomeState } from '../../src/components/Map/Hooks/useHomeState';
import { useLeafletMap } from '../../src/components/Map/Hooks/useLeaftLetMap';
import { usePlaceInfo } from '../../src/components/Map/Hooks/usePlaceInfo';
import '@testing-library/jest-dom';
import * as L from 'leaflet';

// Mock dependencies
jest.mock('../../src/AuthContext', () => ({
    useAuth: jest.fn(),
}));
jest.mock('../../src/components/Map/Hooks/useHomeState');
jest.mock('../../src/components/Map/Hooks/useLeaftLetMap');
jest.mock('../../src/components/Map/Hooks/usePlaceInfo');
jest.mock('../../src/components/NavBar', () => ({
    Navbarin: () => <div>Navbar</div>,
}));
jest.mock('../../src/components/Map/SidePanel', () => ({
    SidePanel: ({ onRadiusChange, onClose }: any) => (
        <div>
            SidePanel
            <button onClick={() => onRadiusChange(500)}>Change Radius</button>
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));
jest.mock('leaflet');
jest.mock('leaflet-draw');
jest.mock('leaflet-geosearch');

describe('Home Component', () => {
    const mockHomeState = {
        marker: null,
        radius: 250,
        isLoading: false,
        refreshKey: 0,
        previousStreet: '',
        amenities: [],
        setPreviousStreet: jest.fn(),
        setMarkerAndRadius: jest.fn(),
        updateRadius: jest.fn(),
        resetState: jest.fn(),
        setIsLoading: jest.fn(),
    };
    const mockLeafletMap = {
        mapRef: { current: { on: jest.fn(), off: jest.fn() } }, // Mock Leaflet map instance
        addMarkerAt: jest.fn(),
        setViewAt: jest.fn(),
        isCleared: false,
        setIsCleared: jest.fn(),
    };
    const mockPlaceInfo = {
        zone: [],
        places: [],
        parking: [],
        weather: null,
        infractions: [],
        traffic: '',
        houseValue: 0,
        crimes: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({ user: { id: 1 } });
        (useHomeState as jest.Mock).mockReturnValue(mockHomeState);
        (useLeafletMap as jest.Mock).mockReturnValue(mockLeafletMap);
        (usePlaceInfo as jest.Mock).mockReturnValue(mockPlaceInfo);
    });

    const renderWithProviders = (darkMode: boolean = false) =>
        render(
            <CookiesProvider>
                <DarkmodeContext.Provider value={{ darkMode, toggleDarkMode: jest.fn() }}>
                    <MemoryRouter>
                        <NotificationProvider>
                            <Home />
                        </NotificationProvider>
                    </MemoryRouter>
                </DarkmodeContext.Provider>
            </CookiesProvider>
        );

    test('renders map container and placeholder when no marker is set', () => {
        renderWithProviders();

        expect(
            screen.getByText(/Clique no mapa para selecionar uma localização/)
        ).toBeInTheDocument();
        expect(screen.getByText('Navbar')).toBeInTheDocument();
        expect(screen.queryByText('SidePanel')).not.toBeInTheDocument();
    });

    test('applies dark mode classes correctly', () => {
        renderWithProviders(true);

        const rootDiv = screen.getByText(/Clique no mapa para selecionar uma localização/).parentElement?.parentElement;
        expect(rootDiv).toHaveClass('bg-gray-900 text-white');
    });

    test('renders SidePanel when marker is set', () => {
        (useHomeState as jest.Mock).mockReturnValue({
            ...mockHomeState,
            marker: { lat: 38.7, lon: -9.1 },
        });

        renderWithProviders();

        expect(screen.getByText('SidePanel')).toBeInTheDocument();
        expect(
            screen.queryByText(/Clique no mapa para selecionar uma localização/)
        ).not.toBeInTheDocument();
    });

    test('calls updateRadius from SidePanel', () => {
        (useHomeState as jest.Mock).mockReturnValue({
            ...mockHomeState,
            marker: { lat: 38.7, lon: -9.1 },
        });

        renderWithProviders();

        fireEvent.click(screen.getByText('Change Radius'));
        expect(mockHomeState.updateRadius).toHaveBeenCalledWith(500);
    });

    test('calls resetState from SidePanel', () => {
        (useHomeState as jest.Mock).mockReturnValue({
            ...mockHomeState,
            marker: { lat: 38.7, lon: -9.1 },
        });

        renderWithProviders();

        fireEvent.click(screen.getByText('Close'));
        expect(mockHomeState.resetState).toHaveBeenCalled();
    });

    test('calls setPreviousStreet when placeInfo.zone changes', async () => {
        (useHomeState as jest.Mock).mockReturnValue({
            ...mockHomeState,
            marker: { lat: 38.7, lon: -9.1 },
            previousStreet: '',
        });
        (usePlaceInfo as jest.Mock).mockReturnValue({
            ...mockPlaceInfo,
            zone: ['Rua Teste, 123, Lisboa, Portugal'],
            places: [{}],
            parking: [{}],
            weather: {},
            traffic: 'low',
            houseValue: 1000,
        });

        renderWithProviders();

        await waitFor(() => {
            expect(mockHomeState.setPreviousStreet).toHaveBeenCalledWith('Rua Teste, 123, Lisboa, Portugal');
            expect(mockHomeState.setIsLoading).toHaveBeenCalledWith(false);
        });
    });

    test('sets noData and clears loading after timeout', async () => {
        (useHomeState as jest.Mock).mockReturnValue({
            ...mockHomeState,
            marker: { lat: 38.7, lon: -9.1 },
            isLoading: true,
        });

        jest.useFakeTimers();
        renderWithProviders();

        jest.advanceTimersByTime(12000);

        await waitFor(() => {
            expect(mockHomeState.setIsLoading).toHaveBeenCalledWith(false);
            expect(screen.getByText('SidePanel')).toBeInTheDocument();
        });

        jest.useRealTimers();
    });

    test('resets state when isCleared changes', () => {
        (useLeafletMap as jest.Mock).mockReturnValue({
            ...mockLeafletMap,
            isCleared: true,
        });
        (useHomeState as jest.Mock).mockReturnValue({
            ...mockHomeState,
            marker: { lat: 38.7, lon: -9.1 },
        });

        renderWithProviders();

        expect(mockHomeState.resetState).toHaveBeenCalled();
        expect(mockLeafletMap.setIsCleared).toHaveBeenCalledWith(false);
    });
});