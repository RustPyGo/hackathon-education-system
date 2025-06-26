import * as yup from 'yup';

export const MODAL_TITLE = 'Xác thực';

// Tab Labels
export const LOGIN_TAB_LABEL = 'Đăng nhập';
export const REGISTER_TAB_LABEL = 'Đăng ký';
export const FORGOT_PASSWORD_TAB_LABEL = 'Quên mật khẩu';

// Form Placeholders
export const NAME_PLACEHOLDER = 'Nhập họ và tên';
export const EMAIL_PLACEHOLDER = 'Nhập email của bạn';
export const PASSWORD_PLACEHOLDER = 'Nhập mật khẩu';
export const CONFIRM_PASSWORD_PLACEHOLDER = 'Nhập lại mật khẩu';

// Button Texts
export const LOGIN_BUTTON_TEXT = 'Đăng nhập';
export const REGISTER_BUTTON_TEXT = 'Đăng ký';
export const SEND_RESET_LINK_TEXT = 'Gửi link đặt lại';
export const LOADING_TEXT = 'Đang xử lý...';

// Link Texts
export const FORGOT_PASSWORD_TEXT = 'Quên mật khẩu?';
export const BACK_TO_LOGIN_TEXT = 'Quay lại đăng nhập';
export const HAVE_ACCOUNT_TEXT = 'Đã có tài khoản?';
export const NO_ACCOUNT_TEXT = 'Chưa có tài khoản?';
export const LOGIN_LINK_TEXT = 'Đăng nhập ngay';
export const REGISTER_LINK_TEXT = 'Đăng ký ngay';

// Social Login
export const GOOGLE_LOGIN_TEXT = 'Đăng nhập với Google';
export const FACEBOOK_LOGIN_TEXT = 'Đăng nhập với Facebook';
export const OR_DIVIDER_TEXT = 'hoặc';

// Success Messages
export const LOGIN_SUCCESS_MESSAGE = 'Đăng nhập thành công!';
export const REGISTER_SUCCESS_MESSAGE = 'Đăng ký thành công!';
export const RESET_LINK_SENT_MESSAGE = 'Link đặt lại mật khẩu đã được gửi!';

// Error Messages
export const LOGIN_FAILED_MESSAGE = 'Đăng nhập thất bại!';
export const REGISTER_FAILED_MESSAGE = 'Đăng ký thất bại!';
export const RESET_LINK_FAILED_MESSAGE = 'Gửi link thất bại!';

// Validation Messages
export const VALIDATION_MESSAGES = {
    NAME_REQUIRED: 'Họ và tên là bắt buộc',
    NAME_MIN_LENGTH: 'Họ và tên phải có ít nhất 2 ký tự',
    EMAIL_REQUIRED: 'Email là bắt buộc',
    EMAIL_INVALID: 'Email không hợp lệ',
    PASSWORD_REQUIRED: 'Mật khẩu là bắt buộc',
    PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự',
    PASSWORD_MATCH: 'Mật khẩu không khớp',
    CONFIRM_PASSWORD_REQUIRED: 'Xác nhận mật khẩu là bắt buộc',
} as const;

// Validation Schemas
export const loginSchema = yup.object({
    email: yup
        .string()
        .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .email(VALIDATION_MESSAGES.EMAIL_INVALID),
    password: yup
        .string()
        .required(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
        .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
});

export const registerSchema = yup.object({
    name: yup
        .string()
        .required(VALIDATION_MESSAGES.NAME_REQUIRED)
        .min(2, VALIDATION_MESSAGES.NAME_MIN_LENGTH),
    email: yup
        .string()
        .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .email(VALIDATION_MESSAGES.EMAIL_INVALID),
    password: yup
        .string()
        .required(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
        .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: yup
        .string()
        .required(VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED)
        .oneOf([yup.ref('password')], VALIDATION_MESSAGES.PASSWORD_MATCH),
});

export const forgotPasswordSchema = yup.object({
    email: yup
        .string()
        .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .email(VALIDATION_MESSAGES.EMAIL_INVALID),
});
