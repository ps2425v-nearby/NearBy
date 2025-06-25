import clsx from "clsx";
import { PlaceType } from "@/types/PlaceType";
import React, { useState } from "react";
import { Comment } from "@/types/CommentType";
import { Section } from "./Section";
import { capitalize, filterPlacesWithName } from "@/utils/LeftColumnUtils";

type LeftColumnProps = {
    radius: number;
    places: PlaceType[];
    darkMode: boolean;
    onSave: () => void;
    onComment: (lat: number, lon: number) => void;
    commentsMap: Comment[];
};

export const LeftColumn: React.FC<LeftColumnProps> = ({
                                                          radius,
                                                          places,
                                                          darkMode,
                                                          onSave,
                                                          onComment,
                                                          commentsMap,
                                                      }) => {
    // Estado
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 2;
    const totalPages = Math.ceil(commentsMap.length / commentsPerPage);

    // Lógica de Paginação
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const paginatedComments = commentsMap.slice(
        (currentPage - 1) * commentsPerPage,
        currentPage * commentsPerPage
    );

    // Lógica de Filtragem
    const filteredPlaces = filterPlacesWithName(places);

    // Estilos Reutilizáveis
    const containerClasses = clsx(
        "w-1/2 pr-2 space-y-5 p-4 rounded-xl shadow-lg border",
        darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
    );

    const placeCardClasses = (isDark: boolean) =>
        clsx(
            "group relative overflow-hidden rounded-xl p-5 min-h-[90px] transition-all duration-300 transform hover:scale-100 cursor-pointer",
            isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/10"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-400/50 shadow-md hover:shadow-blue-400/10"
        );

    const placeIconClasses = (isDark: boolean) =>
        clsx(
            "absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
            isDark ? "bg-blue-900/50 group-hover:bg-blue-800/70" : "bg-blue-100 group-hover:bg-blue-200"
        );

    const placeIconSvgClasses = (isDark: boolean) =>
        clsx("w-4 h-4 transition-colors duration-300", isDark ? "text-blue-400" : "text-blue-600");

    const commentCardClasses = (isDark: boolean) =>
        clsx(
            "group relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.01] cursor-pointer",
            isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500/50 shadow-lg hover:shadow-green-500/10"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-green-400/50 shadow-md hover:shadow-green-400/10"
        );

    const commentIconClasses = (isDark: boolean) =>
        clsx(
            "absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
            isDark ? "bg-green-900/50 group-hover:bg-green-800/70" : "bg-green-100 group-hover:bg-green-200"
        );

    const commentIconSvgClasses = (isDark: boolean) =>
        clsx("w-4 h-4 transition-colors duration-300", isDark ? "text-green-400" : "text-green-600");

    const tagClasses = (isDark: boolean) =>
        clsx(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
            isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
        );

    const placeHoverOverlayClasses = "absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-600/5 transition-all duration-300 rounded-xl pointer-events-none";

    const commentHoverOverlayClasses = "absolute inset-0 bg-gradient-to-r from-green-500/0 via-emerald-500/0 to-green-600/0 group-hover:from-green-500/5 group-hover:via-emerald-500/5 group-hover:to-green-600/5 transition-all duration-300 rounded-xl pointer-events-none";

    const paginationButtonClasses = (isDark: boolean, isDisabled: boolean) =>
        clsx(
            "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105",
            isDisabled
                ? isDark
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isDark
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        );

    const paginationInfoClasses = (isDark: boolean) =>
        clsx("flex items-center space-x-2 px-4 py-2 rounded-lg text-sm", isDark ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-600");

    const actionButtonClasses = (isDark: boolean, isSave: boolean) =>
        clsx(
            "w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg",
            isSave
                ? isDark
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-blue-400/25"
                : isDark
                    ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 hover:shadow-gray-500/25"
                    : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 hover:shadow-gray-400/25"
        );

    return (
        <div
        id={"left-column"}
            className={containerClasses}>
            {/* Places Section */}
            <Section title={`Locais relevantes no raio de ${radius} m`} darkMode={darkMode}>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredPlaces.map((place, idx) => {
                        const tags = place.tags instanceof Map ? Object.fromEntries(place.tags) : place.tags;
                        const name = tags["name"] || capitalize(tags["amenity"] || tags["shop"] || tags["tourism"] || "Local desconhecido");

                        return (
                            <div key={idx} className={placeCardClasses(darkMode)}>
                                {/* Location Icon */}
                                <div className={placeIconClasses(darkMode)}>
                                    <svg className={placeIconSvgClasses(darkMode)} fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>

                                {/* Content */}
                                <div className="pr-10">
                                    <h5 className={clsx("font-semibold text-sm mb-2 leading-tight", darkMode ? "text-white" : "text-gray-900")}>
                                        {name}
                                    </h5>
                                    <div className={clsx("flex items-center space-x-4 text-xs mb-3", darkMode ? "text-gray-400" : "text-gray-600")}>
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>{place.lat.toFixed(6)}, {place.lon.toFixed(6)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {(Object.entries(tags) as [string, string][])
                                            .slice(0, 3)
                                            .map(([k, v]) => (
                                                <span key={k.toLowerCase()} className={tagClasses(darkMode)}>
                                                    {capitalize(k)}: {v}
                                                </span>
                                            ))}
                                    </div>
                                </div>

                                {/* Hover gradient overlay */}
                                <div className={placeHoverOverlayClasses} />
                            </div>
                        );
                    })}
                </div>
            </Section>

            {/* Comments Section */}
            {commentsMap.length > 0 && (
                <Section title={`Comentários (${commentsMap.length})`} darkMode={darkMode}>
                    <div className="space-y-3">
                        {paginatedComments.map((comment) => (
                            <div key={comment.id} className={commentCardClasses(darkMode)}>
                                {/* Comment Icon */}
                                <div className={commentIconClasses(darkMode)}>
                                    <svg className={commentIconSvgClasses(darkMode)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                        />
                                    </svg>
                                </div>

                                {/* Content */}
                                <div className="pr-10">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span
                                            className={clsx(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                darkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-800"
                                            )}
                                        >
                                            {comment.placeName}
                                        </span>
                                    </div>
                                    <p className={clsx("text-sm mb-2", darkMode ? "text-gray-300" : "text-gray-700")}>
                                        {comment.content}
                                    </p>
                                    <div className={clsx("text-xs", darkMode ? "text-gray-400" : "text-gray-500")}>
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                {/* Hover gradient overlay */}
                                <div className={commentHoverOverlayClasses} />
                            </div>
                        ))}
                    </div>

                    {/* Modern Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={paginationButtonClasses(darkMode, currentPage === 1)}
                            >
                                <img src="/images/left-arrow.png" alt="Previous" className="w-4 h-4" />
                            </button>
                            <div className={paginationInfoClasses(darkMode)}>
                                <span className="font-medium">{currentPage}</span>
                                <span>de</span>
                                <span className="font-medium">{totalPages}</span>
                            </div>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className={paginationButtonClasses(darkMode, currentPage === totalPages)}
                            >
                                <img src="/images/right-arrow.png" alt="Next" className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </Section>
            )}

            {/* Action Buttons */}
            <div

                className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    id={"save-location-button"}
                    onClick={onSave} className={actionButtonClasses(darkMode, true)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Guardar Localização</span>
                </button>
                <button
                    id={"addcomment"}
                    onClick={() => {
                        const lastMarker = localStorage.getItem("lastMarker");
                        if (lastMarker) {
                            const { lat, lon } = JSON.parse(lastMarker);
                            onComment(lat, lon);
                        }
                    }}
                    className={actionButtonClasses(darkMode, false)}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    <span>Adicionar Comentário</span>
                </button>
            </div>
        </div>
    );
};