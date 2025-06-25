import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import portugalData from '../../../DCF_PT.json';
import distritosMap from '../../../distritos_map.json';
import { processData } from './FilterReducer';
import { fetchAmenities } from '@/Fetch/Filters/fetchFilterSearch';
import { ProcessedData, Amenity, MapCenter } from '@/types/FilterTypes';
import { DarkmodeContext } from '@/context/DarkMode/DarkmodeContext';
import { configureLeafletIcons } from '@/utils/leafletConfig';
import LocationFilters from './LocationFilters';
import PointsOfInterest from './PointsOfInterest';
import SearchStatus from './SearchStatus';
import MapPreview from './MapPreview';
import FilterActions from './FilterActions';
import ProgressIndicator from './ProgressIndicator';
import VisualSummary from './VisualSummary';
import { Navbarin } from "@/components/NavBar";
import { useCookies } from "react-cookie";

configureLeafletIcons();

const FilterSearch: React.FC = () => {
    /**
     * Context to access dark mode state.
     */
    const darkModeContext = useContext(DarkmodeContext);
    const darkMode = darkModeContext ? darkModeContext.darkMode : false;

    /**
     * State variables for location filters.
     */
    const [district, setDistrict] = useState('');
    const [municipality, setMunicipality] = useState('');
    const [parish, setParish] = useState('');

    /**
     * Array of selected points of interest keys.
     */
    const [selectedPoints, setSelectedPoints] = useState<string[]>([]);

    /**
     * Search input state for filtering points of interest.
     */
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Processed location data including districts and maps for municipalities and parishes.
     */
    const [data, setData] = useState<ProcessedData>({
        districts: [],
        municipalityMap: new Map(),
        parishMap: new Map(),
    });

    /**
     * Amenities data fetched based on current filters.
     */
    const [amenities, setAmenities] = useState<Amenity[]>([]);

    /**
     * Loading and error states for async data fetching.
     */
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Map center coordinates and radius for preview.
     */
    const [mapCenter, setMapCenter] = useState<MapCenter | null>(null);
    const [radius, setRadius] = useState(3000);

    /**
     * Cookie state to retrieve token for authenticated requests.
     */
    const [cookies] = useCookies(['token']);

    /**
     * On mount, process static location data for districts, municipalities, and parishes.
     */
    useEffect(() => {
        const processed = processData(portugalData, distritosMap.distritos);
        setData(processed);
    }, []);

    /**
     * Fetch amenities asynchronously whenever parish, selectedPoints, or data changes.
     */
    useEffect(() => {
        const getData = async () => {
            await fetchAmenities(
                parish,
                municipality,
                district,
                selectedPoints,
                data,
                setAmenities,
                setMapCenter,
                setLoading,
                setError,
                cookies.token
            );
        };

        void getData();
    }, [parish, selectedPoints, data]);

    /**
     * Resets all filters and clears data to initial states.
     */
    const resetFilters = () => {
        setDistrict('');
        setMunicipality('');
        setParish('');
        setSelectedPoints([]);
        setSearchQuery('');
        setAmenities([]);
        setMapCenter(null);
        setRadius(2000);
    };

    /**
     * Retrieve display names for selected district, municipality, and parish.
     */
    const selectedDistricts = data.districts.find((d) => d.id === district)?.nome || '';
    const selectedMunicipalities = data.municipalityMap.get(district)?.find((c) => c.id === municipality)?.nome || '';
    const selectedParish = data.parishMap.get(municipality)?.find((f) => f.id === parish)?.nome || '';

    /**
     * Determine the current step of the filter wizard based on selected location level.
     */
    const currentStep = parish ? 4 : municipality ? 3 : district ? 2 : 1;

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
            <Navbarin />
            {/**
             * Main container with fade and slide animation.
             */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 py-8"
            >
                {/**
                 * Card container with conditional dark/light mode styling.
                 */}
                <div className={`rounded-2xl shadow-xl p-8 ${
                    darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                    <h1 className={`text-4xl font-extrabold text-center mb-6 ${
                        darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                        Filtrar Localizações
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            {/**
                             * Progress indicator component showing current step.
                             */}
                            <ProgressIndicator currentStep={currentStep} darkMode={darkMode} />

                            {/**
                             * Visual summary of selected filters.
                             */}
                            <VisualSummary
                                districtSelected={selectedDistricts}
                                councilSelected={selectedMunicipalities}
                                parishSelected={selectedParish}
                                pointsSelected={selectedPoints}
                                darkMode={darkMode}
                            />

                            {/**
                             * Location filter selectors for district, municipality, and parish.
                             */}
                            <LocationFilters
                                distrito={district}
                                concelho={municipality}
                                freguesia={parish}
                                setDistrito={setDistrict}
                                setConcelho={setMunicipality}
                                setFreguesia={setParish}
                                setAmenities={setAmenities}
                                setRadius={setRadius}
                                data={data}
                                darkMode={darkMode}
                            />

                            {/**
                             * Points of Interest filter with search and selection.
                             */}
                            <PointsOfInterest
                                parish={parish}
                                searchQuery={searchQuery}
                                selectedPoints={selectedPoints}
                                setSearchQuery={setSearchQuery}
                                setSelectedPoints={setSelectedPoints}
                                darkMode={darkMode}
                            />

                            {/**
                             * Component to display loading status, errors, and fetched amenities.
                             */}
                            <SearchStatus
                                loading={loading}
                                error={error}
                                amenities={amenities}
                                darkMode={darkMode}
                            />

                            {/**
                             * Action buttons and controls for filter.
                             */}
                            <FilterActions
                                mapCenter={mapCenter}
                                amenities={amenities}
                                resetFilters={resetFilters}
                                data={data}
                                concelho={municipality}
                                freguesia={parish}
                                radius={radius}
                                darkMode={darkMode}
                            />
                        </div>

                        {/**
                         * Map preview showing location and amenities.
                         */}
                        <MapPreview
                            mapCenter={mapCenter}
                            radius={radius}
                            amenities={amenities}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FilterSearch;
