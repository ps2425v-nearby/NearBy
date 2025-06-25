import {SimpleLocation} from "@/types/SimpleLocationType";
import {PlaceType} from "@/types/PlaceType";
import {ParkingSpaceType} from "@/types/parkingSpaceType";
import {fetchReducedInformation} from "@/Fetch/Location/Saved/fetchReducedInformation";
import {fetchSavedLocationById} from "@/Fetch/Location/Saved/fetchSavedLocationById";
import {saveApiLocation} from "@/Fetch/Location/Saved/saveLocation";
import {CrimeType} from "@/types/CrimeType";
import {mockToken} from "../Comments/CommentsFetch.test";

global.fetch = jest.fn();
const mockedFetch = fetch as jest.Mock;

describe("API Functions", () => {
    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe("fetchReducedInformation", () => {
        it("returns data when request succeeds", async () => {
            const mockData: SimpleLocation[] = [{id: 1, name: "Lisboa", lat: 38.7, lon: -9.1, searchRadius: 1000}];
            localStorage.setItem("userID", "123");

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const result = await fetchReducedInformation(mockToken);
            expect(result).toEqual(mockData);
            expect(fetch).toHaveBeenCalledWith("/api/locations/saved?userID=123");
        });

        it("throws error if response not ok", async () => {
            localStorage.setItem("userID", "456");
            mockedFetch.mockResolvedValueOnce({ok: false});

            await expect(fetchReducedInformation(mockToken)).rejects.toThrow("Erro ao salvar localização");
        });
    });

    describe("fetchSavedLocationById", () => {
        it("returns location data on success", async () => {
            const mockData: SimpleLocation[] = [{id: 1, name: "Lisboa", lat: 38.7, lon: -9.1, searchRadius: 1000}];

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const result = await fetchSavedLocationById(1,mockToken);
            expect(result).toEqual(mockData);
            expect(fetch).toHaveBeenCalledWith("/api/locations/1", {
                method: "GET",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
            });
        });

        it("throws error if request fails", async () => {
            mockedFetch.mockResolvedValueOnce({ok: false});

            await expect(fetchSavedLocationById(2,mockToken)).rejects.toThrow("Erro ao salvar localização");
        });
    });

    describe("saveApiLocation", () => {
        const lat = 38.7;
        const lon = -9.1;
        const radius = 1000;
        const name = "Casa Teste";
        const places: PlaceType[] = [];
        const wind = {speed: 10};
        const trafficLevel = "moderate";
        const crimes: CrimeType[] = [];
        const parkingSpaces: ParkingSpaceType[] = [];
        const userID = 42;

        it("saves location and returns data on success", async () => {
            const mockResponse = {success: true};

            mockedFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await saveApiLocation(
                lat,
                lon,
                radius,
                name,
                places,
                wind,
                trafficLevel,
                crimes,
                parkingSpaces,
                userID,
                mockToken
            );

            expect(result).toEqual(mockResponse);
        });

        it("returns early if token is undefined", async () => {
            const result = await saveApiLocation(
                lat,
                lon,
                radius,
                name,
                places,
                wind,
                trafficLevel,
                crimes,
                parkingSpaces,
                userID,
                mockToken
                );

            expect(result).toBeUndefined();
            expect(fetch).not.toHaveBeenCalled();
        });

        it("shows alert and throws error on 409", async () => {
            global.alert = jest.fn();

            mockedFetch.mockResolvedValueOnce({ok: false, status: 409});

            await expect(
                saveApiLocation(
                    lat,
                    lon,
                    radius,
                    name,
                    places,
                    wind,
                    trafficLevel,
                    crimes,
                    parkingSpaces,
                    userID,
                    mockToken)
            ).rejects.toThrow("Erro ao salvar localização");

            expect(global.alert).toHaveBeenCalledWith("A localização ja esta guardada");
        });

        it("throws error on generic save error", async () => {
            mockedFetch.mockResolvedValueOnce({ok: false, status: 500});

            await expect(
                saveApiLocation(
                    lat,
                    lon,
                    radius,
                    name,
                    places,
                    wind,
                    trafficLevel,
                    crimes,
                    parkingSpaces,
                    userID,
                    mockToken
                )
            ).rejects.toThrow("Erro ao salvar localização");
        });
    });
});
