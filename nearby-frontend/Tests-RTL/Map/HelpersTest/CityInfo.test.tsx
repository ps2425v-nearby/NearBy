import React from "react";
import { render, screen } from "@testing-library/react";
import { CityInfo } from "../../..//src/components/Map/Helpers/CityInfo";
import '@testing-library/jest-dom';


describe("<CityInfo />", () => {
    const baseProps = {
        label: "Cidade",
        value: "Lisboa",
    };

    it("mostra o label e o valor corretamente", () => {
        render(<CityInfo {...baseProps} darkMode={false} />);
        expect(screen.getByText("Cidade")).toBeInTheDocument();
        expect(screen.getByText("Lisboa")).toBeInTheDocument();
    });

    it("aplica classes certas no modo claro", () => {
        render(<CityInfo {...baseProps} darkMode={false} />);
        const labelEl = screen.getByText("Cidade");
        const valueEl = screen.getByText("Lisboa");

        expect(labelEl).toHaveClass("text-gray-600");
        expect(valueEl).toHaveClass("text-gray-800");
    });

    it("aplica classes certas no modo escuro", () => {
        render(<CityInfo {...baseProps} darkMode={true} />);
        const labelEl = screen.getByText("Cidade");
        const valueEl = screen.getByText("Lisboa");

        expect(labelEl).toHaveClass("text-gray-300");
        expect(valueEl).toHaveClass("text-white");
    });
});
