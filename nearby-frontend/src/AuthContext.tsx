import * as React from "react";

/** Global authentication state. */
interface AuthState {
    loggedIn: boolean;
    username: string | null;
    userID: number | null;
}

/** Actions that can update the authentication state. */
type AuthAction =
    | { type: "SET_LOGGED_IN"; payload: boolean }
    | { type: "SET_USERNAME"; payload: string | null }
    | { type: "SET_USER_ID"; payload: number | null };

/**
 * Reducer that updates the auth state based on the dispatched action.
 */
export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "SET_LOGGED_IN":
            return { ...state, loggedIn: action.payload };
        case "SET_USERNAME":
            return { ...state, username: action.payload };
        case "SET_USER_ID":
            return { ...state, userID: action.payload };
        default:
            return state;
    }
}

/** Shape of the authentication context exposed to consumers. */
interface AuthContextType extends AuthState {
    dispatch: React.Dispatch<AuthAction>;
    setUsername: (username: string | null) => void;
    setLoggedIn: (loggedIn: boolean) => void;
    setUserID: (userID: number | null) => void;
    logout: () => void;
}

/**
 * Reads any persisted auth data from `localStorage`
 * and returns it as the initial state for the reducer.
 */
const getInitialAuthState = (): AuthState => {
    if (typeof window !== "undefined") {
        const username = localStorage.getItem("username");
        const userID = localStorage.getItem("userID");
        return {
            loggedIn: !!username,
            username,
            userID: userID ? Number(userID) : null,
        };
    }
    return { loggedIn: false, username: null, userID: null };
};

// Create the context (left undefined until provided below).
export const AuthContext =
    React.createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = "AuthContext";

/**
 * Provides authentication state and helpers to the component tree.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = React.useReducer<React.Reducer<AuthState, AuthAction>>(
        authReducer,
        getInitialAuthState()
    );

    /** Updates username and syncs it to localStorage. */
    const setUsername = (username: string | null) => {
        if (username) {
            localStorage.setItem("username", username);
        } else {
            localStorage.removeItem("username");
            setUserID(null); // clear ID as well
        }
        dispatch({ type: "SET_USERNAME", payload: username });
        dispatch({ type: "SET_LOGGED_IN", payload: !!username });
    };

    /** Toggles the `loggedIn` flag. */
    const setLoggedIn = (loggedIn: boolean) =>
        dispatch({ type: "SET_LOGGED_IN", payload: loggedIn });

    /** Persists the user ID (or removes it) in localStorage. */
    const setUserID = (userID: number | null) => {
        if (userID !== null) {
            localStorage.setItem("userID", String(userID));
        } else {
            localStorage.removeItem("userID");
        }
        dispatch({ type: "SET_USER_ID", payload: userID });
    };

    /** Clears all auth data and logs the user out. */
    const logout = () => {
        setUsername(null);
        setUserID(null);
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider
            value={{ ...state, dispatch, setUsername, setLoggedIn, setUserID, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access the authentication context.
 * Throws if used outside an `<AuthProvider>`.
 */
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
