import { useCookies } from 'react-cookie';
import { useAuth } from "@/AuthContext";
import {requestUrl} from "@/utils/Backend_URL";
import { useNavigate } from "react-router-dom";
/**
 * Custom hook to manage and provide the current user's login status and logout functionality.
 *
 * Important details:
 * - Uses the global authentication context (`useAuth`) to get login state and username.
 * - Uses `react-cookie` to handle cookie removal on logout.
 * - Defines `handleLogout` function that:
 *    - Sends a logout request to the server.
 *    - Removes the authentication token cookie.
 *    - Clears user-related state in the auth context.
 *    - Removes related localStorage items.
 *    - Reloads the page to reset the app state.
 * - Returns:
 *    - `isLoggedIn`: boolean indicating if a user is currently logged in.
 *    - `username`: the logged-in user's username.
 *    - `handleLogout`: function to log out the current user safely.
 */

export const useLoginStatus = () => {
    const auth = useAuth();
    const isLoggedIn = auth.loggedIn
    const username = auth.username
    const [,removeCookie] = useCookies(['token']);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch(`${requestUrl}/api/logout`, { method: "POST", credentials: "include" });
            removeCookie('token', { path: '/' });  // <- remover cookie aqui
            auth.setUsername(null);
            auth.setUserID(null);
            auth.setLoggedIn(false);
            localStorage.removeItem("markerRadii")
            navigate("/"); // Redirect to main page
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    return { isLoggedIn, username, handleLogout };
};
