import { render, screen, fireEvent } from '@testing-library/react';
import { ParkingSection } from '../../../src/components/Details/Parking/ParkingSection';
import '@testing-library/jest-dom';


const mockPlaces = [
    {
        id: 1,
        tags: {
            amenity: 'parking',
            name: 'Estacionamento 1',
            capacity: 100
        }
    },
    {
        id: 2,
        tags: {
            amenity: 'restaurant',
            name: 'Restaurante'
        }
    },
    {
        id: 3,
        tags: {
            amenity: 'parking_entrance',
            name: 'Entrada Estacionamento'
        }
    }
];

describe('ParkingSection', () => {
    it('exibe botão de seção de estacionamento', () => {
        render(<ParkingSection places={mockPlaces} />);
        expect(screen.getByRole('button', { name: /estacionamentos/i })).toBeInTheDocument();
    });



    it('mostra mensagem quando não há estacionamentos', () => {
        const noParking = [
            { tags: { amenity: 'restaurant', name: 'Restaurante' } },
            { tags: { amenity: 'cafe', name: 'Café' } }
        ];

        render(<ParkingSection places={noParking} />);

        const toggleButton = screen.getByRole('button', { name: /estacionamentos/i });
        fireEvent.click(toggleButton);

        expect(screen.getByText(/nenhum estacionamento encontrado/i)).toBeInTheDocument();
    });

    it('não renderiza estacionamentos se não estiver expandido', () => {
        render(<ParkingSection places={mockPlaces} />);
        expect(screen.queryByText(/Estacionamento 1/)).not.toBeInTheDocument();
    });
});
