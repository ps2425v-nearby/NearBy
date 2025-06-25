import React, { createContext, useState, useEffect, ReactNode } from 'react';

/**
 * Define o formato do contexto que será compartilhado
 */
interface DarkModeContextProps {
    darkMode: boolean;            /** Estado atual do modo escuro (ativo ou não) */
    toggleDarkMode: () => void;   /** Função para alternar o modo escuro */
}

/**
 * Cria o contexto com valor inicial indefinido, para forçar o uso correto
 */
export const DarkmodeContext = createContext<DarkModeContextProps | undefined>(undefined);

interface DarkModeProviderProps {
    children: ReactNode; /** Os componentes filhos que vão acessar o contexto */
}

/**
 * Componente Provider que engloba a aplicação e fornece o contexto do Dark Mode
 */
export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
    /**
     * Estado local que armazena se o modo escuro está ativado ou não
     */
    const [darkMode, setDarkMode] = useState<boolean>(false);

    /**
     * useEffect executa uma vez após o componente montar
     * Recupera o valor salvo no localStorage para manter a preferência do usuário
     */
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode') === 'true'; /** Verifica se o modo escuro foi salvo como 'true' */
        setDarkMode(savedMode); /** Atualiza o estado com o valor salvo */
        if (savedMode) {
            /** Se o modo escuro estava ativo, adiciona a classe 'dark' ao documento para ativar o CSS correspondente */
            document.documentElement.classList.add('dark');
        }
    }, []);

    /**
     * Função que alterna o estado do modo escuro
     */
    const toggleDarkMode = () => {
        setDarkMode(prevMode => {
            const newMode = !prevMode; /** Inverte o valor atual (true -> false, false -> true) */
            localStorage.setItem('darkMode', String(newMode)); /** Salva a nova preferência no localStorage para persistência */

            /** Adiciona ou remove a classe 'dark' do documento conforme o novo estado */
            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            return newMode; /** Atualiza o estado local com o novo valor */
        });
    };

    /**
     * Retorna o Provider com o valor do contexto, disponibilizando darkMode e toggleDarkMode para os filhos
     */
    return (
        <DarkmodeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkmodeContext.Provider>
    );
};
