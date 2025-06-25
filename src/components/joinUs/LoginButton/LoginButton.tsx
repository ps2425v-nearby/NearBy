import { useLoginStatus } from "./useLoginStatus";
import { useDarkModeSafe } from "./useDarkModeSafe";

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
