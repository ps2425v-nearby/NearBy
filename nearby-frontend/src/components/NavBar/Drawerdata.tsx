import React from "react";
import { Link } from "react-router-dom";

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    { name: 'Equipa', href: '/aboutus', current: false },
    { name: 'As minhas Localizações', href: '/savedLocations', current: false },
    { name: 'Comentários', href: '/comments', current: false },
    { name: 'Procura por Filtros', href: '/filtersearch', current: false },
    { name: 'GitHub', href: 'https://github.com/orgs/ps2425v-nearby/repositories', current: false },
]

/**
 * Utility function to join multiple class names conditionally.
 * Filters out falsy values and joins the rest with spaces.
 *
 * @param classes - List of class names (strings) that may be conditionally applied
 * @returns {string} Concatenated class string
 */
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

/**
 * Data component renders a vertical navigation menu with links and a "Contact Us" button.
 *
 * Each navigation item is rendered as a Link. The currently active item can be styled differently.
 * The "Contact Us" button is styled and placed below the links.
 *
 * @returns {JSX.Element} Navigation menu UI
 */
const Data = () => {
    return (
        <div className="rounded-md max-w-sm w-full mx-auto">
            <div className="flex-1 space-y-4 py-1">
                <div className="sm:block">
                    <div className="space-y-1 px-5 pt-2 pb-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={classNames(
                                    item.current ? 'bg-blue-950 text-purple' : 'text-blue-950 hover:text-purple',
                                    'block py-2 rounded-md text-base font-medium'
                                )}
                                aria-current={item.current ? 'page' : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="mt-4"></div>
                        <button className="bg-navyblue w-full hover:text-blue-950 font-medium py-2 px-4 rounded">
                            Contact Us
                        </button>
                        {/* <Contactusform /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Data;
