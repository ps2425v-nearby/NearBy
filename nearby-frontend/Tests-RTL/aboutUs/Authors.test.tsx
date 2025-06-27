import { render, screen } from "@testing-library/react";
import React from "react";
import '@testing-library/jest-dom';
import { DarkmodeContext } from "../../src/context/DarkMode/DarkmodeContext";
import {Authors} from "../../src/components/AboutUs/Authors";

// Mock do componente Navbar
jest.mock("../../src/components/NavBar/Navbar", () => () => <div data-testid="navbar">Navbar</div>);

describe("Authors component", () => {
    const renderWithContext = (darkMode: boolean) => {
        return render(
            <DarkmodeContext.Provider value={{ darkMode, toggleDarkMode: jest.fn() }}>
                <Authors />
            </DarkmodeContext.Provider>
        );
    };

    test("renders all authors with light mode", () => {
        renderWithContext(false);

        // Verifica Navbar
        expect(screen.getByTestId("navbar")).toBeInTheDocument();

        // Título principal
        expect(screen.getByRole("heading", { name: /Our Team/i })).toBeInTheDocument();

        // Autores
        expect(screen.getByText("Manuel Santos")).toBeInTheDocument();
        expect(screen.getByText("Ricardo Oliveira")).toBeInTheDocument();
        expect(screen.getByText("Pedro Silva")).toBeInTheDocument();

        // Verifica o conteúdo "Developer"
        const roles = screen.getAllByText("Developer");
        expect(roles).toHaveLength(3);

        // Verifica imagens com alt correto
        expect(screen.getByAltText("Manuel Santos")).toHaveAttribute("src", expect.stringContaining("image_manuel.jpeg"));
        expect(screen.getByAltText("Ricardo Oliveira")).toHaveAttribute("src", expect.stringContaining("image-richy.png"));
        expect(screen.getByAltText("Pedro Silva")).toHaveAttribute("src", expect.stringContaining("image-pedro.jpeg"));
    });

    test("renders all authors with dark mode", () => {
        renderWithContext(true);

        // Verifica se ainda mostra autores corretamente
        expect(screen.getByText("Manuel Santos")).toBeInTheDocument();
        expect(screen.getByText("Ricardo Oliveira")).toBeInTheDocument();
        expect(screen.getByText("Pedro Silva")).toBeInTheDocument();

        // Verifica que a classe bg-gray-900 foi aplicada (modo escuro)
        const root = screen.getByText("Our Team").closest("div");
        expect(root?.className).toMatch(/bg-gray-900/);
    });

    test("throws error when used without DarkmodeContext", () => {
        // Suprime erro no output do teste
        jest.spyOn(console, "error").mockImplementation(() => {});

        expect(() => render(<Authors />)).toThrow("DarkmodeContext must be used within a DarkModeProvider");

        (console.error as jest.Mock).mockRestore();
    });
});
