export { default } from './index.tsx';
export { default as ModalHeader } from './ModalHeader';
export { default as LoginForm } from './LoginForm';
export { default as RegisterForm } from './RegisterForm';
export { default as ForgotPasswordForm } from './ForgotPasswordForm';
export { default as SocialLogin } from './SocialLogin';
export { default as TabLinks } from './TabLinks';
export { useAuthModal } from './hooks';
export type {
    AuthModalProps,
    LoginFormData,
    RegisterFormData,
    ForgotPasswordFormData,
    LoginData,
    RegisterData,
    ForgotPasswordData,
    FormErrors,
    AuthTab,
    AuthResponse,
    FormContextType,
} from './types';
export {
    MODAL_TITLE,
    LOGIN_TAB_LABEL,
    REGISTER_TAB_LABEL,
    FORGOT_PASSWORD_TAB_LABEL,
    NAME_PLACEHOLDER,
    EMAIL_PLACEHOLDER,
    PASSWORD_PLACEHOLDER,
    CONFIRM_PASSWORD_PLACEHOLDER,
    LOGIN_BUTTON_TEXT,
    REGISTER_BUTTON_TEXT,
    SEND_RESET_LINK_TEXT,
    LOADING_TEXT,
    FORGOT_PASSWORD_TEXT,
    BACK_TO_LOGIN_TEXT,
    HAVE_ACCOUNT_TEXT,
    NO_ACCOUNT_TEXT,
    LOGIN_LINK_TEXT,
    REGISTER_LINK_TEXT,
    GOOGLE_LOGIN_TEXT,
    FACEBOOK_LOGIN_TEXT,
    OR_DIVIDER_TEXT,
    LOGIN_SUCCESS_MESSAGE,
    REGISTER_SUCCESS_MESSAGE,
    RESET_LINK_SENT_MESSAGE,
    LOGIN_FAILED_MESSAGE,
    REGISTER_FAILED_MESSAGE,
    RESET_LINK_FAILED_MESSAGE,
    VALIDATION_MESSAGES,
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
} from './constants';
