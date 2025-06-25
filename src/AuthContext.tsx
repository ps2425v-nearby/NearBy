import * as React from "react";

interface AuthState {
    loggedIn: boolean;
    username: string | null;
    userID: number | null;
}

type AuthAction =
    | { type: "SET_LOGGED_IN"; payload: boolean }
    | { type: "SET_USERNAME"; payload: string | null }
    | { type: "SET_USER_ID"; payload: number | null };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "SET_LOGGED_IN":
            return {...state, loggedIn: action.payload};
        case "SET_USERNAME":
            return {...state, username: action.payload};
        case "SET_USER_ID":
            return {...state, userID: action.payload};
        default:
            return state;
    }
}

interface AuthContextType extends AuthState {
    dispatch: React.Dispatch<AuthAction>;
    setUsername: (username: string | null) => void;
    setLoggedIn: (loggedIn: boolean) => void;
    setUserID: (userID: number | null) => void;
    logout: () => void;
}

const getInitialAuthState = (): AuthState => {
    if (typeof window !== "undefined") {
        const username = localStorage.getItem("username");
        const userID = localStorage.getItem("userID");

        return {
            loggedIn: !!username,
            username: username,
            userID: userID ? Number(userID) : null,
        };
    }
    return {
        loggedIn: false,
        username: null,
        userID: null,
    };
};

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({children}: { children: React.ReactNode }) => {

    const [state, dispatch] = React.useReducer<React.Reducer<AuthState, AuthAction>>(
        authReducer,
        getInitialAuthState()
    );

    const setUsername = (username: string | null) => {
        if (username !== null) {
            localStorage.setItem("username", username);
        } else {
            localStorage.removeItem("username");
            setUserID(null); // Ensure userID is also removed on logout
        }
        dispatch({type: "SET_USERNAME", payload: username});
        dispatch({type: "SET_LOGGED_IN", payload: !!username});
    };

    const setLoggedIn = (loggedIn: boolean) => {
        dispatch({type: "SET_LOGGED_IN", payload: loggedIn});
    };

    const setUserID = (userID: number | null) => {
        if (userID !== null) {
            localStorage.setItem("userID", userID.toString());
        } else {
            localStorage.removeItem("userID");
        }
        dispatch({type: "SET_USER_ID", payload: userID});
    };

    const logout = () => {
        setUsername(null);
        setUserID(null);
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                dispatch,
                setUsername,
                setLoggedIn,
                setUserID,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
