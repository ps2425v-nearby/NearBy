import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useContext } from 'react';
import { DarkmodeContext } from '@/context/DarkMode/DarkmodeContext';
import { useCommentsPopup } from './useCommentsPopUp';

interface CommentsPopupProps {
    locationId: number | null;
    onClose: () => void;
    placeName: string | null;
}

const CommentsPopup: React.FC<CommentsPopupProps> = ({ locationId, onClose, placeName }) => {
    const { darkMode } = useContext(DarkmodeContext)!;
    const {
        message,
        setMessage,
        submitted,
        handleSubmit,
        isFormDisabled,
        buttonText,
    } = useCommentsPopup({ locationId, placeName, onClose });

    if (!locationId) return null;


    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog
                as="div" className="relative z-50" onClose={onClose}>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                id={"comments-popup"}
                                className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all relative ${
                                    darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-950"
                                }`}
                            >
                                {/* Close Icon */}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={`absolute top-4 right-4 group flex items-center gap-2 transition-colors py-2 px-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 ${
                                        darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                                    }`}
                                >
                                    <img
                                        src="/images/x-icon.png"
                                        alt="Close"
                                        className={`w-5 h-5 transition-transform duration-200 ${
                                            darkMode ? "filter invert group-hover:scale-110" : "group-hover:scale-110"
                                        }`}
                                    />
                                </button>

                                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                                    Adicionar Comentário
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Escreva aqui o seu comentário..."
                                        required
                                        disabled={submitted}
                                        className={`w-full p-2 rounded-md border resize-none min-h-[100px] ${
                                            darkMode
                                                ? "bg-gray-700 text-white border-gray-500 placeholder-gray-400"
                                                : "bg-white text-blue-950 border-gray-300 placeholder-gray-400"
                                        } ${submitted ? "opacity-50 cursor-not-allowed" : ""}`}
                                    />
                                    <button
                                        id={"comments-popup-submit-button"}
                                        type="submit"
                                        disabled={isFormDisabled}
                                        className={`w-full px-4 py-2 rounded-md disabled:opacity-50 border ${
                                            darkMode
                                                ? "bg-gray-700 text-white border-gray-500 hover:bg-gray-600"
                                                : "bg-white text-blue-950 border-gray-300 hover:bg-gray-100"
                                        }`}
                                    >
                                        {buttonText}
                                    </button>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CommentsPopup;