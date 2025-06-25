import { useLoginStatus } from "./useLoginStatus";
import { useDarkModeSafe } from "./useDarkModeSafe";


/**
 * LoginButton component handles displaying either a login or logout button based on user status.
 *
 * Key points:
 * - Uses custom hook `useLoginStatus` to get current login state (`isLoggedIn`), username, and logout handler.
 * - Uses `useDarkModeSafe` hook to adapt styles based on dark mode setting.
 * - When logged out, clicking the button triggers the `openModal` callback to show the login modal.
 * - When logged in, clicking the button triggers the logout action via `handleLogout`.
 * - Shows a user icon or logout icon depending on login state.
 * - When logged in, displays a welcome message with the username.
 * - Button and icon styles adapt to dark mode for consistent theming.
 */

const LoginButton = ({ openModal }: { openModal: () => void }) => {
    const { isLoggedIn, username, handleLogout } = useLoginStatus();
    const { darkMode } = useDarkModeSafe();

    return (
        <button
            onClick={isLoggedIn ? handleLogout : openModal}
            className={`group flex items-center gap-2 transition-colors py-3 px-3 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 ${
                darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
            }`}
        >
            <img
                src={isLoggedIn ? "/images/logout-icon.png" : "/images/user-icon.png"}
                alt={isLoggedIn ? "Logout Icon" : "User Icon"}
                className={`w-6 h-6 transition-transform duration-200 ${
                    darkMode ? "filter invert group-hover:scale-110" : "group-hover:scale-110"
                }`}
            />
            {isLoggedIn && username && (
                <span className="ml-2 font-extralight">
          Bem-vindo <strong className="font-medium">{username}</strong>!
        </span>
            )}
        </button>
    );
};

export default LoginButton;
