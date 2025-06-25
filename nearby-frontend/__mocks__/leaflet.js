module.exports = {
    map: jest.fn(() => ({
        setView: jest.fn(),
        addLayer: jest.fn(),
    })),
    tileLayer: jest.fn(() => ({
        addTo: jest.fn(),
    })),
    marker: jest.fn(() => ({
        addTo: jest.fn(),
    })),
    icon: jest.fn(() => ({})), // <-- Adicionado aqui!
    control: {
        layers: jest.fn(() => ({
            addTo: jest.fn(),
        })),
    },
    FeatureGroup: jest.fn(() => ({
        addTo: jest.fn(),
        clearLayers: jest.fn(),
    })),
};