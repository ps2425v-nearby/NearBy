// pages/Auth/Register/Register.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../NavBar/Navbar";
import { useNotification } from "@/context/Notifications/NotificationsContext";
import { DarkmodeContext } from "@/context/DarkMode/DarkmodeContext";
import { registerReducer, initialRegisterState } from "./RegisterReducer";
import { useAuth } from "@/AuthContext";
import { InputField } from "./InputField";
import { fetchCreateUser } from "@/Fetch/JoinUs/fetchCreateUser";
import { fetchLogin } from "@/Fetch/JoinUs/fetchLogin";
import {useCookies} from "react-cookie";

export function Register() {
    const [state, dispatch] = React.useReducer(registerReducer, initialRegisterState);
    const { email, name: username, password, isSubmitting } = state;
    const contextAuth = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const context = React.useContext(DarkmodeContext);
    if (!context) throw new Error("DarkmodeContext must be used within a DarkModeProvider");
    const { darkMode } = context;
    const [,setCookie] = useCookies(['token']);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email || !username || !password) {
            showNotification("Please fill out all fields.", "error");
            return;
        }

        dispatch({ type: "SET_SUBMITTING", payload: true });

        try {
            const createRes = await fetchCreateUser({ email, name: username, password });

            if (!createRes.ok) {
                const message =
                    createRes.status === 409
                        ? "Email or Username already exists"
                        : createRes.data?.message || "Registration failed";
                showNotification(message, "error");
                return;
            }

            const loginData = await fetchLogin({ name: username, password });

            const { token, userID } = loginData;
            if (!token){
                showNotification("Login failed. Please try again.", "error");
                return;
            }
            setCookie('token', token, { path: '/', maxAge: 60 * 60 * 24 /* 1 day */, secure: false, sameSite: 'lax' });
            contextAuth.setUsername(username);
            contextAuth.setUserID(userID);
            contextAuth.setLoggedIn(true);

            showNotification("Registration successful! Enjoy our App!", "success", 2000);
            navigate("/")
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            showNotification(message, "error");
        } finally {
            dispatch({ type: "SET_SUBMITTING", payload: false });
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <Navbar />
            <main className="flex-grow flex items-center justify-center">
                <div className={`shadow-lg rounded-lg p-8 w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField
                            label="Email address"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => dispatch({ type: "SET_EMAIL", payload: e.target.value })}
                            autoComplete="email"
                            placeholder="name@example.com"
                            darkMode={darkMode}
                        />
                        <InputField
                            label="Username"
                            type="text"
                            id="name"
                            value={username}
                            onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
                            autoComplete="username"
                            placeholder="Username"
                            darkMode={darkMode}
                        />
                        <InputField
                            label="Password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => dispatch({ type: "SET_PASSWORD", payload: e.target.value })}
                            autoComplete="new-password"
                            placeholder="Password"
                            darkMode={darkMode}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 rounded-md ${
                                darkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"
                            } text-white disabled:opacity-50`}
                        >
                            {isSubmitting ? "Submitting..." : "Register"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
