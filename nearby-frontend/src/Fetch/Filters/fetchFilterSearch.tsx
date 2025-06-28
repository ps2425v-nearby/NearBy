import { Amenity, ProcessedData, MapCenter } from '@/types/FilterTypes';
import {requestUrl} from "@/utils/Backend_URL";

/**
 * Fetches amenities (points of interest) via the backend.
 *
 * @param parish - Parish ID
 * @param municipality - Municipality ID
 * @param district - District ID
 * @param selectedPoints - Array of selected points of interest keys
 * @param data - Processed location data maps
 * @param setAmenities - Setter function to update amenities state
 * @param setMapCenter - Setter function to update the map center
 * @param setLoading - Setter function to update loading state
 * @param setError - Setter function to update error messages
 * @param token - Optional authentication token
 */
export const fetchAmenities = async (
    parish: string,
    municipality: string,
    district: string,
    selectedPoints: string[],
    data: ProcessedData,
    setAmenities: (amenities: Amenity[]) => void,
    setMapCenter: (center: MapCenter | null) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    token?: string
) => {
    if (!parish || selectedPoints.length === 0) {
        setAmenities([]);
        setMapCenter(null);
        return;
    }

    const parishName = data.parishMap.get(municipality)?.find((f) => f.id === parish)?.nome || parish;
    const municipalityName = data.municipalityMap.get(district)?.find((c) => c.id === municipality)?.nome || municipality;
    const districtName = data.districts.find((d) => d.id === district)?.nome || district;

    setLoading(true);
    setError(null);

    try {
        const response = await fetch(`${requestUrl}/api/map/amenities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                parish: parishName,
                municipality: municipalityName,
                district: districtName,
                points: selectedPoints,
            }),
        });

        if (!response.ok) {
            setError('Error fetching data from the server');
            setLoading(false);
            return;
        }

        const dataResponse = await response.json();

        if (!dataResponse.amenities || dataResponse.amenities.length === 0) {
            setError('No points of interest found for the selected criteria.');
            setLoading(false);
            return;
        } else {
            setMapCenter(dataResponse.center);
            setAmenities(dataResponse.amenities);
        }

    } catch (err) {
        setError('Error fetching points of interest. Please try again.');
    } finally {
        setLoading(false);
    }
};
