import { render, screen, fireEvent } from '@testing-library/react';
import { RightColumn } from '@/components/Map/RightColumn';
import { LeftColumn } from '@/components/Map/LeftSections/LeftColumn';
import { filterPlacesWithName } from '@/utils/LeftColumnUtils';
import '@testing-library/jest-dom';
process.env.BACKEND_URL = 'http://localhost:8080';

// Mock dependencies
jest.mock('../../src/components/Map/RightSections/Section', () => ({
    Section: ({ title, darkMode, children }: any) => (
        <div data-testid={`section-${title}`} className={darkMode ? 'dark' : 'light'}>
            <h2>{title}</h2>
            {children}
        </div>
    ),
}));
jest.mock('../../src/components/Map/RightSections/Weather', () => ({
    Weather: ({ darkMode }: any) => <div data-testid="weather">Weather Component {darkMode ? 'Dark' : 'Light'}</div>,
}));
jest.mock('../../src/components/Map/RightSections/Traffic', () => ({
    Traffic: ({ trafficLevel, darkMode }: any) => (
        <div data-testid="traffic">Traffic: {trafficLevel} {darkMode ? 'Dark' : 'Light'}</div>
    ),
}));
jest.mock('../../src/components/Map/RightSections/Crimes', () => ({
    Crimes: ({ crimes, darkMode }: any) => (
        <div data-testid="crimes">Crimes: {crimes.length} {darkMode ? 'Dark' : 'Light'}</div>
    ),
}));
jest.mock('../../src/components/Map/RightSections/Parking', () => ({
    Parking: ({ parkingSpaces, darkMode }: any) => (
        <div data-testid="parking">Parking Spaces: {parkingSpaces.length} {darkMode ? 'Dark' : 'Light'}</div>
    ),
}));
jest.mock('../../src/components/Map/RightSections/Houses', () => ({
    HousingPrices: ({ housingPrices, darkMode }: any) => (
        <div data-testid="housing">Housing Prices: {housingPrices} {darkMode ? 'Dark' : 'Light'}</div>
    ),
}));
jest.mock('@/utils/LeftColumnUtils', () => ({
    filterPlacesWithName: jest.fn(),
    capitalize: jest.fn((str) => str.charAt(0).toUpperCase() + str.slice(1)),
}));

describe('RightColumn Component', () => {
const defaultProps = {
    weather: { temp: 20, condition: 'Sunny' },
    trafficLevel: 'Low',
    parkingSpaces: [
        { id: 1, location: 'Downtown', type: 'public', lat: 38.7, lon: -9.1, tags: ['covered', 'paid'] },
    ],
    crimes: [{ city: 'Lisboa', type: 'Theft', valor: 10 }],
    housingPrices: 300000,
    cityNames: 'Lisboa',
    darkMode: false,
};
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all sections with correct props', () => {
        render(<RightColumn {...defaultProps} />);

        expect(screen.getByTestId('section-Meteorologia (Desde ultimo Ano)')).toBeInTheDocument();
        expect(screen.getByTestId('weather')).toHaveTextContent('Weather Component Light');
        expect(screen.getByTestId('section-Traffic')).toBeInTheDocument();
        expect(screen.getByTestId('traffic')).toHaveTextContent('Traffic: Low Light');
        expect(screen.getByTestId('section-Crimes')).toBeInTheDocument();
        expect(screen.getByTestId('crimes')).toHaveTextContent('Crimes: 1 Light');
        expect(screen.getByTestId('section-Parking Spaces')).toBeInTheDocument();
        expect(screen.getByTestId('parking')).toHaveTextContent('Parking Spaces: 1 Light');
        expect(screen.getByTestId('section-Preço das casas(Lisboa) in 2023, source: Habitação.Net')).toBeInTheDocument();
        expect(screen.getByTestId('housing')).toHaveTextContent('Housing Prices: 300000 Light');
    });

    test('applies dark mode classes correctly', () => {
        render(<RightColumn {...defaultProps} darkMode={true} />);

        const container = screen.getByTestId('section-Meteorologia (Desde ultimo Ano)').parentElement;
        expect(container).toHaveClass('bg-gray-800 border-gray-700 text-white');
        expect(screen.getByTestId('weather')).toHaveTextContent('Weather Component Dark');
    });

    test('renders Unknown city when cityNames is empty', () => {
        render(<RightColumn {...defaultProps} cityNames="" />);

        expect(screen.getByTestId('section-Preço das casas(Unknown) in 2023, source: Habitação.Net')).toBeInTheDocument();
    });
});

