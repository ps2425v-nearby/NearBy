export type RegisterState = {
    email: string;
    name: string;
    password: string;
    isSubmitting: boolean;
};

/**
 * Reducer and state definitions for managing the registration form state.
 *
 * Important aspects:
 * - `RegisterState` holds the form fields: email, name, password, and a submitting flag.
 * - Actions (`RegisterAction`) allow updating each field individually and toggling the submitting state.
 * - `initialRegisterState` initializes all fields empty and submitting as false.
 * - `registerReducer` updates the state immutably based on the dispatched action.
 * - Throws an error if an unknown action type is dispatched to catch programming errors early.
 */

export type RegisterAction =
    | { type: 'SET_EMAIL'; payload: string }
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_PASSWORD'; payload: string }
    | { type: 'SET_SUBMITTING'; payload: boolean };

export const initialRegisterState: RegisterState = {
    email: '',
    name: '',
    password: '',
    isSubmitting: false,
};

export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
    switch (action.type) {
        case 'SET_EMAIL':
            return { ...state, email: action.payload };
        case 'SET_NAME':
            return { ...state, name: action.payload };
        case 'SET_PASSWORD':
            return { ...state, password: action.payload };
        case 'SET_SUBMITTING':
            return { ...state, isSubmitting: action.payload };
        default:
            throw new Error(`Unhandled action type: ${(action as any).type}`);
    }
}
