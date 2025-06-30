import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParkingDetails } from '@/components/Details/Parking/ParkingDetails';
import { PlaceType } from '@/types/PlaceType';
process.env.BACKEND_URL = 'http://localhost:8080';

describe('ParkingDetails Component', () => {
    const mockParkWithTags: PlaceType = {
        type: "node",
        id: 1,
        lat: 40.7128,
        lon: -74.0060,
        tags: new Map([
            ['name', 'Estacionamento Central'],
            ['capacity', '100'],
            ['covered', 'yes']
        ])
    };


    const mockParkWithoutTags: PlaceType = {
        type: "node",
        id: 2,
        lat: 51.5074,
        lon: -0.1278,
        tags: new Map()  // vazio
    };

    test('renderiza nome do estacionamento corretamente', () => {
        render(<ParkingDetails park={mockParkWithTags} index={0} />);
        expect(screen.getByText(/Estacionamento 1/i)).toBeInTheDocument();
    });

    test('não renderiza coordenadas antes de clicar em "ver detalhes"', () => {
        render(<ParkingDetails park={mockParkWithTags} index={0} />);
        expect(screen.queryByText(/Coordenadas:/i)).not.toBeInTheDocument();
    });

    test('renderiza tags quando showDetails está ativo', () => {
        render(<ParkingDetails park={mockParkWithTags} index={0} />);

        const button = screen.getByRole('button', { name: /ver detalhes/i });
        fireEvent.click(button);

        // Verifica coordenadas
        expect(screen.getByText(/coordenadas:/i)).toBeInTheDocument();

        // Verifica tag 'name'
        expect(screen.getByText(/name/i)).toBeInTheDocument();


    });

    test('mostra "Sem tags disponíveis" quando não há tags', () => {
        render(<ParkingDetails park={mockParkWithoutTags} index={1} />);
        const button = screen.getByRole('button', { name: /ver detalhes/i });
        fireEvent.click(button);
        expect(screen.getByText(/sem tags disponíveis/i)).toBeInTheDocument();
    });

    test('alterna texto do botão entre "ver detalhes" e "esconder detalhes"', () => {
        render(<ParkingDetails park={mockParkWithoutTags} index={0} />);
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(/ver detalhes/i);
        fireEvent.click(button);
        expect(button).toHaveTextContent(/esconder detalhes/i);
        fireEvent.click(button);
        expect(button).toHaveTextContent(/ver detalhes/i);
    });

    test('lida com "tags" sendo um Map (fallback defensivo)', () => {
        const mapPark: PlaceType = {
            ...mockParkWithoutTags,
            tags: new Map([
                ['amenity', 'parking'],
                ['capacity', '50']
            ]) as any
        };

        // converte para objeto dentro do teste para simular lógica do componente
        const convertedTags: Record<string, string> = Object.fromEntries(mapPark.tags as Map<string, string>);
        // @ts-ignore
        render(<ParkingDetails park={{ ...mapPark, tags: convertedTags }} index={2} />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText(/capacity/i)).toBeInTheDocument();

    });
});
