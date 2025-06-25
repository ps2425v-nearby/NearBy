import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Criando o tipo para o contexto
interface DarkModeContextProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const DarkmodeContext = createContext<DarkModeContextProps | undefined>(undefined);

interface DarkModeProviderProps {
    children: ReactNode;
}

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    // Verificar se o dark mode está salvo no localStorage
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedMode);
        if (savedMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Alternar o modo escuro
    const toggleDarkMode = () => {
        setDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', String(newMode)); // Salvar no localStorage
            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newMode;
        });
    };

    return (
        <DarkmodeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkmodeContext.Provider>
    );
};
