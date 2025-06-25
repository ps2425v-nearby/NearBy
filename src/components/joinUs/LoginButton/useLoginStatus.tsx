import { useCookies } from 'react-cookie';
import { useAuth } from "@/AuthContext";

export const useLoginStatus = () => {
    const auth = useAuth();
    const isLoggedIn = auth.loggedIn
    const username = auth.username
    const [,removeCookie] = useCookies(['token']);

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", { method: "POST", credentials: "include" });
            removeCookie('token', { path: '/' });  // <- remover cookie aqui
            auth.setUsername(null);
            auth.setUserID(null);
            auth.setLoggedIn(false);
            localStorage.removeItem("markerRadii")
            window.location.reload();
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    return { isLoggedIn, username, handleLogout };
};
