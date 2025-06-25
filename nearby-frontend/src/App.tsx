import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { DarkModeProvider } from "./context/DarkMode/DarkmodeContext";
import './index.css';
import { CookiesProvider } from "react-cookie";
import Notification from './components/Notifications/Notifications';
import { NotificationProvider } from "./context/Notifications/NotificationsContext";
import { router } from "@/router";

/**
 * Main application component.
 *
 * Wraps the app with multiple global providers:
 * - Cookies management
 * - Authentication context
 * - Notification context
 * - Dark mode theme context
 *
 * Also renders the router and global notifications component.
 */
export function App() {
    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <AuthProvider>
                <NotificationProvider>
                    <DarkModeProvider>
                        <RouterProvider router={router} future={{ v7_startTransition: true }} />
                        <Notification />
                    </DarkModeProvider>
                </NotificationProvider>
            </AuthProvider>
        </CookiesProvider>
    );
}

/**
 * Initialization function that finds the root HTML container
 * and mounts the React application into it.
 *
 * Throws an error if the container element with id 'container' is not found.
 */
export function app() {
    const container = document.getElementById('container');
    if (!container) {
        throw new Error("Container element not found");
    }

    const root = createRoot(container);
    root.render(<App />);
}
