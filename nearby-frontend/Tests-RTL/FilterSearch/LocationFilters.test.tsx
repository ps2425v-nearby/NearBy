import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationFilters from '../../src/components/FilterSearch/LocationFilters';
import { ProcessedData, Amenity } from '../../src/types/FilterTypes';
import '@testing-library/jest-dom';


const mockSetDistrito = jest.fn();
const mockSetConcelho = jest.fn();
const mockSetFreguesia = jest.fn();
const mockSetAmenities = jest.fn();
const mockSetRadius = jest.fn();

const mockData: ProcessedData = {
    districts: [
        { id: 'd1', nome: 'Lisboa' },
        { id: 'd2', nome: 'Porto' }
    ],
    municipalityMap: new Map([
        ['d1', [
            { id: 'c1', nome: 'Lisboa Centro', distritoId: 'd1' },
            { id: 'c2', nome: 'Lisboa Norte', distritoId: 'd1' }
        ]],
        ['d2', [
            { id: 'c3', nome: 'Porto Centro', distritoId: 'd2' }
        ]]
    ]),
    parishMap: new Map([
        ['c1', [{ id: 'f1', nome: 'Freguesia A', concelhoId: 'c1' }]],
        ['c3', [{ id: 'f2', nome: 'Freguesia B', concelhoId: 'c3' }]]
    ])
};


const renderComponent = (overrides = {}) =>
    render(
        <LocationFilters
            distrito=""
            concelho=""
            freguesia=""
            setDistrito={mockSetDistrito}
            setConcelho={mockSetConcelho}
            setFreguesia={mockSetFreguesia}
            setAmenities={mockSetAmenities}
            setRadius={mockSetRadius}
            data={mockData}
            darkMode={false}
            {...overrides}
        />
    );

describe('LocationFilters', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all labels and select inputs', () => {
        renderComponent();

        expect(screen.getByLabelText(/Selecionar distrito/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Selecionar concelho/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Selecionar freguesia/i)).toBeInTheDocument();
    });

    test('loads district options correctly', () => {
        renderComponent();

        const distritoSelect = screen.getByLabelText(/Selecionar distrito/i);
        expect(distritoSelect).toHaveDisplayValue('-- Escolha um distrito --');

        expect(screen.getByText('Lisboa')).toBeInTheDocument();
        expect(screen.getByText('Porto')).toBeInTheDocument();
    });

    test('changing distrito triggers reset of concelho, freguesia, amenities, and radius', () => {
        renderComponent();

        const distritoSelect = screen.getByLabelText(/Selecionar distrito/i);
        fireEvent.change(distritoSelect, { target: { value: 'd1' } });

        expect(mockSetDistrito).toHaveBeenCalledWith('d1');
        expect(mockSetConcelho).toHaveBeenCalledWith('');
        expect(mockSetFreguesia).toHaveBeenCalledWith('');
        expect(mockSetAmenities).toHaveBeenCalledWith([]);
        expect(mockSetRadius).toHaveBeenCalledWith(2000);
    });

    test('loads concelho options when distrito is selected', () => {
        renderComponent({ distrito: 'd1' });

        const concelhoSelect = screen.getByLabelText(/Selecionar concelho/i);
        expect(concelhoSelect).not.toBeDisabled();
        expect(screen.getByText('Lisboa Centro')).toBeInTheDocument();
        expect(screen.getByText('Lisboa Norte')).toBeInTheDocument();
    });

    test('changing concelho triggers reset of freguesia, amenities, and radius', () => {
        renderComponent({ distrito: 'd1' });

        const concelhoSelect = screen.getByLabelText(/Selecionar concelho/i);
        fireEvent.change(concelhoSelect, { target: { value: 'c1' } });

        expect(mockSetConcelho).toHaveBeenCalledWith('c1');
        expect(mockSetFreguesia).toHaveBeenCalledWith('');
        expect(mockSetAmenities).toHaveBeenCalledWith([]);
        expect(mockSetRadius).toHaveBeenCalledWith(2000);
    });

    test('loads freguesia options when concelho is selected', () => {
        renderComponent({ distrito: 'd1', concelho: 'c1' });

        const freguesiaSelect = screen.getByLabelText(/Selecionar freguesia/i);
        expect(freguesiaSelect).not.toBeDisabled();
        expect(screen.getByText('Freguesia A')).toBeInTheDocument();
    });

    test('changing freguesia calls setFreguesia', () => {
        renderComponent({ concelho: 'c1' });

        const freguesiaSelect = screen.getByLabelText(/Selecionar freguesia/i);
        fireEvent.change(freguesiaSelect, { target: { value: 'f1' } });

        expect(mockSetFreguesia).toHaveBeenCalledWith('f1');
    });

    test('concelho select is disabled if no distrito selected', () => {
        renderComponent({ distrito: '' });

        const concelhoSelect = screen.getByLabelText(/Selecionar concelho/i);
        expect(concelhoSelect).toBeDisabled();
    });

    test('freguesia select is disabled if no concelho selected', () => {
        renderComponent({ concelho: '' });

        const freguesiaSelect = screen.getByLabelText(/Selecionar freguesia/i);
        expect(freguesiaSelect).toBeDisabled();
    });

    test('renders in dark mode correctly', () => {
        renderComponent({ darkMode: true });

        const label = screen.getByText(/Selecione o Distrito/i);
        expect(label).toHaveClass('text-gray-200');
    });
});
