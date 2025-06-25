import React, {useContext} from 'react';
import {Disclosure} from '@headlessui/react';
import {Link} from 'react-router-dom';
import {Bars3Icon, MoonIcon, SunIcon} from '@heroicons/react/24/outline';
import {Drawer} from "./Drawer";
import Contactusform from './contactUs/Contactus';
import {Login} from '@/components/joinUs/Login/Login';
import {DarkmodeContext} from '@/context/DarkMode/DarkmodeContext';
import {useNotification} from "@/context/Notifications/NotificationsContext";
import {useAuth} from "@/AuthContext";


interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}


const navigation: NavigationItem[] = [
    {name: 'Equipa', href: '/aboutus', current: false},
    {name: 'As minhas Localizações', href: '/savedLocations', current: false},
    {name: 'Comentários', href: '/comments', current: false},
    {name: 'Procura por Filtros', href: '/filtersearch', current: false},
    {name: 'GitHub', href: 'https://github.com/orgs/ps2425v-nearby/repositories', current: false},
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
    const {showNotification} = useNotification();
    const [isOpen, setIsOpen] = React.useState(false);

    const context = useContext(DarkmodeContext);
    if (!context) {
        throw new Error("DarkmodeContext must be used within a DarkModeProvider");
    }
    const {loggedIn} = useAuth();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!loggedIn) {
            e.preventDefault(); // Impede a navegação
            showNotification("Por favor, faça login para acessar esta página.", "error");
        }
    };

    const {darkMode, toggleDarkMode} = context;

    return (
        <>
            <Disclosure as="nav"
                        id={"navbar"}
                        className={`fixed top-0 w-full z-40 h-16 sm:h-20 backdrop-blur-md transition-all duration-300 ${
                            darkMode
                                ? 'bg-gray-900/95 border-gray-700'
                                : 'bg-white/95 border-gray-200'
                        } border-b shadow-lg`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 sm:h-20 items-center justify-between">
                        {/* LOGO & TITLE SECTION */}
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/"
                                className="flex-shrink-0 cursor-pointer group relative"
                            >
                                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                                    <div
                                        className={`absolute inset-0 rounded-full transition-all duration-300 group-hover:scale-110 ${
                                            darkMode
                                                ? 'bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-600/20 shadow-lg shadow-blue-500/20'
                                                : 'bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-600/10 shadow-md shadow-blue-500/10'
                                        } group-hover:rotate-12`}></div>
                                    <div
                                        className={`relative w-full h-full rounded-full overflow-hidden transition-all duration-300 group-hover:shadow-xl backdrop-blur-sm ${
                                            darkMode
                                                ? 'bg-gray-900/50 border border-gray-700/50 group-hover:shadow-blue-500/30'
                                                : 'bg-white/50 border border-gray-200/50 group-hover:shadow-blue-500/20'
                                        }`}>
                                        <img
                                            src="/images/logo.png"
                                            alt="NearBy Logo"
                                            className="w-full h-full object-contain p-0 transition-all duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <div
                                        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/0 via-purple-400/0 to-blue-500/0 group-hover:from-blue-400/20 group-hover:via-purple-400/20 group-hover:to-blue-500/20 transition-all duration-300 blur-lg pointer-events-none"></div>
                                </div>
                            </Link>
                            <Link
                                to="/"
                                className={`text-2xl sm:text-3xl font-light bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 ${
                                    darkMode ? 'hover:drop-shadow-lg' : ''
                                }`}
                            >
                                NearBy
                            </Link>
                        </div>
                        {/* DESKTOP NAVIGATION */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={(e) => handleClick(e)}
                                    className={classNames(
                                        'relative px-4 py-2 rounded-lg text-sm font-extralight transition-all duration-300 group',
                                        item.current
                                            ? darkMode
                                                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                                                : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                                            : darkMode
                                                ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                    {!item.current && (
                                        <span
                                            className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                                    )}
                                </Link>
                            ))}
                        </div>
                        {/* RIGHT SECTION */}
                        <div className="flex items-center space-x-3">
                            {/* CONTACT BUTTON - Hidden on mobile */}
                            <div className="hidden sm:block">
                                <Contactusform/>
                            </div>
                            {/* DARK MODE TOGGLE */}
                            <button
                                onClick={toggleDarkMode}
                                className={`relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    darkMode
                                        ? "bg-gray-800 hover:bg-gray-700 text-yellow-400 focus:ring-yellow-400"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500"
                                }`}
                                aria-label="Toggle dark mode"
                            >
                                <div className="relative">
                                    {darkMode ? (
                                        <SunIcon
                                            id={"light-mode"}
                                            className="h-5 w-5 transition-transform duration-300 rotate-0"/>
                                    ) : (
                                        <MoonIcon
                                            id={"dark-mode"}
                                            className="h-5 w-5 transition-transform duration-300 rotate-0"/>
                                    )}
                                </div>
                            </button>
                            {/* LOGIN BUTTON - Hidden on mobile */}
                            <div className="hidden sm:block">
                                <Login/>
                            </div>
                            {/* MOBILE MENU BUTTON */}
                            <div className="lg:hidden">
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className={`p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        darkMode
                                            ? 'text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-gray-500'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
                                    }`}
                                    aria-label="Open menu"
                                >
                                    <Bars3Icon className="h-6 w-6"/>
                                </button>
                            </div>
                        </div>
                        {/* MOBILE DRAWER */}
                        <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                            <div className={`space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                <div className="space-y-3">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            onClick={(e) => {
                                                handleClick(e);
                                                setIsOpen(false);
                                            }}
                                            className={classNames(
                                                'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300',
                                                item.current
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                    : darkMode
                                                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                                    <Contactusform/>
                                    <Login/>
                                </div>
                            </div>
                        </Drawer>
                    </div>
                </div>
            </Disclosure>

            {/* NAVBAR SPACER - This pushes content below the fixed navbar */}
            <div className="h-16 sm:h-20"></div>
        </>
    );
}

export default Navbar;