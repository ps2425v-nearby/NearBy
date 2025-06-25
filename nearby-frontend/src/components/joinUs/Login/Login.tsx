import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/AuthContext";
import LoginButton from "../../../components/joinUs/LoginButton/LoginButton";
import { useNotification } from '@/context/Notifications/NotificationsContext';
import { DarkmodeContext } from "@/context/DarkMode/DarkmodeContext";
import { loginReducer, initialState } from './LoginReducer';
import { getInputClasses } from "./inputClasses";
import { fetchLogin } from "@/Fetch/JoinUs/fetchLogin";
import {useCookies} from "react-cookie";

export const Login = () => {
    const [state, dispatch] = useReducer(loginReducer, initialState);
    const [isOpen, setIsOpen] = useState(false);
    const { username, password, submitting } = state;
    const [,setCookie] = useCookies(['token']);

    const { setUsername, setUserID, setLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const { darkMode } = useContext(DarkmodeContext) ?? (() => { throw new Error("DarkmodeContext must be used within a DarkModeProvider") })();

    const closeModal = () => setIsOpen(false);
    const openModal = () => setIsOpen(true);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        dispatch({ type: "SET_SUBMITTING", payload: true });

        try {
            const { token, userID } = await fetchLogin({ name: username, password });

            if (!token) {
                showNotification("Login falhou. Por favor, verifique suas credenciais.", "error");
                return;
            }
            setCookie('token', token, { path: '/', maxAge: 60 * 60 * 24 /* 1 dia */, secure: false, sameSite: 'lax' });
            setUsername(username);
            setUserID(userID);
            setLoggedIn(true);

            closeModal();
            showNotification("Logged in successfully!", "success");
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            showNotification("Username ou Password erradas...","error")
        } finally {
            dispatch({ type: "SET_SUBMITTING", payload: false });
        }
    };
    return (
        <>
            <LoginButton openModal={openModal} />
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        show={true}
                    >
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    </Transition>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                                show={true}
                            >
                                <Dialog.Panel
                                    className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all relative ${
                                        darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-950"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        aria-label="Close modal"
                                        className={`absolute top-4 right-4 group flex items-center gap-2 py-2 px-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 ${
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

                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 mb-4">
                                        Sign In
                                    </Dialog.Title>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            autoComplete="username"
                                            value={username}
                                            onChange={(e) => dispatch({ type: "SET_USERNAME", payload: e.target.value })}
                                            required
                                            className={getInputClasses(darkMode)}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => dispatch({ type: "SET_PASSWORD", payload: e.target.value })}
                                            required
                                            className={getInputClasses(darkMode)}
                                        />
                                        <div className="flex flex-col items-center gap-3">
                                            <button
                                                type="submit"
                                                disabled={!username || !password || submitting}
                                                className={`w-full px-4 py-2 rounded-md disabled:opacity-50 border ${
                                                    darkMode
                                                        ? "bg-gray-700 text-white border-gray-500 hover:bg-gray-600"
                                                        : "bg-white text-blue-950 border-gray-300 hover:bg-gray-100"
                                                }`}
                                            >
                                                {submitting ? "Signing In..." : "Sign In"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate("/register")}
                                                className={`w-full px-4 py-2 rounded-md ${
                                                    darkMode ? "text-white hover:bg-gray-600" : "text-blue-950 hover:bg-gray-200"
                                                }`}
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};


