process.env.BACKEND_URL = 'http://localhost:8080';
import { renderHook, act } from "@testing-library/react";
import { CookiesProvider } from "react-cookie";
import { useLocationCompare } from "@/components/SavedLocations/Hooks/useLocationCompare";
import { useSavedLocations } from "@/components/SavedLocations/Hooks/useSavedLocations";
import { fetchSavedLocationById } from "@/Fetch/Location/Saved/fetchSavedLocationById";

import { fetchReducedInformation } from "@/Fetch/Location/Saved/fetchReducedInformation";
jest.mock("@/Fetch/Location/Saved/fetchSavedLocationById");
jest.mock("@/Fetch/Location/Saved/fetchReducedInformation");

const mockLocation = {
    id: 1,
    name: "Lisboa",
    lat: 38.7169,
    lon: -9.1399,
    crimes: [],
    trafficLevel: "Baixo",
    wind: {},
    places: [],
    parkingSpaces: [],
};

const mockList = [
    { id: 1, name: "Lisboa", lat: 38.7, lon: -9.1 },
    { id: 2, name: "Porto", lat: 41.1, lon: -8.6 },
];

// Wrapper component to provide CookiesProvider for tests
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
        {children}
    </CookiesProvider>
);

describe("useLocationCompare", () => {
    beforeEach(() => {
        (fetchSavedLocationById as jest.Mock).mockResolvedValue(mockLocation);
    });

    it("adiciona uma localização à comparação", async () => {
        const { result } = renderHook(() => useLocationCompare(), { wrapper });

        await act(async () => {
            const added = await result.current.add(1, "Lisboa");
            expect(added).toBe(true);
        });

        expect(result.current.comparison).toHaveLength(1);
        expect(result.current.comparison[0].name).toBe("Lisboa");
    });

    it("remove uma localização corretamente", async () => {
        const { result } = renderHook(() => useLocationCompare(), { wrapper });

        await act(async () => {
            await result.current.add(1, "Lisboa");
        });

        act(() => {
            result.current.remove("Lisboa");
        });

        expect(result.current.comparison).toHaveLength(0);
    });
});

describe("useSavedLocations", () => {
    beforeEach(() => {
        (fetchReducedInformation as jest.Mock).mockResolvedValue(mockList);
    });

    it("faz fetch automático ao montar e atualiza estado", async () => {
        const { result } = renderHook(() => useSavedLocations(), { wrapper });

        await act(async () => {
            // Wait for useEffect to complete
        });

        expect(result.current.locations).toEqual(mockList);
        expect(result.current.loading).toBe(false);
    });

    it("permite refrescar localizações manualmente", async () => {
        const { result } = renderHook(() => useSavedLocations(), { wrapper });

        await act(async () => {
            await result.current.refresh();
        });

        expect(result.current.locations.length).toBe(2);
    });
});