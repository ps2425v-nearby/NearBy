// Contactusform.tsx
import { useState } from 'react';
import { ContactUsFormModal } from './ContactUsFormModal';
import { DarkmodeContext } from '@/context/DarkMode/DarkmodeContext';
import { useContext } from 'react';

const Contactusform = () => {
    const [isOpen, setIsOpen] = useState(false);
    const context = useContext(DarkmodeContext);
    if (!context) throw new Error("DarkmodeContext must be used within a DarkModeProvider");

    const { darkMode } = context;

    return (
        <>
            <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto md:ml-6 sm:pr-0">
                <div className="hidden lg:block">
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className={`group flex items-center gap-2 transition-colors py-2 px-4 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 ${
                            darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                        }`}
                    >
                        <img
                            src="/images/contact-icon.png"
                            alt="Ajuda"
                            className={`w-6 h-6 transition-transform duration-200 ${
                                darkMode ? "filter invert group-hover:scale-110" : "group-hover:scale-110"
                            }`}
                        />
                        <span className="text-lg font-extralight">Ajuda</span>
                    </button>
                </div>
            </div>

            <ContactUsFormModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default Contactusform;
