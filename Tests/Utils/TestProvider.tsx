// test/utils/TestProviders.tsx
import React from "react";
import { MemoryRouter } from "react-router-dom";import { AuthProvider } from "../..//src/AuthContext";
import {DarkmodeContext, DarkModeProvider} from "../..//src/context/DarkMode/DarkmodeContext";
import { NotificationProvider } from "../..//src/context/Notifications/NotificationsContext";
import { CookiesProvider } from "react-cookie";

interface TestProvidersProps {
    children: React.ReactNode;
    darkMode?: boolean;
}

export const TestProviders: React.FC<TestProvidersProps> = ({ children, darkMode = false }) => (
    <CookiesProvider>
        <AuthProvider>
            <NotificationProvider>
                <DarkModeProviderMock value={{ darkMode, toggleDarkMode: jest.fn() }}>
                    <MemoryRouter initialEntries={["/"]}>
                        {children}
                    </MemoryRouter>
                </DarkModeProviderMock>
            </NotificationProvider>
        </AuthProvider>
    </CookiesProvider>
);

// Criar wrapper para simular o contexto
const DarkModeProviderMock = DarkmodeContext.Provider;

