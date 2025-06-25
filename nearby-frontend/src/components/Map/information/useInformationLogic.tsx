import {useState, useMemo, useContext, useEffect, KeyboardEvent} from "react";
import {useAuth} from "@/AuthContext";
import {useNotification} from "@/context/Notifications/NotificationsContext";
import {DarkmodeContext} from "@/context/DarkMode/DarkmodeContext";
import {saveApiLocation} from "@/Fetch/Location/Saved/saveLocation";
import {fetchLocationByLatLon} from "@/Fetch/Location/fetchLocationId";
import {InformationProps} from "@/components/Map/information/InformationProps";
import {Comment} from "@/types/CommentType";
import {useCookies} from "react-cookie";

/**
 * Custom hook to manage information logic for map-related data and interactions.
 *
 * Features:
 * - Manages radius state with a maximum cap of 2500 meters.
 * - Fetches and updates comments based on location and radius.
 * - Handles saving of user locations with related data (places, weather, traffic, crimes, parking).
 * - Retrieves location details for commenting.
 * - Provides keyboard interaction support for radius input.
 * - Integrates dark mode context and user authentication state.
 * - Manages loading and no-data states.
 *
 * @param {InformationProps} props - The properties including city IDs, radius, places, parking spaces, weather, crimes, traffic level, and handlers.
 * @returns An object exposing state, handlers, and data necessary for UI components to interact with map information.
 */

export function useInformationLogic({
                                        cityIdentification,
                                        iradius,
                                        places,
                                        parkingSpaces,
                                        weather,
                                        crimes,
                                        trafficLevel,
                                        onCloseClick,
                                        onRadiusChange,
                                        isLoading,
                                        noData
                                    }: InformationProps) {
    const [radius, setRadius] = useState(Math.min(iradius, 2500));
    const {userID} = useAuth();
    const {showNotification} = useNotification();
    const [cookies] = useCookies(['token']);
    const {darkMode} = useContext(DarkmodeContext)!;
    const [locationId, setLocationId] = useState<number | null>(null);
    const [placeName, setPlaceName] = useState<string | null>(null);
    const [commentsMap, setCommentsMap] = useState<Comment[]>([]);
    const lastMarker = localStorage.getItem("lastMarker");


    const fetchComments = async () => {
        try {
            if (!lastMarker) {
                return;
            }
            const {lat, lon} = JSON.parse(lastMarker);
            const response = await fetch(`/api/comments/search?lat=${lat}&lon=${lon}&radius=${radius}`);
            if (!response.ok) {
                showNotification("Falha ao buscar comentários.", "error");
                return;
            }
            const data: Comment[] = await response.json();
            setCommentsMap(data);
        } catch (error) {
            showNotification("A verificar se existe comentários...", "info")
        }
    }
    // Fetch comments when radius or last marker changes
    useEffect(() => {
        const fetchData = async () => {
            await fetchComments();
        };
      void fetchData();
    }, [radius, lastMarker]);

    // Atualiza estado se o iradius mudar externamente
    useEffect(() => {
        const safeRadius = Math.min(iradius, 2500);
        setRadius(safeRadius);
    }, [iradius]);

    const uniqueCityNames = useMemo(
        () => [...new Set(cityIdentification)].join(", "),
        [cityIdentification]
    );

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const newRadius = Math.min(radius, 2500);
            setRadius(newRadius);
            onRadiusChange(newRadius);
        }
    };

    const handleSaveLocation = async () => {
        if (userID == null) {
            return showNotification("Por favor faz login primeiro!", "error");
        }

        if (!places.length) {
            return showNotification("Nenhum local encontrado para guardar.", "error");
        }

        const lastMarker = localStorage.getItem("lastMarker");
        if (!lastMarker) {
            return showNotification("No marker found in localStorage", "error");
        }

        const {lat, lon} = JSON.parse(lastMarker);
        try {
            await saveApiLocation(
                lat,
                lon,
                radius,
                uniqueCityNames,
                places,
                weather,
                trafficLevel,
                crimes,
                parkingSpaces,
                userID,
                cookies.token
            );
            showNotification("Localização guardada com sucesso!", "success");
        } catch {
            showNotification("Erro ao guardar localização. Verifique se já está guardada", "warning");
        }
    };

    const handleComment = async () => {
        const lastMarker = localStorage.getItem("lastMarker");
        if (!lastMarker) {
            return showNotification("No marker found in localStorage", "error");
        }

        const {lat, lon} = JSON.parse(lastMarker);
        try {
            const data = await fetchLocationByLatLon(lat, lon);
            setLocationId(data.id);
            setPlaceName(data.name);
        } catch {
            showNotification("Erro ao buscar localização. Verifique se já está guardada!!", "warning");
        }
    };

    const handleClosePopup = () => {
        setLocationId(null);
        setPlaceName(null);
    }
  return {
        // existing returns
        darkMode,
        radius,
        setRadius: (value: number) => setRadius(Math.min(value, 2500)),
        onRadiusChange: (newRadius: number) => {
            const safeRadius = Math.min(newRadius, 2500);
            if (safeRadius !== radius) {
                setRadius(safeRadius);
                onRadiusChange(safeRadius);
            }
        },
        onCloseClick,
        isLoading,
        uniqueCityNames,
        noData,
        handleKeyPress,
        handleSaveLocation,
        handleComment,
        locationId,
        handleClosePopup,
        commentsMap,
        placeName,
    };
}
