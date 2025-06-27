// useInformationLogic.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CookiesProvider } from 'react-cookie';

import { useInformationLogic } from '../../..//src/components/Map/information/useInformationLogic';
import { AuthContext } from '../../..//src/AuthContext';
import { DarkmodeContext } from '../../..//src/context/DarkMode/DarkmodeContext';

jest.mock('../../..//src/context/Notifications/NotificationsContext', () => ({
    useNotification: jest.fn(),
}));

jest.mock('@/Fetch/Location/Saved/saveLocation', () => ({
    saveApiLocation: jest.fn(),
}));

jest.mock('@/Fetch/Location/fetchLocationId', () => ({
    fetchLocationByLatLon: jest.fn(),
}));

import { fetchLocationByLatLon } from '@/Fetch/Location/fetchLocationId';
import { useNotification } from '../../..//src/context/Notifications/NotificationsContext';

const mockShowNotification = jest.fn();

function TestComponent(props: any) {
    const logic = useInformationLogic(props);
    return (
        <div>
            <button onClick={() => logic.setRadius(3000)}>Set Radius</button>
            <button onClick={() => logic.onRadiusChange(1800)}>Radius Change</button>
            <button onClick={() => logic.handleSaveLocation()}>Save Location</button>
            <button onClick={() => logic.handleComment()}>Comment</button>
            <button onClick={logic.handleClosePopup}>Close Popup</button>
            <span data-testid="radius">{logic.radius}</span>
            <span data-testid="noData">{String(logic.noData)}</span>
        </div>
    );
}

const defaultProps = {
    cityIdentification: ['Lisbon'],
    iradius: 4000,
    places: [{ type: 'place', id: 1, lat: 10, lon: 10, tags: new Map() }],
    parkingSpaces: [],
    wind: {},
    crimes: {},
    trafficLevel: 'medium',
    housingPrices: 1000,
    onCloseClick: jest.fn(),
    onRadiusChange: jest.fn(),
    isLoading: false,
};

function renderWithProviders(ui: React.ReactNode) {
    (useNotification as jest.Mock).mockReturnValue({ showNotification: mockShowNotification });

    const mockAuthContextValue = {
        userID: 1,
        username: 'mock',
        setUserID: jest.fn(),
        setUsername: jest.fn(),
        setLoggedIn: jest.fn(),
        loggedIn: true,
        dispatch: jest.fn(),
        logout: jest.fn(),
    };

    return render(
        <CookiesProvider>
            <AuthContext.Provider value={mockAuthContextValue}>
                <DarkmodeContext.Provider value={{ darkMode: false, toggleDarkMode: jest.fn() }}>
                    {ui}
                </DarkmodeContext.Provider>
            </AuthContext.Provider>
        </CookiesProvider>
    );
}

describe('useInformationLogic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('lastMarker', JSON.stringify({ lat: 10, lon: 20 }));
    });

    test('limits radius to 2500 initially', () => {
        const { getByTestId } = renderWithProviders(<TestComponent {...defaultProps} />);
        expect(getByTestId('radius').textContent).toBe('2500');
    });

    test('updates radius with setRadius correctly', () => {
        const { getByText, getByTestId } = renderWithProviders(<TestComponent {...defaultProps} />);
        fireEvent.click(getByText('Set Radius'));
        expect(getByTestId('radius').textContent).toBe('2500');
    });

    test('calls onRadiusChange if new radius is different', () => {
        const props = { ...defaultProps, iradius: 1500 };
        const { getByText } = renderWithProviders(<TestComponent {...props} />);
        fireEvent.click(getByText('Radius Change'));
        expect(props.onRadiusChange).toHaveBeenCalledWith(1800);
    });

    test('handles comment location success', async () => {
        (fetchLocationByLatLon as jest.Mock).mockResolvedValueOnce({ id: 42 });
        const { getByText } = renderWithProviders(<TestComponent {...defaultProps} />);
        fireEvent.click(getByText('Comment'));

        await waitFor(() => expect(fetchLocationByLatLon).toHaveBeenCalled());
    });

    test('handles comment failure', async () => {
        (fetchLocationByLatLon as jest.Mock).mockRejectedValueOnce(new Error());
        const { getByText } = renderWithProviders(<TestComponent {...defaultProps} />);
        fireEvent.click(getByText('Comment'));

        await waitFor(() =>
            expect(mockShowNotification).toHaveBeenCalledWith('Erro ao buscar localização. Verifique se já está guardada!!', 'warning')
        );
    });

});

