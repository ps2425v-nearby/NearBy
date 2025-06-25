import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SavedList } from '../../src/components/SavedLocations/SavedList';
import fetchMock from 'jest-fetch-mock';
import {SimpleLocation} from "@/types/SimpleLocationType";
import '@testing-library/jest-dom';


fetchMock.enableMocks();

describe('SavedList Component', () => {
    const mockLocations: SimpleLocation[] = [
        { id: 1, name: 'Lisbon', lat: 38.7, lon: -9.1, searchRadius: 1000 },
        { id: 2, name: 'Porto', lat: 41.1, lon: -8.6, searchRadius: 500 },
    ];
    const mockOnCompare = jest.fn();
    const mockOnDelete = jest.fn();
    const mockDisableCompare = jest.fn();

    beforeEach(() => {
        fetchMock.resetMocks();
        jest.clearAllMocks();
    });

    test('renders locations correctly', () => {
        mockDisableCompare.mockReturnValue(false);
        render(
            <MemoryRouter>
                <SavedList
                    locations={mockLocations}
                    onCompare={mockOnCompare}
                    onDelete={mockOnDelete}
                    disableCompare={mockDisableCompare}
                />
            </MemoryRouter>
        );

        expect(screen.getByText('Lisbon')).toBeInTheDocument();
        expect(screen.getByText('38.7, -9.1')).toBeInTheDocument();
        expect(screen.getByText('Porto')).toBeInTheDocument();
        expect(screen.getByText('41.1, -8.6')).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    test('renders empty list without errors', () => {
        render(
            <MemoryRouter>
                <SavedList
                    locations={[]}
                    onCompare={mockOnCompare}
                    onDelete={mockOnDelete}
                    disableCompare={mockDisableCompare}
                />
            </MemoryRouter>
        );
        expect(screen.getByRole('list')).toBeEmptyDOMElement();
    });


    test('Compare button triggers onCompare when enabled', () => {
        mockDisableCompare.mockReturnValue(false);
        render(
            <MemoryRouter>
                <SavedList
                    locations={mockLocations}
                    onCompare={mockOnCompare}
                    onDelete={mockOnDelete}
                    disableCompare={mockDisableCompare}
                />
            </MemoryRouter>
        );

        const compareButton = screen.getAllByLabelText('Comparar')[0];
        expect(compareButton).not.toBeDisabled();
        expect(compareButton).toHaveClass('bg-yellow-400');
        fireEvent.click(compareButton);
        expect(mockOnCompare).toHaveBeenCalledWith(1, 'Lisbon');
    });

    test('Compare button is disabled when disableCompare returns true', () => {
        mockDisableCompare.mockReturnValue(true);
        render(
            <MemoryRouter>
                <SavedList
                    locations={mockLocations}

                    onCompare={mockOnCompare}
                    onDelete={mockOnDelete}
                    disableCompare={mockDisableCompare}
                />
            </MemoryRouter>
        );

        const compareButton = screen.getAllByLabelText('Comparar')[0];
        expect(compareButton).toBeDisabled();
        expect(compareButton).toHaveClass('opacity-50');
        fireEvent.click(compareButton);
        expect(mockOnCompare).not.toHaveBeenCalled();
    });

    test('Delete button triggers onDelete', () => {
        mockDisableCompare.mockReturnValue(false);
        render(
            <MemoryRouter>
                <SavedList
                    locations={mockLocations}
                    onCompare={mockOnCompare}
                    onDelete={mockOnDelete}
                    disableCompare={mockDisableCompare}
                />
            </MemoryRouter>
        );

        const deleteButton = screen.getAllByLabelText('Eliminar')[0];
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledWith('Lisbon', 1);
    });

    test('buttons have correct aria-labels for accessibility', () => {
        mockDisableCompare.mockReturnValue(false);
        render(
            <MemoryRouter>
                <SavedList
                    locations={mockLocations}
                    onCompare={mockOnCompare}
                    onDelete={mockOnDelete}
                    disableCompare={mockDisableCompare}
                />
            </MemoryRouter>
        );

        expect(screen.getAllByLabelText('Comparar')).toHaveLength(2);
        expect(screen.getAllByLabelText('Eliminar')).toHaveLength(2);
    });

});