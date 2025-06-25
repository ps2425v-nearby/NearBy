import React, {useState, useEffect, useContext} from 'react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import portugalData from '../../../DCF_PT.json';
import distritosMap from '../../../distritos_map.json';
import { processData } from './FilterReducer';
import { fetchAmenities } from '@/Fetch/Filters/fetchFilterSearch';
import { ProcessedData, Amenity, MapCenter } from '@/types/FilterTypes';
import {DarkmodeContext} from '@/context/DarkMode/DarkmodeContext';
import { configureLeafletIcons } from '@/utils/leafletConfig';
import LocationFilters from './LocationFilters';
import PointsOfInterest from './PointsOfInterest';
import SearchStatus from './SearchStatus';
import MapPreview from './MapPreview';
import FilterActions from './FilterActions';
import ProgressIndicator from './ProgressIndicator';
import VisualSummary from './VisualSummary';
import {Navbarin} from "@/components/NavBar";
import {useCookies} from "react-cookie";

configureLeafletIcons();

const FilterSearch: React.FC = () => {
    const darkModeContext = useContext(DarkmodeContext);
    const darkMode = darkModeContext ? darkModeContext.darkMode : false;

    const [district, setDistrict] = useState('');
    const [municipality, setMunicipality] = useState('');
    const [parish, setParish] = useState('');
    const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState<ProcessedData>({districts: [], municipalityMap: new Map(), parishMap: new Map(),});
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<MapCenter | null>(null);
    const [radius, setRadius] = useState(3000);
    const [cookies] = useCookies(['token']);

    useEffect(() => {
        const processed = processData(portugalData, distritosMap.distritos);
        setData(processed);
    }, []);

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

    const selectedDistricts = data.districts.find((d) => d.id === district)?.nome || '';
    const selectedMunicipalities = data.municipalityMap.get(district)?.find((c) => c.id === municipality)?.nome || '';
    const selectedParish = data.parishMap.get(municipality)?.find((f) => f.id === parish)?.nome || '';

    const currentStep = parish ? 4 : municipality ? 3 : district ? 2 : 1;

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
            <Navbarin />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 py-8"
            >
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
                            <ProgressIndicator currentStep={currentStep} darkMode={darkMode} />
                            <VisualSummary
                                distritoSelecionado={selectedDistricts}
                                concelhoSelecionado={selectedMunicipalities}
                                freguesiaSelecionada={selectedParish}
                                pontosSelecionados={selectedPoints}
                                darkMode={darkMode}
                            />

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

                            <PointsOfInterest
                                parish={parish}
                                searchQuery={searchQuery}
                                selectedPoints={selectedPoints}
                                setSearchQuery={setSearchQuery}
                                setSelectedPoints={setSelectedPoints}
                                darkMode={darkMode}
                            />

                            <SearchStatus
                                loading={loading}
                                error={error}
                                amenities={amenities}
                                darkMode={darkMode}
                            />

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