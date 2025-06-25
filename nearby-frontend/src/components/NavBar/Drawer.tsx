import React, { ReactNode } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from "react-router-dom";

interface DrawerProps {
    children: ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

/**
 * Drawer component renders a sliding side panel overlay.
 * It can be toggled open or closed by controlling the `isOpen` prop.
 *
 * The drawer includes a header with a logo link and a close button.
 * Clicking outside the drawer or on the close icon will close it.
 *
 * @param children - React nodes to be rendered inside the drawer content area
 * @param isOpen - Boolean controlling visibility of the drawer
 * @param setIsOpen - Function to update the drawer visibility state
 * @returns JSX.Element representing the drawer overlay and content
 */
export const Drawer = ({ children, isOpen, setIsOpen }: DrawerProps) => {
    return (
        <main
            className={
                "fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
                (isOpen
                    ? "transition-opacity opacity-100 duration-500 translate-x-0 "
                    : "transition-all delay-500 opacity-0 -translate-x-full ")
            }
        >
            <section
                className={
                    "w-340px max-w-lg left-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform " +
                    (isOpen ? "translate-x-0" : "-translate-x-full")
                }
            >
                <article className="relative w-340px max-w-lg pb-10 flex flex-col space-y-6 h-full">
                    <header className="px-4 py-4 flex items-center">
                        <div className="flex flex-shrink-0 items-center border-right">
                            <Link to="/" className="text-2xl font-extralight text-black">
                                NearBy
                            </Link>
                        </div>

                        <XMarkIcon
                            data-testid="close-drawer"
                            className="block h-6 w-6 cursor-pointer"
                            onClick={() => setIsOpen(false)}
                        />
                    </header>
                    <div
                        onClick={() => {
                            setIsOpen(false);
                        }}
                    >
                        {children}
                    </div>
                </article>
            </section>

            {/* Overlay section to capture clicks outside the drawer and close it */}
            <section
                className="w-screen h-full cursor-pointer"
                onClick={() => setIsOpen(false)}
            ></section>
        </main>
    );
}