describe('LeftColumn Component', () => {


     const defaultProps = {
        radius: 500,

        places: [
            {
                type: 'node',
                id: 1,
                lat: 38.7,
                lon: -9.1,
                tags: new Map<string, string>([
                    ['name', 'Cafe'],
                    ['amenity', 'cafe'],
                ]),
            },
            {
                type: 'node',
                id: 2,
                lat: 38.8,
                lon: -9.2,
                tags: new Map<string, string>([
                    ['amenity', 'park'],
                ]),
            },
            {
                type: 'node',
                id: 3,
                lat: 38.71,
                lon: -9.12,
                tags: new Map<string, string>([
                    ['name', 'Library'],
                    ['amenity', 'library'],
                ]),
            },
        ],

        darkMode: false,

        onSave: jest.fn(),

        // Se quiser tipar certinho, pode usar:
        // onComment: jest.fn<ReturnType<void>, [number, number]>(),
        onComment: jest.fn(),

        commentsMap: [
            {
                id: 1,
                userId: 101,
                placeId: 1,
                content: 'Great place!',
                createdAt: '2023-10-01T10:00:00Z',
                updatedAt: '2023-10-01T10:00:00Z',
                placeName: 'Cafe',
            },
            {
                id: 2,
                userId: 102,
                placeId: 2,
                content: 'Nice view!',
                createdAt: '2023-10-02T12:00:00Z',
                updatedAt: '2023-10-02T12:00:00Z',
                placeName: 'Park',
            },
            {
                id: 3,
                userId: 103,
                placeId: 3,
                content: 'Quiet',
                createdAt: '2023-10-03T14:00:00Z',
                updatedAt: '2023-10-03T14:00:00Z',
                placeName: 'Library',
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (filterPlacesWithName as jest.Mock).mockReturnValue(defaultProps.places);
    });




    test('filters places using filterPlacesWithName', () => {
        const filteredPlaces = [{ lat: 38.7, lon: -9.1, tags: { name: 'Cafe', amenity: 'cafe' } }];
        (filterPlacesWithName as jest.Mock).mockReturnValue(filteredPlaces);

        render(<LeftColumn {...defaultProps} />);

        expect(filterPlacesWithName).toHaveBeenCalledWith(defaultProps.places);
        expect(screen.queryByText('Park')).toBeInTheDocument();
    });

    test('handles pagination correctly', () => {
        render(<LeftColumn {...defaultProps} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('de')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Great place!')).toBeInTheDocument();
        expect(screen.getByText('Nice view!')).toBeInTheDocument();
        expect(screen.queryByText('Quiet')).not.toBeInTheDocument();

        fireEvent.click(screen.getByAltText('Next'));

        expect(screen.getByText('Quiet')).toBeInTheDocument();
        expect(screen.queryByText('Great place!')).not.toBeInTheDocument();
        expect(screen.queryByText('Nice view!')).not.toBeInTheDocument();

    });


    test('calls onSave when save button is clicked', () => {
        render(<LeftColumn {...defaultProps} />);

        fireEvent.click(screen.getByText('Guardar Localização'));
        expect(defaultProps.onSave).toHaveBeenCalled();
    });

    test('calls onComment with last marker coordinates when comment button is clicked', () => {
        const mockMarker = { lat: 38.7, lon: -9.1 };
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockMarker));

        render(<LeftColumn {...defaultProps} />);

        fireEvent.click(screen.getByText('Adicionar Comentário'));
        expect(defaultProps.onComment).toHaveBeenCalledWith(38.7, -9.1);
    });

    test('does not render comments section when commentsMap is empty', () => {
        render(<LeftColumn {...defaultProps} commentsMap={[]} />);

        expect(screen.queryByTestId(`section-Comentários (0)`)).not.toBeInTheDocument();
    });
});