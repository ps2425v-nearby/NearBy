// __tests__/hooks.test.ts

import { renderHook, act } from "@testing-library/react";
import { useLocationCompare } from "../../../src/components/SavedLocations/Hooks/useLocationCompare";
import { useSavedLocations } from "../../../src/components/SavedLocations/Hooks/useSavedLocations";
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

describe("useLocationCompare", () => {
    beforeEach(() => {
        (fetchSavedLocationById as jest.Mock).mockResolvedValue(mockLocation);
    });

    it("adiciona uma localização à comparação", async () => {
        const { result } = renderHook(() => useLocationCompare());

        await act(async () => {
            const added = await result.current.add(1, "Lisboa");
            expect(added).toBe(true);
        });

        expect(result.current.comparison).toHaveLength(1);
        expect(result.current.comparison[0].name).toBe("Lisboa");
    });


    it("remove uma localização corretamente", async () => {
        const { result } = renderHook(() => useLocationCompare());

        await act(async () => {
            await result.current.add(1, "Lisboa");
        });

        act(() => {
            result.current.remove("Lisboa");
        });

        expect(result.current.comparison).toHaveLength(0);
    });
});

const mockList = [
    { id: 1, name: "Lisboa", lat: 38.7, lon: -9.1 },
    { id: 2, name: "Porto", lat: 41.1, lon: -8.6 },
];

describe("useSavedLocations", () => {
    beforeEach(() => {
        (fetchReducedInformation as jest.Mock).mockResolvedValue(mockList);
    });

    it("faz fetch automático ao montar e atualiza estado", async () => {
        const { result } = renderHook(() => useSavedLocations());

        await act(async () => {
            // espera pela execução do useEffect
        });

        expect(result.current.locations).toEqual(mockList);
        expect(result.current.loading).toBe(false);
    });

    it("permite refrescar localizações manualmente", async () => {
        const { result } = renderHook(() => useSavedLocations());

        await act(async () => {
            await result.current.refresh();
        });

        expect(result.current.locations.length).toBe(2);
    });
});
