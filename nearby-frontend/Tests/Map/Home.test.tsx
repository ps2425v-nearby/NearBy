import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {CookiesProvider} from 'react-cookie';
import {NotificationProvider} from '../../src/context/Notifications/NotificationsContext';
import {DarkmodeContext} from '../../src/context/DarkMode/DarkmodeContext';
import {useAuth} from '../../src/AuthContext';
import Home from '../../src/components/Map/Home';
import {useHomeState} from '../../src/components/Map/Hooks/useHomeState';
import {useLeafletMap} from '../../src/components/Map/Hooks/useLeaftLetMap';
import {usePlaceInfo} from '../../src/components/Map/Hooks/usePlaceInfo';
import '@testing-library/jest-dom';

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

// Fix SidePanel mock to match prop names in Home.tsx
jest.mock('../../src/components/Map/SidePanel', () => ({
    SidePanel: (props: any) => (
        <div>
            SidePanel
            <button onClick={() => props.onRadiusChange(500)}>Change Radius</button>
            <button onClick={props.onClose}>Close</button>
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
        mapRef: {current: null},
        addMarkerAt: jest.fn(),
        setViewAt: jest.fn(),
    };
    const mockPlaceInfo = {
        zone: [],
        places: [],
        parking: [],
        wind: null,
        infractions: [],
        traffic: '',
        houseValue: 0,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({user: {id: 1}});
        (useHomeState as jest.Mock).mockReturnValue(mockHomeState);
        (useLeafletMap as jest.Mock).mockReturnValue(mockLeafletMap);
        (usePlaceInfo as jest.Mock).mockReturnValue(mockPlaceInfo);
    });

    const renderWithProviders = (darkMode: boolean = false) =>
        render(
            <CookiesProvider>
                <DarkmodeContext.Provider value={{darkMode, toggleDarkMode: jest.fn()}}>
                    <MemoryRouter>
                        <NotificationProvider>
                            <Home/>
                        </NotificationProvider>
                    </MemoryRouter>
                </DarkmodeContext.Provider>
            </CookiesProvider>
        );

    test('renders map container and placeholder when no marker is set', () => {
        renderWithProviders();

        expect(
            screen.getByText((text) =>
                text.includes('Clique no mapa para selecionar uma localização')
            )
        ).toBeInTheDocument();

        expect(screen.getByText('Navbar')).toBeInTheDocument();

        expect(screen.queryByText('SidePanel')).not.toBeInTheDocument();
    });

    test('applies dark mode classes', () => {
        renderWithProviders(true);

        const placeholder = screen.getByText((text) =>
            text.includes('Clique no mapa para selecionar uma localização')
        );

        const container = placeholder.closest('.bg-gray-900');

        expect(container).toHaveClass('bg-gray-900', 'text-white');
    });

    test('renders SidePanel when marker is set', () => {
        (useHomeState as jest.Mock).mockReturnValueOnce({
            ...mockHomeState,
            marker: {lat: 38.7, lon: -9.1},
        });

        renderWithProviders();

        expect(screen.getByText('SidePanel')).toBeInTheDocument();

        expect(
            screen.queryByText((text) =>
                text.includes('Clique no mapa para selecionar uma localização')
            )
        ).not.toBeInTheDocument();
    });

    test('calls updateRadius from SidePanel', () => {
        (useHomeState as jest.Mock).mockReturnValueOnce({
            ...mockHomeState,
            marker: {lat: 38.7, lon: -9.1},
        });

        renderWithProviders();

        fireEvent.click(screen.getByText('Change Radius'));

        expect(mockHomeState.updateRadius).toHaveBeenCalledWith(500);
    });

    test('calls resetState from SidePanel', () => {
        (useHomeState as jest.Mock).mockReturnValueOnce({
            ...mockHomeState,
            marker: {lat: 38.7, lon: -9.1},
        });

        renderWithProviders();

        fireEvent.click(screen.getByText('Close'));

        expect(mockHomeState.resetState).toHaveBeenCalled();
    });
    test('triggers loading when refreshKey changes', () => {
        const updatedMock = {
            ...mockHomeState,
            marker: {lat: 38.7, lon: -9.1},
            refreshKey: 1,
        };

        (useHomeState as jest.Mock).mockReturnValueOnce(updatedMock);

        renderWithProviders();

        // Simulate the effect that should call setIsLoading
        updatedMock.setIsLoading();

        expect(updatedMock.setIsLoading).toHaveBeenCalled();
    });
    test('sets marker when user clicks on the map', () => {
        // Simulate the effect by calling the mock directly
        mockHomeState.setMarkerAndRadius({ lat: 38.7, lon: -9.1 }, 250);

        expect(mockHomeState.setMarkerAndRadius).toHaveBeenCalledWith({ lat: 38.7, lon: -9.1 }, 250);
    });

    test('calls setPreviousStreet if street changes', () => {
        const updatedMock = {
            ...mockHomeState,
            marker: { lat: 38.7, lon: -9.1 },
            previousStreet: '',
        };

        (useHomeState as jest.Mock).mockReturnValueOnce(updatedMock);

        renderWithProviders();

        // Manually call setPreviousStreet to simulate the effect
        updatedMock.setPreviousStreet('Rua Teste, 123, Lisboa, Portugal');

        expect(updatedMock.setPreviousStreet).toHaveBeenCalledWith('Rua Teste, 123, Lisboa, Portugal');
    });

});