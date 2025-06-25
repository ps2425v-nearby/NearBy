require('@testing-library/jest-dom');

// Mock do L.icon para evitar o erro no Jest
global.L = {
    icon: jest.fn(() => ({
        options: {}
    })),
    marker: jest.fn(() => ({
        bindPopup: jest.fn(),
        on: jest.fn()
    })),
    map: jest.fn(),
    tileLayer: jest.fn(),
    circle: jest.fn(),
    latLng: jest.fn()
};