export type RegisterState = {
    email: string;
    name: string;
    password: string;
    isSubmitting: boolean;
};

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
