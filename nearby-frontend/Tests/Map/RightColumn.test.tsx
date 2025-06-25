/*

import { render, screen } from '@testing-library/react';
import { RightColumn } from '../../src/components/Map/RightColumn';
import { ParkingSpaceType } from '../../src/types/parkingSpaceType';
import '@testing-library/jest-dom';

// Mocks dos componentes internos
jest.mock('../../src/components/Map/RightSections/Weather', () => ({
    Weather: ({ wind }: any) => <div>{wind === undefined ? 'Carregando...' : `Wind: ${wind}`}</div>,
}));

jest.mock('../../src/components/Map/RightSections/Traffic', () => ({
    Traffic: ({ trafficLevel }: any) => (
        <div>{trafficLevel === '' ? 'Erro ao buscar informações do tráfego.' : `Tráfego: ${trafficLevel}`}</div>
    ),
}));

jest.mock('../../src/components/Map/RightSections/Parking', () => ({
    Parking: ({ parkingSpaces }: any) => (
        <div>{parkingSpaces.length === 0 ? 'Sem informações de lugares para estacionar disponíveis.' : 'Estacionamentos encontrados'}</div>
    ),
}));

jest.mock('../../src/components/Map/RightSections/Houses', () => ({
    HousingPrices: ({ housingPrices }: any) => (
        <div>
            {housingPrices === 0
                ? 'Sem informações de preços de casas disponíveis.'
                : `Média de Preço: ${housingPrices}`}
        </div>
    ),
}));

jest.mock('../../src/components/Map/RightSections/Crimes', () => ({
    Crimes: () => <div>Crimes info</div>,
}));

jest.mock('../../src/components/Map/RightSections/Section', () => ({
    Section: ({ title, children }: any) => (
        <div>
            <h2>{title}</h2>
            {children}
        </div>
    ),
}));

describe('RightColumn Component', () => {
    const defaultProps = {
        wind: 10,
        trafficLevel: 'Moderado',
        parkingSpaces: [
            { type: 'node', id: 1, lat: 40.7128, lon: -74.006, tags: { parking: 'public' } },
            { type: 'node', id: 2, lat: 40.7129, lon: -74.0061, tags: { parking: 'private' } },
        ] as ParkingSpaceType[],
        crimes: [],
        housingPrices: 3000,
        cityNames: 'Lisboa',
        darkMode: false,
    };

    test('displays loading state for wind when undefined', () => {
        render(<RightColumn {...defaultProps} weather={undefined} />);
        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    test('displays error message for traffic when trafficLevel is empty', () => {
        render(<RightColumn {...defaultProps} trafficLevel="" />);
        expect(screen.getByText('Erro ao buscar informações do tráfego.')).toBeInTheDocument();
    });

    test('displays no parking spaces message when parkingSpaces is empty', () => {
        render(<RightColumn {...defaultProps} parkingSpaces={[]} />);
        expect(screen.getByText('Sem informações de lugares para estacionar disponíveis.')).toBeInTheDocument();
    });

    test('displays no housing prices message when housingPrices is 0', () => {
        render(<RightColumn {...defaultProps} housingPrices={0} />);
        expect(screen.getByText('Sem informações de preços de casas disponíveis.')).toBeInTheDocument();
    });

    test('displays correct city name when cityNames is provided', () => {
        render(<RightColumn {...defaultProps} />);
        expect(screen.getByText(/Preço das casas\(Lisboa\)/)).toBeInTheDocument();
    });

    test('displays Unknown when cityNames is empty', () => {
        render(<RightColumn {...defaultProps} cityNames="" />);
        expect(screen.getByText(/Preço das casas\(Unknown\)/)).toBeInTheDocument();
    });

    test('renders all sections and their titles', () => {
        render(<RightColumn {...defaultProps} />);
        expect(screen.getByText('Meteorology')).toBeInTheDocument();
        expect(screen.getByText('Traffic')).toBeInTheDocument();
        expect(screen.getByText('Crimes')).toBeInTheDocument();
        expect(screen.getByText('Parking Spaces')).toBeInTheDocument();
        expect(screen.getByText(/Preço das casas/)).toBeInTheDocument();
    });

    test('respects darkMode false styles', () => {
        const { container } = render(<RightColumn {...defaultProps} darkMode={false} />);
        expect(container.firstChild).toHaveClass('bg-white');
    });

    test('respects darkMode true styles', () => {
        const { container } = render(<RightColumn {...defaultProps} darkMode={true} />);
        expect(container.firstChild).toHaveClass('bg-gray-800');
    });
});

 */
