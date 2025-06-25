import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategorySection } from "../../../src/components/Details/Location/CategorySection";
import '@testing-library/jest-dom';


// Mock PlaceDetails
jest.mock("../../../src/components/Details/Place/PlaceDetails", () => ({
    PlaceDetails: ({ place }: any) => <div>{place.tags.name}</div>,
}));

describe("CategorySection", () => {
    const mockPlaces = [
        {
            id: 1,
            tags: { name: "Hospital Geral", amenity: "hospital" },
        },
    ];

    it("renderiza o título da secção", () => {
        render(<CategorySection title="Saúde" places={mockPlaces} darkMode={false} />);
        expect(screen.getByText("Saúde")).toBeInTheDocument();
    });

    it("mostra detalhes dos lugares ao clicar", () => {
        render(<CategorySection title="Saúde" places={mockPlaces} darkMode={false} />);
        const toggleButton = screen.getByRole("button", { name: /Saúde/i });
        fireEvent.click(toggleButton);
        expect(screen.getByText("Hospital Geral")).toBeInTheDocument();
    });

    it("mostra mensagem de nenhum local quando lista está vazia", () => {
        render(<CategorySection title="Vazio" places={[]} darkMode={false} />);
        fireEvent.click(screen.getByRole("button", { name: /Vazio/i }));
        expect(screen.getByText(/Nenhum local encontrado/i)).toBeInTheDocument();
    });
});
