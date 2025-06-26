export interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin?: (data: LoginData) => void;
    onGoogleLogin?: () => void;
    onFacebookLogin?: () => void;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface FormErrors {
    email?: string;
    password?: string;
}
