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
