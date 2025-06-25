// ContactUsFormModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { DarkmodeContext } from '@/context/DarkMode/DarkmodeContext';
import { ContactFormFields } from './ContactUsFormFields';

interface ContactFormModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

/**
 * ContactUsFormModal component renders a modal dialog containing a contact form.
 *
 * It uses Headless UI's Dialog and Transition components for accessible modal behavior and smooth animations.
 * The modal's visibility is controlled via the `isOpen` prop and can be closed by calling `setIsOpen(false)`.
 *
 * The component consumes the DarkmodeContext to adapt its styles to light or dark themes dynamically.
 *
 * Features include:
 * - Background overlay with blur and opacity effects that respond to dark mode.
 * - Smooth fade and scale transitions when opening and closing.
 * - A close button in the top-right corner styled based on the current theme.
 * - Centered content area with a title linking to the home page.
 * - A prompt inviting users to contact or give feedback.
 * - Embeds the ContactFormFields component, passing down the closeModal function to close the modal on form submission or cancel.
 *
 * Usage:
 * ```tsx
 * const [isModalOpen, setModalOpen] = useState(false);
 * <ContactUsFormModal isOpen={isModalOpen} setIsOpen={setModalOpen} />
 * ```
 *
 * This component must be used within a provider for DarkmodeContext.
 */


export const ContactUsFormModal: React.FC<ContactFormModalProps> = ({ isOpen, setIsOpen }) => {
    const context = useContext(DarkmodeContext);
    if (!context) throw new Error("DarkmodeContext must be used within a DarkModeProvider");
    const { darkMode } = context;

    const closeModal = () => setIsOpen(false);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className={`fixed inset-0 ${darkMode ? "bg-black/50" : "bg-black/30"} backdrop-blur-sm`} />
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
                                className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all relative ${
                                    darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={`absolute top-4 right-4 group flex items-center gap-2 transition-colors py-2 px-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 ${
                                        darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                                    }`}
                                    aria-label="Close"
                                >
                                    <img
                                        src="/images/x-icon.png"
                                        alt="Close"
                                        className={`w-5 h-5 transition-transform duration-200 ${
                                            darkMode ? "filter invert group-hover:scale-110" : "group-hover:scale-110"
                                        }`}
                                    />
                                </button>

                                <div className="py-8 px-4 mx-auto max-w-screen-md">
                                    <div className="flex justify-center mb-6">
                                        <Link to="/" className={`text-2xl sm:text-4xl font-semibold ${darkMode ? "text-white" : "text-black"}`}>
                                            NearBy
                                        </Link>
                                    </div>
                                    <p className={`mb-6 text-center font-light sm:text-xl ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                                        Contactar-nos? Quer avaliar a nossa aplicação?
                                    </p>
                                    <ContactFormFields closeModal={closeModal} />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
