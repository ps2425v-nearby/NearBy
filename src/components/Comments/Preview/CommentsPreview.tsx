import React, { useContext } from "react";
import { Navbarin } from "../../NavBar";
import { DarkmodeContext } from "@/context/DarkMode/DarkmodeContext";
import { useCommentsPreview } from "./useCommentsPreview";

export const CommentsPreview: React.FC = () => {
    const { darkMode } = useContext(DarkmodeContext)!;
    const {
        comments,
        loading,
        editingId,
        editedContent,
        setEditedContent,
        handleDeleteComment,
        handleEditComment,
        handleCancelEdit,
        handleSaveComment,
    } = useCommentsPreview();

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
            <Navbarin />
            <div className="max-w-4xl mx-auto px-4 py-8 pt-16 sm:pt-20">
                <h1 className="text-3xl font-extralight mb-10">Os teus Comentários</h1>

                {loading ? (
                    <p className="text-center text-gray-400">Loading...</p>
                ) : comments.length === 0 ? (
                    <p className={`text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Nenhum comentário escrito ainda...
                    </p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className={`relative p-4 rounded-2xl shadow-md transition-all 
                                    ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
                            >
                                {comment.placeName && (
                                    <p className="text-sm font-medium text-indigo-400 mb-1">
                                        📍 {comment.placeName}
                                    </p>
                                )}

                                {editingId === comment.id ? (
                                    <>
                                        <textarea
                                            className={`w-full p-2 rounded border mt-1 mb-2 resize-none ${
                                                darkMode
                                                    ? "bg-gray-700 text-white border-gray-500 placeholder-gray-400"
                                                    : "bg-white text-blue-950 border-gray-300 placeholder-gray-400"
                                            }`}
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleSaveComment(comment.id)}
                                                className={`px-3 py-1 rounded border text-sm ${
                                                    darkMode
                                                        ? "bg-green-700 text-white border-gray-500 hover:bg-green-600"
                                                        : "bg-green-100 text-green-900 border-green-300 hover:bg-green-200"
                                                }`}
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className={`px-3 py-1 rounded border text-sm ${
                                                    darkMode
                                                        ? "text-white hover:bg-gray-600"
                                                        : "text-blue-950 hover:bg-gray-200"
                                                }`}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-base">{comment.content}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </p>
                                        <div className="flex flex-col items-end absolute right-2 top-1/2 -translate-y-1/2 gap-2">
                                            <button
                                                aria-label="Edit comment"
                                                onClick={() => handleEditComment(comment.id, comment.content)}
                                                className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-150 scale-95 hover:scale-105 p-1 rounded-full bg-transparent"
                                            >
                                                <img src="/images/edit-icon.png" alt="Edit" className="w-6 h-6" />
                                            </button>
                                            <button
                                                aria-label="Delete comment"
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-150 scale-95 hover:scale-105 p-1 rounded-full bg-transparent"
                                            >
                                                <img src="/images/garbage-icon.png" alt="Delete" className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};