import {Amenity, ProcessedData, MapCenter} from '@/types/FilterTypes';
/**
 * Busca amenities (pontos de interesse) através do backend.
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
        const response = await fetch('/api/map/amenities', {
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
          setError('Erro ao buscar dados do servidor');
            setLoading(false);
            return;
        }

        const dataResponse = await response.json();
        if (!dataResponse.amenities || dataResponse.amenities.length === 0) {
            setError('Nenhum ponto de interesse encontrado para os critérios selecionados.');
            setLoading(false);
            return;
        } else {
            setMapCenter(dataResponse.center);
            setAmenities(dataResponse.amenities);
        }


    } catch (err) {
        setError('Erro ao buscar pontos de interesse. Tente novamente.');
    } finally {
        setLoading(false);
    }
};

