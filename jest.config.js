module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        // mocks para estilos
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',

        // mocks específicos para leaflet
        'leaflet$': '<rootDir>/__mocks__/leaflet.js',
        'leaflet-draw$': '<rootDir>/__mocks__/leafletDraw.js',
        'leaflet-geosearch$': '<rootDir>/__mocks__/leafletGeoSearch.js',
        'leaflet/dist/leaflet.css$': '<rootDir>/__mocks__/styleMock.js',
        'leaflet-draw/dist/leaflet.draw.css$': '<rootDir>/__mocks__/styleMock.js',
        'leaflet-geosearch/dist/geosearch.css$': '<rootDir>/__mocks__/styleMock.js',
    }

};