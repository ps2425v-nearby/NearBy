import React from "react";
import { render, screen } from "@testing-library/react";
import { Wrapper } from "../../..//src/components/Map/Helpers/Wrapper";
import '@testing-library/jest-dom';
process.env.BACKEND_URL = 'http://localhost:8080';

describe("<Wrapper />", () => {
    it("renderiza os filhos corretamente", () => {
        render(
            <Wrapper darkMode={false}>
                <p>Conteúdo interno</p>
            </Wrapper>
        );
        expect(screen.getByText("Conteúdo interno")).toBeInTheDocument();
    });

    it("aplica classes corretas no modo claro", () => {
        const { container } = render(
            <Wrapper darkMode={false}>
                <div>teste</div>
            </Wrapper>
        );
        const wrapper = container.firstChild as HTMLElement;

        expect(wrapper).toHaveClass("bg-white");
        expect(wrapper).toHaveClass("text-black");
        expect(wrapper).toHaveClass("border-black");
    });

    it("aplica classes corretas no modo escuro", () => {
        const { container } = render(
            <Wrapper darkMode={true}>
                <div>teste</div>
            </Wrapper>
        );
        const wrapper = container.firstChild as HTMLElement;

        expect(wrapper).toHaveClass("bg-gray-800");
        expect(wrapper).toHaveClass("text-white");
        expect(wrapper).toHaveClass("border-white");
    });
});
