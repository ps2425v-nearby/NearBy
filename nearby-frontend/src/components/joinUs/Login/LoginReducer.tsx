export type LoginState = {
    username: string;
    password: string;
    submitting: boolean;
};

export type LoginAction =
    | { type: "SET_USERNAME"; payload: string }
    | { type: "SET_PASSWORD"; payload: string }
    | { type: "SET_SUBMITTING"; payload: boolean };

export const initialState: LoginState = {
    username: "",
    password: "",
    submitting: false,
};
/**
 * Reducer and types for managing login form state.
 *
 * LoginState:
 * - username: current value of the username input field.
 * - password: current value of the password input field.
 * - submitting: boolean indicating whether the login request is in progress.
 *
 * LoginAction:
 * - SET_USERNAME: updates the username state.
 * - SET_PASSWORD: updates the password state.
 * - SET_SUBMITTING: toggles the submitting state (true when submitting, false otherwise).
 *
 * loginReducer:
 * - Pure reducer function that updates the state based on the dispatched action.
 * - Throws an error if an unknown action type is dispatched, helping catch bugs early.
 *
 * initialState:
 * - Defines the default values for the login form state when the component mounts.
 */


export function loginReducer(state: LoginState, action: LoginAction): LoginState {
    switch (action.type) {
        case "SET_USERNAME":
            return { ...state, username: action.payload };
        case "SET_PASSWORD":
            return { ...state, password: action.payload };
        case "SET_SUBMITTING":
            return { ...state, submitting: action.payload };
        default:
            throw new Error(`Unhandled action type: ${(action as any).type}`);
    }
}
