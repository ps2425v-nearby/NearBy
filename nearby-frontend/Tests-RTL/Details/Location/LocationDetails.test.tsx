import { render, screen } from "@testing-library/react";
import { LocationDetails } from "../../../src/components/Details/Location/LocationDetails";
import {SpecificLocationType} from "@/types/SpecificLocationType";
import '@testing-library/jest-dom';


const mockLocation: SpecificLocationType = {
    id: 1,
    name: "Parque Central",
    lat: -23.561,
    lon: -46.655,
    searchRadius: 1500,
    userID: 1,
    places: [], // pode preencher com dados de PlaceType se necessário
    wind: {
        season: "Verão",
        morning: { temperature: 25, windSpeed: 10 },
        afternoon: { temperature: 30, windSpeed: 15 },
        night: { temperature: 20, windSpeed: 5 }

    },
    trafficLevel: "Area muito Movimentada", // ou insira objetos válidos de TrafficType
    crimes: [], // ou insira objetos válidos de InfractionsType
    parkingSpaces: [] // ou insira objetos válidos de ParkingSpaceType
};

jest.mock("../../../src/components/Details/Parking/ParkingSection", () => ({
    ParkingSection: () => <div>Parking Section</div>,
}));

jest.mock("../../../src/components/Details/Crimes/CrimeSection", () => ({
    CrimeSection: () => <div>Crime Section</div>,
}));

describe("LocationDetails (full coverage)", () => {


    it("renderiza a secção de lugares encontrados com categorias traduzidas", () => {
        render(<LocationDetails location={mockLocation} darkMode={false} />);
        expect(screen.getByText("🏙️ Lugares Encontrados")).toBeInTheDocument();
        // Como temos uma escola no mock, deve entrar em "Educação"
        expect(screen.getByText("Educação")).toBeInTheDocument();
        // E um supermercado => "Lojas e Serviços"
        expect(screen.getByText("Lojas e Serviços")).toBeInTheDocument();
    });

    it("renderiza a secção 'Outros' se existirem lugares não classificados", () => {
        const locationWithUnclassified = {
            ...mockLocation,
            places: [
                ...mockLocation.places,
                {
                    id: 999,
                    lat: 0,
                    lon: 0,
                    type: "node",
                    tags: new Map([["randomtag", "value"]]),
                },
            ],
        };
        render(<LocationDetails location={locationWithUnclassified} darkMode={false} />);
        expect(screen.getByText("Outros")).toBeInTheDocument();
    });



    it("renderiza se não houver crimes nem estacionamentos", () => {
        const locationWithoutExtras = { ...mockLocation, crimes: [], parkingSpaces: [] };
        render(<LocationDetails location={locationWithoutExtras} darkMode={false} />);
        expect(screen.getByText("Crime Section")).toBeInTheDocument();
        expect(screen.getByText("Parking Section")).toBeInTheDocument();
    });

    it("renderiza mesmo se não houver lugares", () => {
        const emptyLocation = { ...mockLocation, places: [] };
        render(<LocationDetails location={emptyLocation} darkMode={false} />);
        expect(screen.getByText("🏙️ Lugares Encontrados")).toBeInTheDocument();
    });
});
