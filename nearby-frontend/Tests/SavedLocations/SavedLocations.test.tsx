import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { SavedLocations } from "../../src/components/SavedLocations/SavedLocations";
import { DarkmodeContext } from "../../src/context/DarkMode/DarkmodeContext";
import { useAuth } from "../../src/AuthContext";
import { useNotification } from "../../src/context/Notifications/NotificationsContext";
import { useSavedLocations } from "../../src/components/SavedLocations/Hooks/useSavedLocations";
import { useLocationCompare } from "../../src/components/SavedLocations/Hooks/useLocationCompare";
import '@testing-library/jest-dom';
import {SimpleLocation} from "@/types/SimpleLocationType";
import {fetchDeleteLocation} from "@/Fetch/Location/fetchDeleteLocation";
import {CookiesProvider} from "react-cookie";
import {MemoryRouter} from "react-router-dom";

// Mock dependencies
jest.mock('../../src/components/SavedLocations/Hooks/useSavedLocations');
jest.mock('../../src/components/SavedLocations/Hooks/useLocationCompare');
jest.mock('../../src/AuthContext', () => ({
    useAuth: jest.fn(),
}));
jest.mock('../../src/context/Notifications/NotificationsContext', () => ({
    useNotification: jest.fn(),
}));
jest.mock('@/Fetch/Location/fetchDeleteLocation');
jest.mock('../../src/components/NavBar/Navbar', () => () => <div>Navbar</div>);

describe('SavedLocations Component', () => {
    const mockShowNotification = jest.fn();
    const mockRefresh = jest.fn();
    const mockAdd = jest.fn();
    const mockRemove = jest.fn();
    const mockLocations: SimpleLocation[] = [
        { id: 1, name: 'Lisbon', lat: 38.7, lon: -9.1, searchRadius: 1000 },
        { id: 2, name: 'Porto', lat: 41.1, lon: -8.6, searchRadius: 500 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useNotification as jest.Mock).mockReturnValue({ showNotification: mockShowNotification });
        (useAuth as jest.Mock).mockReturnValue({ user: { id: 1 } });
        (useSavedLocations as jest.Mock).mockReturnValue({
            locations: mockLocations,
            loading: false,
            refresh: mockRefresh,
        });
        (useLocationCompare as jest.Mock).mockReturnValue({
            comparison: [],
            add: mockAdd.mockResolvedValue(true),
            remove: mockRemove,
        });
        (fetchDeleteLocation as jest.Mock).mockResolvedValue(true);
    });

    const renderWithProviders = (darkMode: boolean = false) =>
        render(
            <CookiesProvider>
                <DarkmodeContext.Provider value={{ darkMode, toggleDarkMode: jest.fn() }}>
                    <MemoryRouter>
                        <SavedLocations />
                    </MemoryRouter>
                </DarkmodeContext.Provider>
            </CookiesProvider>
        );

    test('renders loading state when loading is true', () => {
        (useSavedLocations as jest.Mock).mockReturnValueOnce({
            locations: [],
            loading: true,
            refresh: mockRefresh,
        });
        renderWithProviders();
        expect(screen.getByText(/Carregando localizações/i)).toBeInTheDocument();
    });

    test('shows empty message when no locations', () => {
        (useSavedLocations as jest.Mock).mockReturnValueOnce({
            locations: [],
            loading: false,
            refresh: mockRefresh,
        });
        renderWithProviders();
        expect(screen.getByText(/Nenhuma localização guardada/i)).toBeInTheDocument();
    });

    test('renders saved locations correctly', () => {
        renderWithProviders();
        expect(screen.getByText('Lisbon')).toBeInTheDocument();
        expect(screen.getByText('Porto')).toBeInTheDocument();
        expect(screen.getByText('38.7, -9.1')).toBeInTheDocument();
        expect(screen.getByText('41.1, -8.6')).toBeInTheDocument();
    });

    test('applies dark mode classes', () => {
        renderWithProviders(true);
        const container = screen.getByText('Lisbon').closest('.bg-gray-900');
        expect(container).toHaveClass('bg-gray-900', 'text-white');
        expect(screen.getByText(/Localizações Guardadas/).closest('.bg-gray-800')).toHaveClass('bg-gray-800', 'text-gray-300');
    });

    test('calls add on compare button click', async () => {
        renderWithProviders();
        const compareButton = screen.getAllByLabelText('Comparar')[0];
        fireEvent.click(compareButton);
        await waitFor(() => {
            expect(mockAdd).toHaveBeenCalledWith(1, 'Lisbon');
            expect(mockShowNotification).not.toHaveBeenCalled();
        });
    });

    test('shows error notification on failed compare', async () => {
        (useLocationCompare as jest.Mock).mockReturnValueOnce({
            comparison: [],
            add: mockAdd.mockResolvedValue(false),
            remove: mockRemove,
        });
        renderWithProviders();
        const compareButton = screen.getAllByLabelText('Comparar')[0];
        fireEvent.click(compareButton);
        await waitFor(() => {
            expect(mockAdd).toHaveBeenCalledWith(1, 'Lisbon');
            expect(mockShowNotification).toHaveBeenCalledWith('Não foi possível comparar.', 'error');
        });
    });

    test('disables compare button for more than 3 comparisons', () => {
        (useLocationCompare as jest.Mock).mockReturnValueOnce({
            comparison: [
                { id: 3, name: 'Braga' },
                { id: 4, name: 'Coimbra' },
                { id: 5, name: 'Faro' },
            ],
            add: mockAdd,
            remove: mockRemove,
        });
        renderWithProviders();
        const compareButton = screen.getAllByLabelText('Comparar')[0];
        expect(compareButton).toBeDisabled();
    });

    test('disables compare button for duplicate location', () => {
        (useLocationCompare as jest.Mock).mockReturnValueOnce({
            comparison: [{ id: 1, name: 'Lisbon' }],
            add: mockAdd,
            remove: mockRemove,
        });
        renderWithProviders();
        const compareButton = screen.getAllByLabelText('Comparar')[0];
        expect(compareButton).toBeDisabled();
    });



    test('calls fetchDeleteLocation and refresh on delete', async () => {
        renderWithProviders();
        const deleteButton = screen.getAllByLabelText('Eliminar')[0];
        fireEvent.click(deleteButton);
        await waitFor(() => {
            expect(fetchDeleteLocation).toHaveBeenCalledWith('Lisbon', 1);
            expect(mockShowNotification).toHaveBeenCalledWith('Localização "Lisbon" eliminada com sucesso!', 'success');
            expect(mockRefresh).toHaveBeenCalled();
        });
    });

    test('shows error notification on failed delete', async () => {
        (fetchDeleteLocation as jest.Mock).mockResolvedValueOnce(false);
        renderWithProviders();
        const deleteButton = screen.getAllByLabelText('Eliminar')[0];
        fireEvent.click(deleteButton);
        await waitFor(() => {
            expect(fetchDeleteLocation).toHaveBeenCalledWith('Lisbon', 1);
            expect(mockShowNotification).toHaveBeenCalledWith(
                'Não foi possível eliminar a localização. Verifique se tem um comentário associado.',
                'error'
            );
            expect(mockRefresh).not.toHaveBeenCalled();
        });
    });

    test('renders without user in AuthContext', () => {
        (useAuth as jest.Mock).mockReturnValueOnce({ user: null });
        renderWithProviders();
        expect(screen.getByText('Lisbon')).toBeInTheDocument();
    });
});