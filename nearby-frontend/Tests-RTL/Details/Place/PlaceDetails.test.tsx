import { render, screen, fireEvent } from '@testing-library/react';
import { PlaceDetails } from '@/components/Details/Place/PlaceDetails';
import '@testing-library/jest-dom';

describe('PlaceDetails', () => {
    const basePlace = {
        lat: -23.55,
        lon: -46.63,
        tags: {
            name: 'Praça Central',
            phone: '+55 11 99999-9999',
            website: 'https://example.com',
            opening_hours: '24/7',
            description: 'Um local público',
        }
    };

    it('renderiza título com o nome', () => {
        render(<PlaceDetails place={basePlace} />);
        expect(screen.getByText(/Praça Central/i)).toBeInTheDocument();
    });

    it('mostra botão "Ver mais detalhes"', () => {
        render(<PlaceDetails place={basePlace} />);
        expect(screen.getByRole('button', { name: /ver mais detalhes/i })).toBeInTheDocument();
    });

    it('mostra os detalhes ao clicar', () => {
        render(<PlaceDetails place={basePlace} />);
        const button = screen.getByRole('button', { name: /ver mais detalhes/i });
        fireEvent.click(button);

        expect(screen.getByText(/phone:/i)).toBeInTheDocument();
        expect(screen.getByText('+55 11 99999-9999')).toBeInTheDocument();
        expect(screen.getByText(/website:/i)).toBeInTheDocument();
        expect(screen.getByText(/https:\/\/example\.com/)).toBeInTheDocument();
        expect(screen.getByText(/coordenadas:/i)).toBeInTheDocument();
        expect(screen.getByText(/-23\.55.*-46\.63/)).toBeInTheDocument();
    });

    it('não mostra name e alt_name nos detalhes', () => {
        render(<PlaceDetails place={{ ...basePlace, tags: { ...basePlace.tags, alt_name: 'Praça Secundária' } }} />);
        fireEvent.click(screen.getByRole('button', { name: /ver mais detalhes/i }));

        // Eles não devem aparecer como campos detalhados
        expect(screen.queryByText(/alt_name:/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/name:/i)).not.toBeInTheDocument();
    });

    it('alterna para "Ver menos detalhes"', () => {
        render(<PlaceDetails place={basePlace} />);
        const button = screen.getByRole('button', { name: /ver mais detalhes/i });
        fireEvent.click(button);
        expect(button.textContent).toMatch(/ver menos detalhes/i);
    });

    it('renderiza fallback se tags estiverem ausentes', () => {
        render(<PlaceDetails place={{ lat: 0, lon: 0 }} />);
        expect(screen.getByText(/sem tags disponíveis/i)).toBeInTheDocument();
    });

    it('renderiza fallback se tags for null', () => {
        render(<PlaceDetails place={{ lat: 0, lon: 0, tags: null as any }} />);
        expect(screen.getByText(/sem tags disponíveis/i)).toBeInTheDocument();
    });

    it('suporta tags em formato Map', () => {
        const tags = new Map<string, string>([
            ['name', 'Mapa Teste'],
            ['operator', 'Prefeitura'],
        ]);
        // @ts-ignore
        render(<PlaceDetails place={{ lat: 1, lon: 2, tags }} />);
        expect(screen.getByText(/Mapa Teste/)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /ver mais detalhes/i }));
        expect(screen.getByText(/operator:/i)).toBeInTheDocument();
        expect(screen.getByText(/Prefeitura/)).toBeInTheDocument();
    });
});
