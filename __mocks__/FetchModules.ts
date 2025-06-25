// __mocks__/fetchModules.ts
export const fetchPlace = jest.fn(() => Promise.resolve(["mock-place"]));
export const fetchWind = jest.fn(() => Promise.resolve({ speed: 10 }));
export const fetchTrafficLevel = jest.fn(() => Promise.resolve("medium"));
export const fetchZoneIdentier = jest.fn(() => Promise.resolve(["Z1"]));
export const fetchParkingSpaces = jest.fn(() => Promise.resolve([{ id: 1 }]));
export const fetchHousingPrices = jest.fn(() => Promise.resolve("250000"));
