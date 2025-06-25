import * as React from "react";
import Navbar from "../NavBar/Navbar";
import { DarkmodeContext } from "../../context/DarkMode/DarkmodeContext";

export function Authors() {
    const context = React.useContext(DarkmodeContext);
    if (!context) {
        throw new Error("DarkmodeContext must be used within a DarkModeProvider");
    }
    const { darkMode } = context;

    return (
        <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-extralight mb-12 text-center">A Nossa Equipa</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Author Card: Manuel Santos */}
                    <div className={`rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <img
                            src="/images/aboutus/image_manuel.jpeg"
                            alt="Manuel Santos"
                            className="w-64 h-64 object-cover"
                        />
                        <div className="p-6 text-center">
                            <h5 className="text-xl font-semibold">Manuel Santos</h5>
                            <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Developer</p>
                        </div>
                    </div>

                    {/* Author Card: Ricardo Oliveira */}
                    <div className={`rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <img
                            src="/images/aboutus/image-richy.png"
                            alt="Ricardo Oliveira"
                            className="w-64 h-64 object-cover"
                        />
                        <div className="p-6 text-center">
                            <h5 className="text-xl font-semibold">Ricardo Oliveira</h5>
                            <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Developer</p>
                        </div>
                    </div>

                    {/* Author Card: Pedro Silva */}
                    <div className={`rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <img
                            src="/images/aboutus/image-pedro.jpeg"
                            alt="Pedro Silva"
                            className="w-64 h-64 object-cover"
                        />
                        <div className="p-6 text-center">
                            <h5 className="text-xl font-semibold">Pedro Silva</h5>
                            <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Developer</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}