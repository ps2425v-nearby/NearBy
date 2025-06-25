import React, {useContext} from "react";
import Navbar from "../NavBar/Navbar";
import {DarkmodeContext} from "@/context/DarkMode/DarkmodeContext";
import {useNotification} from "@/context/Notifications/NotificationsContext";
import {fetchDeleteLocation} from "@/Fetch/Location/fetchDeleteLocation";
import {Loader} from "@/utils/Loader";
import {ComparisonCard} from "@/utils/ComparisonCard";
import {SavedList} from "./SavedList";
import {useSavedLocations} from "../SavedLocations/Hooks/useSavedLocations";
import {useLocationCompare} from "../SavedLocations/Hooks/useLocationCompare";
import {useCookies} from "react-cookie";

export const SavedLocations: React.FC = () => {

    const {darkMode} = useContext(DarkmodeContext)!;
    const {showNotification} = useNotification();

    const {locations, loading, refresh} = useSavedLocations();
    const {comparison, add, remove} = useLocationCompare();
    const [cookies] = useCookies(['token']);

    const handleDelete = async (name: string, id: number) => {
        const del = await fetchDeleteLocation(name, id,cookies.token);
        if (!del) {
            showNotification("Não foi possível eliminar a localização. Verifique se tem um comentário associado.", "error");
            return;
        }else{
            showNotification(`Localização "${name}" eliminada com sucesso!`, "success");
        }
        await refresh();
    };


    const handleCompare = async (id: number, name: string) => {
        const ok = await add(id, name);
        if (!ok) showNotification("Não foi possível comparar.", "error");
    };

    const disableCompare = (loc: any) => comparison.length >= 3 || comparison.some((l) => l.name === loc.name);

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen flex flex-col`}>
            <Navbar/>
            {loading ? (
                <div className="flex-grow flex items-center justify-center"><Loader darkMode={darkMode}
                                                                                    label="Carregando localizações..."/>
                </div>
            ) : (
                <div className="flex-grow flex flex-col lg:flex-row gap-6 p-6">
                    {comparison.length > 0 && (
                        <div className="flex flex-col lg:flex-row gap-4 w-full">
                            {comparison.map((loc) => (
                                <ComparisonCard key={loc.name} loc={loc} darkMode={darkMode} onRemove={remove}/>
                            ))}
                        </div>
                    )}
                    <div
                        className={`flex-1 p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-black"}`}>
                        <h2 className="text-2xl font-extralight mb-4 border-b pb-2">📍 Localizações Guardadas</h2>
                        {locations.length === 0 ? (
                            <div className="flex items-center justify-center h-64">
                                <p className="text-gray-400 text-2xl font-medium">Nenhuma localização guardada...</p>
                            </div>
                        ) : (
                            <SavedList locations={locations} onCompare={handleCompare}
                                       onDelete={handleDelete} disableCompare={disableCompare}/>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
