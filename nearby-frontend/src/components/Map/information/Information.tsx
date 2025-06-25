import clsx from "clsx";
import { CityInfo } from "../Helpers/CityInfo";
import { Wrapper } from "../Helpers/Wrapper";
import { LeftColumn } from "../LeftSections/LeftColumn";
import { RightColumn } from "../RightColumn";
import { useInformationLogic } from "./useInformationLogic";
import CommentsPopup from "../../Comments/PopUp/CommentsPopUp";
import {InformationProps} from "./InformationProps";


/**
 * Information component displays detailed information about a selected location on the map.
 * It includes options to set a search radius, view nearby places, weather conditions, traffic levels,
 * parking spaces, crime statistics, and housing prices.
 * It also allows users to save locations and add comments.
 * It is designed to be responsive and supports both light and dark modes.
 * It handles loading states and displays appropriate messages when no data is available.
 * It uses a custom hook for managing state and logic related to the information display.

 * @param props
 * @constructor
 */
export function Information(props: InformationProps) {
    const {
        darkMode,
        radius,
        setRadius,
        onRadiusChange,
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

    } = useInformationLogic(props);
    return (
        <Wrapper darkMode={darkMode}>
            <button
                onClick={onCloseClick}
                className={clsx(
                    "absolute right-4 top-4 text-xl",
                    darkMode ? "text-gray-300 hover:text-gray-500" : "text-gray-400 hover:text-gray-700"
                )}
            >
                ×
            </button>

            {isLoading ? (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                    <div
                        className={clsx(
                            "w-12 h-12 border-4 rounded-full animate-spin",
                            darkMode ? "border-t-blue-400 border-gray-600" : "border-t-blue-500 border-gray-300"
                        )}
                    />
                    <p className={clsx("text-lg font-medium", darkMode ? "text-gray-300" : "text-gray-600")}>
                        Carregando informações...
                    </p>
                </div>
            ) : noData ? (
                <div className="flex h-full flex-col items-center justify-center text-center px-6">
                    <p className={clsx("text-lg font-semibold", darkMode ? "text-gray-300" : "text-gray-700")}>
                        Nenhuma informação disponível para esta localização.
                    </p>
                </div>
            ) : (
                <>
                    <h2 id={"info"} className={clsx("mb-6 text-2xl font-semibold", darkMode ? "text-white" : "text-gray-800")}>
                        Informações do Local
                    </h2>

                    <div className="mb-10 flex flex-col md:flex-row md:items-center md:space-x-4">
                        <CityInfo label="Zona selecionada:" value={uniqueCityNames} darkMode={darkMode} />
                        <div className="flex-1">
                            <label className={clsx("mb-1 block text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-600")}>
                                Definir raio de busca (metros):
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={2500}
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                                onKeyPress={handleKeyPress}
                                onBlur={() => onRadiusChange(radius)}
                                className={clsx(
                                    "w-full rounded-md border px-3 py-2 focus:ring-2",
                                    darkMode
                                        ? "border-gray-500 bg-gray-700 text-white focus:ring-blue-300"
                                        : "border-gray-300 bg-white text-black focus:ring-blue-500"
                                )}
                            />
                        </div>
                    </div>

                    <div
                        className="flex flex-row space-x-4">
                        <LeftColumn
                            radius={radius}
                            places={props.places}
                            darkMode={darkMode}
                            onSave={handleSaveLocation}
                            onComment={handleComment}
                            commentsMap={commentsMap}
                        />
                        <RightColumn
                            weather={props.weather}
                            trafficLevel={props.trafficLevel}
                            parkingSpaces={props.parkingSpaces}
                            crimes={props.crimes}
                            housingPrices={props.housingPrices}
                            cityNames={uniqueCityNames}
                            darkMode={darkMode}
                        />
                    </div>

                    {locationId && placeName && <CommentsPopup locationId={locationId} onClose={handleClosePopup} placeName={placeName} />}
                </>
            )}
        </Wrapper>
    );
}
