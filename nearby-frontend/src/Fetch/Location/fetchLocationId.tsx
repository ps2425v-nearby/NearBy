export async function fetchLocationByLatLon(lat: number, lon: number) {
    const response = await fetch(`/api/locations?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error("Failed to fetch location");
    const data = await response.json();
    if (!data.id) throw new Error("Location not found");
    return data;
}